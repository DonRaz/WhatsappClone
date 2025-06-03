const fs = require('fs');
const readline = require('readline');
const path = require('path');

class ExternalMergeSort {
    constructor(inputFile, outputFile, maxMemoryBytes = 100 * 1024 * 1024) { // 100MB in bytes
        this.inputFile = inputFile;
        this.outputFile = outputFile;
        this.maxMemoryBytes = maxMemoryBytes;
        this.tempDir = path.dirname(inputFile);
        this.tempFiles = [];
        this.chunkCounter = 0;
    }

    async sortFile() {
        console.log('Starting external merge sort with character-level memory management...');
        console.log(`Memory limit: ${Math.round(this.maxMemoryBytes / (1024 * 1024))}MB`);
        
        // Phase 1: Split input file into sorted chunks based on memory usage
        await this.splitAndSortChunks();
        
        // Phase 2: Merge sorted chunks
        await this.mergeSortedChunks();
        
        // Cleanup temporary files
        await this.cleanup();
        
        console.log('Sorting completed!');
    }

    async splitAndSortChunks() {
        console.log('Phase 1: Splitting and sorting chunks by memory usage...');
        
        const fileStream = fs.createReadStream(this.inputFile, { encoding: 'utf8' });
        let currentChunk = [];
        let currentMemoryUsage = 0;
        let buffer = '';
        
        return new Promise((resolve, reject) => {
            fileStream.on('data', async (chunk) => {
                fileStream.pause(); // Pause while processing
                
                buffer += chunk;
                
                // Process complete lines from buffer
                let lines = buffer.split('\n');
                // Keep the last potentially incomplete line in buffer
                buffer = lines.pop() || '';
                
                for (const line of lines) {
                    const lineWithNewline = line + '\n';
                    const lineBytes = Buffer.byteLength(lineWithNewline, 'utf8');
                    
                    // Check if adding this line would exceed memory limit
                    if (currentMemoryUsage + lineBytes > this.maxMemoryBytes && currentChunk.length > 0) {
                        // Write current chunk and start a new one
                        await this.sortAndWriteChunk(currentChunk);
                        currentChunk = [];
                        currentMemoryUsage = 0;
                    }
                    
                    // Handle case where single line exceeds memory limit
                    if (lineBytes > this.maxMemoryBytes) {
                        console.warn(`Warning: Line exceeds memory limit (${lineBytes} bytes). Processing as single-line chunk.`);
                        await this.sortAndWriteChunk([lineWithNewline]);
                    } else {
                        currentChunk.push(lineWithNewline);
                        currentMemoryUsage += lineBytes;
                    }
                }
                
                fileStream.resume(); // Resume reading
            });
            
            fileStream.on('end', async () => {
                try {
                    // Process remaining buffer content
                    if (buffer.length > 0) {
                        const lineBytes = Buffer.byteLength(buffer, 'utf8');
                        if (currentMemoryUsage + lineBytes > this.maxMemoryBytes && currentChunk.length > 0) {
                            await this.sortAndWriteChunk(currentChunk);
                            currentChunk = [];
                        }
                        // Don't add newline to last line if it doesn't have one
                        currentChunk.push(buffer);
                    }
                    
                    // Write final chunk if it has content
                    if (currentChunk.length > 0) {
                        await this.sortAndWriteChunk(currentChunk);
                    }
                    
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
            
            fileStream.on('error', reject);
        });
    }

    async sortAndWriteChunk(lines) {
        if (lines.length === 0) return;
        
        console.log(`Sorting chunk ${this.chunkCounter} with ${lines.length} lines (${this.calculateMemoryUsage(lines)} bytes)`);
        
        // Sort lines lexicographically
        lines.sort((a, b) => a.localeCompare(b));
        
        const tempFileName = path.join(this.tempDir, `temp_chunk_${this.chunkCounter}.txt`);
        this.tempFiles.push(tempFileName);
        this.chunkCounter++;
        
        return new Promise((resolve, reject) => {
            const writeStream = fs.createWriteStream(tempFileName);
            
            for (const line of lines) {
                writeStream.write(line);
            }
            
            writeStream.end();
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
    }

    calculateMemoryUsage(lines) {
        return lines.reduce((total, line) => total + Buffer.byteLength(line, 'utf8'), 0);
    }

    async mergeSortedChunks() {
        console.log(`Phase 2: Merging ${this.tempFiles.length} sorted chunks...`);
        
        if (this.tempFiles.length === 0) {
            fs.writeFileSync(this.outputFile, '');
            return;
        }

        if (this.tempFiles.length === 1) {
            fs.renameSync(this.tempFiles[0], this.outputFile);
            this.tempFiles = [];
            return;
        }

        // Create line readers for each temp file
        const readers = [];
        for (const file of this.tempFiles) {
            readers.push(await this.createLineReader(file));
        }

        const writeStream = fs.createWriteStream(this.outputFile);
        
        // Priority queue implemented as sorted array (for simplicity)
        const heap = [];
        
        // Initialize heap with first line from each file
        for (let i = 0; i < readers.length; i++) {
            const line = await readers[i].readLine();
            if (line !== null) {
                heap.push({ line, readerIndex: i });
            }
        }

        // Sort initial heap
        heap.sort((a, b) => a.line.localeCompare(b.line));

        let processedLines = 0;
        
        // Merge process
        while (heap.length > 0) {
            // Get the lexicographically smallest line
            const smallest = heap.shift();
            writeStream.write(smallest.line);
            processedLines++;
            
            if (processedLines % 10000 === 0) {
                console.log(`Processed ${processedLines} lines...`);
            }
            
            // Read next line from the same reader
            const nextLine = await readers[smallest.readerIndex].readLine();
            if (nextLine !== null) {
                // Insert back into heap maintaining sorted order
                const newEntry = { line: nextLine, readerIndex: smallest.readerIndex };
                this.insertSorted(heap, newEntry);
            }
        }

        writeStream.end();
        
        // Close all readers
        for (const reader of readers) {
            reader.close();
        }
        
        console.log(`Merge completed. Processed ${processedLines} total lines.`);
        
        return new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
    }

    insertSorted(heap, entry) {
        let left = 0;
        let right = heap.length;
        
        // Binary search for insertion point
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (heap[mid].line.localeCompare(entry.line) <= 0) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        heap.splice(left, 0, entry);
    }

    async createLineReader(filename) {
        const fileStream = fs.createReadStream(filename, { encoding: 'utf8' });
        let buffer = '';
        let ended = false;
        let lines = [];
        let currentIndex = 0;
        
        const processBuffer = () => {
            const newLines = buffer.split('\n');
            if (!ended) {
                // Keep the last potentially incomplete line in buffer
                buffer = newLines.pop() || '';
            } else {
                // File ended, process all lines
                if (newLines.length > 0 && newLines[newLines.length - 1] === '') {
                    newLines.pop(); // Remove empty string from final split
                }
                buffer = '';
            }
            
            // Add complete lines to our queue
            for (let i = 0; i < newLines.length; i++) {
                lines.push(newLines[i] + '\n');
            }
        };

        fileStream.on('data', (chunk) => {
            buffer += chunk;
            processBuffer();
        });

        fileStream.on('end', () => {
            ended = true;
            if (buffer.length > 0) {
                lines.push(buffer); // Last line might not have \n
                buffer = '';
            }
        });

        return {
            async readLine() {
                // Wait for data if we don't have any lines and stream hasn't ended
                while (currentIndex >= lines.length && !ended) {
                    await new Promise(resolve => setTimeout(resolve, 1));
                }
                
                if (currentIndex < lines.length) {
                    return lines[currentIndex++];
                }
                
                return null; // No more lines
            },
            close() {
                fileStream.destroy();
            }
        };
    }

    async cleanup() {
        console.log('Cleaning up temporary files...');
        for (const tempFile of this.tempFiles) {
            try {
                if (fs.existsSync(tempFile)) {
                    fs.unlinkSync(tempFile);
                    console.log(`Deleted: ${tempFile}`);
                }
            } catch (error) {
                console.warn(`Failed to delete temp file ${tempFile}:`, error.message);
            }
        }
        this.tempFiles = [];
    }
}

// Main execution function
async function main() {
    const inputFile = path.join(__dirname, 'demo.txt');
    const outputFile = path.join(__dirname, 'sorted_output.txt');
    
    console.log(`Input file: ${inputFile}`);
    console.log(`Output file: ${outputFile}`);
    
    if (!fs.existsSync(inputFile)) {
        console.error(`Input file ${inputFile} does not exist!`);
        return;
    }
    
    // Check input file size
    const stats = fs.statSync(inputFile);
    console.log(`Input file size: ${Math.round(stats.size / (1024 * 1024))}MB`);
    
    const sorter = new ExternalMergeSort(inputFile, outputFile, 100 * 1024 * 1024); // 100MB memory limit
    
    try {
        const startTime = Date.now();
        await sorter.sortFile();
        const endTime = Date.now();
        
        console.log(`File sorted successfully in ${endTime - startTime}ms!`);
        
        // Display first few lines of sorted output
        console.log('\nFirst 10 lines of sorted output:');
        const sortedContent = fs.readFileSync(outputFile, 'utf8');
        const lines = sortedContent.split('\n').slice(0, 10);
        lines.forEach((line, index) => {
            console.log(`${index + 1}: "${line}"`);
        });
        
        // Show output file size
        const outputStats = fs.statSync(outputFile);
        console.log(`\nOutput file size: ${Math.round(outputStats.size / (1024 * 1024))}MB`);
        
    } catch (error) {
        console.error('Error during sorting:', error);
    }
}

// Export for use as module
module.exports = { ExternalMergeSort };

// Run if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}