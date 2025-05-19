'use client';
// src/app/web-transc/components/WhisperTranscription.jsx
import { useEffect, useState, useRef } from 'react';
import { AudioVisualizer } from './AudioVisualizer';
import Progress from './Progress';
import { LanguageSelector } from './LanguageSelector';
import { Button } from '@/components/ui/button';

const WHISPER_SAMPLING_RATE = 16_000;
const MAX_AUDIO_LENGTH = 30; // seconds
const MAX_SAMPLES = WHISPER_SAMPLING_RATE * MAX_AUDIO_LENGTH;

export function WhisperTranscription() {
  // Check WebGPU availability on mount
  const [isWebGPUAvailable, setIsWebGPUAvailable] = useState(false);
  
  // Create a reference to the worker object.
  const worker = useRef(null);
  const recorderRef = useRef(null);

  // Model loading and progress
  const [status, setStatus] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [progressItems, setProgressItems] = useState([]);

  // Inputs and outputs
  const [text, setText] = useState('');
  const [tps, setTps] = useState(null);
  const [language, setLanguage] = useState('en');

  // Processing
  const [recording, setRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chunks, setChunks] = useState([]);
  const [stream, setStream] = useState(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    // Check for WebGPU support
    setIsWebGPUAvailable(!!window?.navigator?.gpu);

    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(
        new URL('../whisper.worker.js', import.meta.url),
        { type: 'module' }
      );
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e) => {
      switch (e.data.status) {
        case 'loading':
          setStatus('loading');
          setLoadingMessage(e.data.data);
          break;
        case 'initiate':
          setProgressItems(prev => [...prev, e.data]);
          break;
        case 'progress':
          setProgressItems(
            prev => prev.map(item => {
              if (item.file === e.data.file) {
                return { ...item, ...e.data }
              }
              return item;
            })
          );
          break;
        case 'done':
          setProgressItems(
            prev => prev.filter(item => item.file !== e.data.file)
          );
          break;
        case 'ready':
          setStatus('ready');
          recorderRef.current?.start();
          break;
        case 'start':
          setIsProcessing(true);
          recorderRef.current?.requestData();
          break;
        case 'update':
          const { tps } = e.data;
          setTps(tps);
          break;
        case 'complete':
          setIsProcessing(false);
          setText(e.data.output);
          break;
      }
    };

    worker.current.addEventListener('message', onMessageReceived);
    // TODO: remove anc clean the reference to the worker.
    return () => worker.current?.removeEventListener('message', onMessageReceived);
  }, []);

  // Setup audio recording
  useEffect(() => {
    if (recorderRef.current) return;

    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          setStream(stream);
          recorderRef.current = new MediaRecorder(stream);
          audioContextRef.current = new AudioContext({ sampleRate: WHISPER_SAMPLING_RATE });

          recorderRef.current.onstart = () => {
            setRecording(true);
            setChunks([]);
          };
          
          recorderRef.current.ondataavailable = (e) => {
            if (e.data.size > 0) {
              setChunks((prev) => [...prev, e.data]);
            } else {
              setTimeout(() => {
                recorderRef.current?.requestData();
              }, 25);
            }
          };

          recorderRef.current.onstop = () => {
            setRecording(false);
          };
        })
        .catch(err => console.error("Media device error:", err));
    }

    return () => {
      recorderRef.current?.stop();
      recorderRef.current = null;
    };
  }, []);

  // Handle audio processing
  useEffect(() => {
    if (!recorderRef.current) return;
    if (!recording) return;
    if (isProcessing) return;
    if (status !== 'ready') return;

    if (chunks.length > 0) {
      const blob = new Blob(chunks, { type: recorderRef.current.mimeType });
      const fileReader = new FileReader();

      fileReader.onloadend = async () => {
        const arrayBuffer = fileReader.result;
        const decoded = await audioContextRef.current.decodeAudioData(arrayBuffer);
        let audio = decoded.getChannelData(0);
        if (audio.length > MAX_SAMPLES) {
          audio = audio.slice(-MAX_SAMPLES);
        }

        worker.current.postMessage({ type: 'generate', data: { audio, language } });
      };
      
      fileReader.readAsArrayBuffer(blob);
    } else {
      recorderRef.current?.requestData();
    }
  }, [status, recording, isProcessing, chunks, language]);

  if (!isWebGPUAvailable) { // no fallback mechanizm to wasm. 
    return (
      <div className="fixed w-screen h-screen bg-black z-10 bg-opacity-[92%] text-white text-2xl font-semibold flex justify-center items-center text-center">
        WebGPU is not supported<br />by this browser :&#40;
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen mx-auto justify-end text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900">
      <div className="h-full overflow-auto scrollbar-thin flex justify-center items-center flex-col relative">
        <div className="flex flex-col items-center mb-1 max-w-[400px] text-center">
          <h1 className="text-4xl font-bold mb-1">Whisper WebGPU</h1>
          <h2 className="text-xl font-semibold">Real-time in-browser speech recognition</h2>
        </div>

        <div className="flex flex-col items-center px-4">
          {status === null && (
            <>
              <p className="max-w-[480px] mb-4">
                <br />
                You are about to load whisper-base, a 73 million parameter speech recognition model.
                Once downloaded, the model (~200 MB) will be cached and reused when you revisit the page.
                <br /><br />
                Everything runs directly in your browser using WebGPU - no data is sent to a server.
              </p>

              <Button
                onClick={() => {
                  worker.current.postMessage({ type: 'load' });
                  setStatus('loading');
                }}
                disabled={status !== null}
              >
                Load model
              </Button>
            </>
          )}

          <div className="w-[500px] p-2 space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Audio Waveform:</p>

            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Frequency Visualization:</p>
            </div>
            <div className="bg-black/95 dark:bg-black/95 rounded-lg p-3 flex items-center justify-center h-[80px] overflow-hidden shadow-inner border border-gray-800">
                <AudioVisualizer className="w-full h-full" stream={stream} />
              </div>
            {status === 'ready' && (
              <div className="relative mt-4">
                <p className="w-full h-[80px] overflow-y-auto overflow-wrap-anywhere border rounded-lg p-2 bg-white/5 dark:bg-white/5">
                  {text || "Speak to see transcription..."}
                </p>
                {tps && <span className="absolute bottom-0 right-0 px-1 text-xs text-primary">{tps.toFixed(2)} tok/s</span>}
              </div>
            )}
          </div>

          {status === 'ready' && (
            <div className='relative w-full flex justify-center mt-2'>
              <LanguageSelector 
                language={language} 
                setLanguage={(e) => {
                  recorderRef.current?.stop();
                  setLanguage(e);
                  recorderRef.current?.start();
                }} 
              />
              <button 
                className="border rounded-lg px-2 absolute right-2 hover:bg-primary/10 transition-colors" 
                onClick={() => {
                  recorderRef.current?.stop();
                  recorderRef.current?.start();
                }}
              >
                Reset
              </button>
            </div>
          )}

          {status === 'loading' && (
            <div className="w-full max-w-[500px] text-left mx-auto p-4">
              <p className="text-center">{loadingMessage}</p>
              {progressItems.map(({ file, progress, total }, i) => (
                <Progress key={i} text={file} percentage={progress} total={total} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}