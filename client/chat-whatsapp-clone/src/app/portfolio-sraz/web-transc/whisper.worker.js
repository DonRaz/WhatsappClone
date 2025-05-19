// whisper.worker.js

// Define MAX_NEW_TOKENS that was missing
const MAX_NEW_TOKENS = 64;
// ____________________ Transformers loading _____________________________ START
// ____________________ Dynamic importing transformers ________________ START
// // importing model dynamically transformers library
// async function loadTransformers() {
//     try {
//         // Import the module directly - this returns the actual module object
//         const transformersModule = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.1.1/dist/transformers.min.js');
        
//         // The module exports what we need directly
//         return transformersModule;
//     } catch (error) {
//         console.error('Error loading transformers:', error);
//         self.postMessage({
//             status: 'error',
//             data: 'Failed to load transformers library: ' + error.message
//         });
//         throw error;
//     }
// }

// // First, ensure we have the transformers library loaded
// const transformers = await loadTransformers();

// console.log('Transformers loaded:', transformers);

// // Destructure what we need from the transformers object
// const {
//     AutoTokenizer,
//     AutoProcessor,
//     WhisperForConditionalGeneration,
//     TextStreamer,
//     full,
// } = transformers;
// ____________________ Dynamic importing transformers ________________ END
// ____________________ transformers from directly installed package ________________ START

import {
    AutoTokenizer,
    AutoProcessor,
    WhisperForConditionalGeneration,
    TextStreamer,
    full,
} from '@huggingface/transformers'; // <--- Change this line
// ____________________ transformers from directly installed package ________________ END

// ____________________ Transformers loading _____________________________ END

class AutomaticSpeechRecognitionPipeline {
    static model_id = null;
    static tokenizer = null;
    static processor = null;
    static model = null;

    static async getInstance(progress_callback = null) {

        this.model_id = 'onnx-community/whisper-small';

        this.tokenizer ??= AutoTokenizer.from_pretrained(this.model_id, {
            progress_callback,
        });
        this.processor ??= AutoProcessor.from_pretrained(this.model_id, {
            progress_callback,
        });

        this.model ??= WhisperForConditionalGeneration.from_pretrained(this.model_id, {
            dtype: {
                encoder_model: 'fp32',
                decoder_model_merged: 'q4',
            },
            device: 'webgpu',
            progress_callback,
        });

        return Promise.all([this.tokenizer, this.processor, this.model]);
    }
}

let processing = false;
async function generate({ audio, language }) {
    if (processing) return;
    processing = true;

    // Tell the main thread we are starting
    self.postMessage({ status: 'start' });

    // Retrieve the text-generation pipeline.
    const [tokenizer, processor, model] = await AutomaticSpeechRecognitionPipeline.getInstance();

    let startTime;
    let numTokens = 0;
    const callback_function = (output) => {
        startTime ??= performance.now();

        let tps;
        if (numTokens++ > 0) {
            tps = numTokens / (performance.now() - startTime) * 1000;
        }
        self.postMessage({
            status: 'update',
            output, tps, numTokens,
        });
    }

    const streamer = new TextStreamer(tokenizer, {
        skip_prompt: true,
        skip_special_tokens: true,
        callback_function,
    });

    const inputs = await processor(audio);

    const outputs = await model.generate({
        ...inputs,
        max_new_tokens: MAX_NEW_TOKENS,
        language,
        streamer,
    });

    const outputText = tokenizer.batch_decode(outputs, { skip_special_tokens: true });

    // Send the output back to the main thread
    self.postMessage({
        status: 'complete',
        output: outputText,
    });
    processing = false;
}

async function load() {
    self.postMessage({
        status: 'loading',
        data: 'Loading model...'
    });

    // Load the pipeline and save it for future use.
    const [tokenizer, processor, model] = await AutomaticSpeechRecognitionPipeline.getInstance(x => {
        // We also add a progress callback to the pipeline so that we can
        // track model loading.
        self.postMessage(x);
    });

    self.postMessage({
        status: 'loading',
        data: 'Compiling shaders and warming up model...'
    });

    // Run model with dummy input to compile shaders
    await model.generate({
        input_features: full([1, 80, 3000], 0.0),
        max_new_tokens: 1,
    });
    self.postMessage({ status: 'ready' });
}
// Listen for messages from the main thread
self.addEventListener('message', async (e) => {
    const { type, data } = e.data;

    switch (type) {
        case 'load':
            load();
            break;

        case 'generate':
            generate(data);
            break;
    }
});


// using self clarifies that the code is operating in the worker's context.




// ORIGINAL Initialization (when Transformers.js is installed locally via npm)
// import {
//     AutoTokenizer,
//     AutoProcessor,
//     WhisperForConditionalGeneration,
//     TextStreamer,
//     full,
// } from '@huggingface/transformers';


// const MAX_NEW_TOKENS = 64;
// /**
//  * This class uses the Singleton pattern to ensure that only one instance of the model is loaded.
//  */
// class AutomaticSpeechRecognitionPipeline {
//     static model_id = null;
//     static tokenizer = null;
//     static processor = null;
//     static model = null;

//     static async getInstance(progress_callback = null) {
//         this.model_id = 'onnx-community/whisper-base';

//         this.tokenizer ??= AutoTokenizer.from_pretrained(this.model_id, {
//             progress_callback,
//         });
//         this.processor ??= AutoProcessor.from_pretrained(this.model_id, {
//             progress_callback,
//         });

//         this.model ??= WhisperForConditionalGeneration.from_pretrained(this.model_id, {
//             dtype: {
//                 encoder_model: 'fp32', // 'fp16' works too
//                 decoder_model_merged: 'q4', // or 'fp32' ('fp16' is broken)
//             },
//             device: 'webgpu',
//             progress_callback,
//         });

//         return Promise.all([this.tokenizer, this.processor, this.model]);
//     }
// }

// ____________ Original Worker Code _____________

// import {
//     AutoTokenizer,
//     AutoProcessor,
//     WhisperForConditionalGeneration,
//     TextStreamer,
//     full,
// } from '@huggingface/transformers';


// const MAX_NEW_TOKENS = 64;

// /**
//  * This class uses the Singleton pattern to ensure that only one instance of the model is loaded.
//  */
// class AutomaticSpeechRecognitionPipeline {
//     static model_id = null;
//     static tokenizer = null;
//     static processor = null;
//     static model = null;

//     static async getInstance(progress_callback = null) {
//         this.model_id = 'onnx-community/whisper-base';

//         this.tokenizer ??= AutoTokenizer.from_pretrained(this.model_id, {
//             progress_callback,
//         });
//         this.processor ??= AutoProcessor.from_pretrained(this.model_id, {
//             progress_callback,
//         });

//         this.model ??= WhisperForConditionalGeneration.from_pretrained(this.model_id, {
//             dtype: {
//                 encoder_model: 'fp32', // 'fp16' works too
//                 decoder_model_merged: 'q4', // or 'fp32' ('fp16' is broken)
//             },
//             device: 'webgpu',
//             progress_callback,
//         });

//         return Promise.all([this.tokenizer, this.processor, this.model]);
//     }
// }

// let processing = false;
// async function generate({ audio, language }) {
//     if (processing) return;
//     processing = true;

//     // Tell the main thread we are starting
//     self.postMessage({ status: 'start' });

//     // Retrieve the text-generation pipeline.
//     const [tokenizer, processor, model] = await AutomaticSpeechRecognitionPipeline.getInstance();

//     let startTime;
//     let numTokens = 0;
//     const callback_function = (output) => {
//         startTime ??= performance.now();

//         let tps;
//         if (numTokens++ > 0) {
//             tps = numTokens / (performance.now() - startTime) * 1000;
//         }
//         self.postMessage({
//             status: 'update',
//             output, tps, numTokens,
//         });
//     }

//     const streamer = new TextStreamer(tokenizer, {
//         skip_prompt: true,
//         skip_special_tokens: true,
//         callback_function,
//     });

//     const inputs = await processor(audio);

//     const outputs = await model.generate({
//         ...inputs,
//         max_new_tokens: MAX_NEW_TOKENS,
//         language,
//         streamer,
//     });

//     const outputText = tokenizer.batch_decode(outputs, { skip_special_tokens: true });

//     // Send the output back to the main thread
//     self.postMessage({
//         status: 'complete',
//         output: outputText,
//     });
//     processing = false;
// }

// async function load() {
//     self.postMessage({
//         status: 'loading',
//         data: 'Loading model...'
//     });

//     // Load the pipeline and save it for future use.
//     const [tokenizer, processor, model] = await AutomaticSpeechRecognitionPipeline.getInstance(x => {
//         // We also add a progress callback to the pipeline so that we can
//         // track model loading.
//         self.postMessage(x);
//     });

//     self.postMessage({
//         status: 'loading',
//         data: 'Compiling shaders and warming up model...'
//     });

//     // Run model with dummy input to compile shaders
//     await model.generate({
//         input_features: full([1, 80, 3000], 0.0),
//         max_new_tokens: 1,
//     });
//     self.postMessage({ status: 'ready' });
// }
// // Listen for messages from the main thread
// self.addEventListener('message', async (e) => {
//     const { type, data } = e.data;

//     switch (type) {
//         case 'load':
//             load();
//             break;

//         case 'generate':
//             generate(data);
//             break;
//     }
// });
