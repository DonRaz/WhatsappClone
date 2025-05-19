import { useRef, useCallback, useEffect, useState } from "react";

export function AudioVisualizer({ stream, ...props }) {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const bufferSize = 120; // Number of bars to display
    const updateInterval = 60; // Update every 60ms for smoother animation
    const lastUpdateRef = useRef(0);
    
    // Store our time-domain data buffer
    const timeDataBufferRef = useRef(Array(bufferSize).fill(0.5));
    // Store target values for smooth animation
    const targetValuesRef = useRef(Array(bufferSize).fill(0));

    const visualize = useCallback((stream) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);

        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // Ensure canvas dimensions match its display size
        const resizeCanvas = () => {
            const { width, height } = canvas.getBoundingClientRect();
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }
        };
        
        resizeCanvas();
        
        const canvasCtx = canvas.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        // Animation speed factor (higher = faster animation)
        const animationSpeed = 0.50;
        
        const drawVisual = (timestamp) => {
            animationRef.current = requestAnimationFrame(drawVisual);
            
            // Ensure canvas dimensions are correct
            resizeCanvas();
            
            // Only update the target data every updateInterval ms
            if (timestamp - lastUpdateRef.current > updateInterval) {
                // Get time domain data
                analyser.getByteTimeDomainData(dataArray);
                
                // Calculate average amplitude for this sample
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    // Convert to -1 to 1 range
                    const amplitude = (dataArray[i] / 128.0) - 1;
                    sum += Math.abs(amplitude);
                }
                const averageAmplitude = sum / bufferLength;
                
                // Shift existing target data to the left
                targetValuesRef.current.shift();
                // Add new target data point (normalized between 0 and 1)
                targetValuesRef.current.push(Math.min(1, averageAmplitude * 2.5));
                
                lastUpdateRef.current = timestamp;
            }
            
            // Smoothly animate current values toward target values
            for (let i = 0; i < bufferSize; i++) {
                const target = targetValuesRef.current[i];
                const current = timeDataBufferRef.current[i];
                // Interpolate toward target value
                timeDataBufferRef.current[i] = current + (target - current) * animationSpeed;
            }
            
            // Clear the canvas with background color
            const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--color-background');
            canvasCtx.fillStyle = bgColor || 'rgb(20, 20, 20)';
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Use CSS variables for bar color
            const barColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
            canvasCtx.fillStyle = barColor || 'rgb(200, 200, 200)';
            
            // Calculate bar dimensions to fill the entire canvas width
            const totalWidth = canvas.width;
            const barSpacing = 2; // Fixed spacing between bars in pixels
            const availableWidth = totalWidth - (barSpacing * (bufferSize - 1));
            const barWidth = Math.max(1, availableWidth / bufferSize);
            
            for (let i = 0; i < bufferSize; i++) {
                const amplitude = timeDataBufferRef.current[i];
                const barHeight = Math.max(3, amplitude * (canvas.height * 0.8));
                
                // Center the bar vertically
                const x = i * (barWidth + barSpacing);
                const y = (canvas.height - barHeight) / 2;
                
                // Draw rounded bars
                const radius = Math.min(barWidth / 2, barHeight / 2, 4); // Max radius of 4px
                
                if (barWidth <= 2) {
                    // For very thin bars, just draw rectangles
                    canvasCtx.fillRect(x, y, barWidth, barHeight);
                } else {
                    // Draw rounded bars for wider bars
                    canvasCtx.beginPath();
                    canvasCtx.moveTo(x + radius, y);
                    canvasCtx.lineTo(x + barWidth - radius, y);
                    canvasCtx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
                    canvasCtx.lineTo(x + barWidth, y + barHeight - radius);
                    canvasCtx.quadraticCurveTo(x + barWidth, y + barHeight, x + barWidth - radius, y + barHeight);
                    canvasCtx.lineTo(x + radius, y + barHeight);
                    canvasCtx.quadraticCurveTo(x, y + barHeight, x, y + barHeight - radius);
                    canvasCtx.lineTo(x, y + radius);
                    canvasCtx.quadraticCurveTo(x, y, x + radius, y);
                    canvasCtx.closePath();
                    canvasCtx.fill();
                }
            }
        };

        drawVisual(0);
        
        // Handle window resize
        const resizeObserver = new ResizeObserver(resizeCanvas);
        resizeObserver.observe(canvas);
        
        // Cleanup function
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            resizeObserver.disconnect();
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
        <canvas {...props} ref={canvasRef}></canvas>
    )
}
