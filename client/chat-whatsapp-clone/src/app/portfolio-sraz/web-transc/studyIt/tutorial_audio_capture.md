# Audio Capture and Real-Time Streaming in Web Applications

## Quick Overview
The project implements a sophisticated audio capture and processing pipeline that continuously captures audio, processes it in chunks, and streams the transcription results back to the user interface.

## Key Benefits Implemented

1. Efficient Audio Processing
   - Continuous audio capture without gaps
   - Memory-efficient chunk processing
   - Sample rate optimization for ML model

2. Real-Time Feedback
   - Live audio visualization
   - Streaming transcription updates
   - Immediate language switching

3. Resource Management
   - Controlled memory usage
   - Proper cleanup of audio resources
   - Automatic resource reallocation

4. User Experience
   - Visual feedback during recording
   - No UI blocking during processing
   - Seamless language switching

## Implementation Guide

### 1. Audio Capture Setup

```javascript
useEffect(() => {
    if (recorderRef.current) return; // Already set

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                setStream(stream);

                recorderRef.current = new MediaRecorder(stream);
                audioContextRef.current = new AudioContext({ 
                    sampleRate: WHISPER_SAMPLING_RATE 
                });

                // Configure recorder events
                recorderRef.current.onstart = () => {
                    setRecording(true);
                    setChunks([]);
                }
                
                recorderRef.current.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        setChunks((prev) => [...prev, e.data]);
                    } else {
                        // Request new data after short timeout
                        setTimeout(() => {
                            recorderRef.current.requestData();
                        }, 25);
                    }
                };

                recorderRef.current.onstop = () => {
                    setRecording(false);
                };
            })
    }

    return () => {
        recorderRef.current?.stop();
        recorderRef.current = null;
    };
}, []);
```

Key Components:
1. Stream Setup
   - Uses MediaDevices API for audio capture
   - Configures correct sampling rate for ML model
   - Implements proper resource cleanup

2. Recorder Configuration
   - Sets up event handlers for data flow
   - Manages recording state
   - Implements continuous data collection

### 2. Audio Processing Pipeline

```javascript
useEffect(() => {
    if (!recorderRef.current) return;
    if (!recording) return;
    if (isProcessing) return;
    if (status !== 'ready') return;

    if (chunks.length > 0) {
        // Generate from data
        const blob = new Blob(chunks, { 
            type: recorderRef.current.mimeType 
        });

        const fileReader = new FileReader();

        fileReader.onloadend = async () => {
            const arrayBuffer = fileReader.result;
            const decoded = await audioContextRef.current
                .decodeAudioData(arrayBuffer);
            let audio = decoded.getChannelData(0);
            
            if (audio.length > MAX_SAMPLES) {
                audio = audio.slice(-MAX_SAMPLES);
            }

            worker.current.postMessage({ 
                type: 'generate', 
                data: { audio, language } 
            });
        }
        fileReader.readAsArrayBuffer(blob);
    }
}, [status, recording, isProcessing, chunks, language]);
```

Key Components:
1. Processing Trigger Conditions
   - Checks for active recorder
   - Verifies recording state
   - Ensures model readiness

2. Audio Data Processing
   - Converts chunks to processable format
   - Applies necessary audio transformations
   - Manages sample size limitations

### 3. Visualization Implementation

```javascript
export function AudioVisualizer({ stream, ...props }) {
    const canvasRef = useRef(null);

    const visualize = useCallback((stream) => {
        const audioContext = new (window.AudioContext || 
            window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);

        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const drawVisual = () => {
            requestAnimationFrame(drawVisual);
            analyser.getByteTimeDomainData(dataArray);

            // Drawing logic...
        };

        drawVisual();
    }, []);

    useEffect(() => {
        stream && visualize(stream);
    }, [visualize, stream]);
    
    return (
        <canvas {...props} ref={canvasRef}></canvas>
    );
}
```

Key Components:
1. Audio Analysis Setup
   - Creates analyzer node
   - Configures buffer size
   - Sets up visualization loop

2. Visualization Loop
   - Uses RequestAnimationFrame for smooth updates
   - Processes audio data in real-time
   - Provides visual feedback

## Best Practices Summary

1. Resource Management
   - Initialize audio context with correct sampling rate
   - Clean up resources when component unmounts
   - Handle stream and recorder lifecycle properly

2. Error Handling
   - Check for browser compatibility
   - Handle permission denials
   - Manage connection failures

3. Performance Optimization
   - Process audio in chunks
   - Limit sample size
   - Use efficient data structures

4. User Experience
   - Provide visual feedback
   - Implement smooth transitions
   - Handle state changes gracefully

## Implementation Checklist

1. Audio Capture
   - [ ] Request user permissions
   - [ ] Set up MediaRecorder
   - [ ] Configure correct sampling rate

2. Data Processing
   - [ ] Implement chunk collection
   - [ ] Set up data conversion pipeline
   - [ ] Handle size limitations

3. Visualization
   - [ ] Create analyzer node
   - [ ] Set up drawing loop
   - [ ] Implement cleanup

4. Error Management
   - [ ] Handle permission errors
   - [ ] Manage connection failures
   - [ ] Implement fallback options