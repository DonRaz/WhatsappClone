import { useRef, useCallback, useEffect, useState } from "react";

export function AudioVisualizer({ stream, ...props }) {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const [timeData, setTimeData] = useState([]);
    const bufferSize = 1024; // Size of our sliding window

    const visualize = useCallback((stream) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);

        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        // Initialize time data buffer with zeros
        let timeDataBuffer = Array(bufferSize).fill(128);

        const drawVisual = () => {
            animationRef.current = requestAnimationFrame(drawVisual);
            
            // Get time domain data
            analyser.getByteTimeDomainData(dataArray);
            
            // Shift existing data to the left
            timeDataBuffer.shift();
            // Add new data point (we'll just use the first value from the current buffer)
            timeDataBuffer.push(dataArray[0]);
            
            // Use CSS variables for background color
            const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--color-background');
            canvasCtx.fillStyle = bgColor || 'rgb(255, 255, 255)';
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

            canvasCtx.lineWidth = 2;
            // Use CSS variables for stroke color
            const strokeColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
            canvasCtx.strokeStyle = strokeColor || 'rgb(0, 0, 0)';
            canvasCtx.beginPath();

            // Draw the sliding window of time-domain data
            const sliceWidth = canvas.width * 1.0 / bufferSize;
            let x = 0;
            
            for (let i = 0; i < bufferSize; i++) {
                const v = timeDataBuffer[i] / 128.0;
                const y = v * canvas.height / 2;

                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasCtx.lineTo(canvas.width, canvas.height / 2);
            canvasCtx.stroke();
        };

        drawVisual();
        
        // Cleanup function
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            source.disconnect();
        };
    }, []);

    useEffect(() => {
        let cleanup = null;
        if (stream) {
            cleanup = visualize(stream);
        }
        
        return () => {
            if (cleanup) cleanup();
        };
    }, [visualize, stream]);
    
    return (
        <canvas {...props} width={720} height={240} ref={canvasRef}></canvas>
    )
}
