# External Merge Sort for Large Files

This Node.js application implements an external merge sort algorithm designed to sort extremely large text files (up to 10GB) with limited memory (100MB) and no additional disk space. **The algorithm handles character-level memory constraints, allowing individual lines to be as large as 5GB.**

## Problem Statement

- **Input**: 10GB text file (unordered)
- **Memory Constraint**: Only 100MB RAM available
- **Disk Constraint**: No additional disk space (10GB disk is completely full)
- **Goal**: Sort the file lexicographically
- **Special Challenge**: Individual lines can be extremely large (up to 5GB)

## Algorithm Overview

The solution uses a **two-phase external merge sort with character-level memory management**:

### Phase 1: Split and Sort Chunks (Character-Level)
1. Read the input file in streaming chunks (character by character)
2. Accumulate complete lines until memory limit (100MB) is reached
3. Sort accumulated lines lexicographically in memory
4. Write sorted chunks to temporary files
5. Handle edge case: if a single line exceeds memory limit, process it as a single-line chunk
6. Repeat until entire file is processed

### Phase 2: Merge Sorted Chunks
1. Open all temporary sorted files simultaneously
2. Use a k-way merge algorithm with a priority queue
3. Read one line from each file and maintain the lexicographically smallest
4. Write the smallest line to output and read the next line from that file
5. Continue until all files are exhausted

## Key Features

- **Character-Level Memory Management**: Tracks exact byte usage, not line count
- **Handles Massive Lines**: Can process individual lines up to 5GB
- **Memory Efficient**: Never loads more than 100MB into memory
- **Space Efficient**: Reuses the same disk space by overwriting temporary files
- **Handles Various Text Formats**: Empty lines, single words, multi-word lines, massive lines
- **Lexicographic Sorting**: Uses JavaScript's `localeCompare()` for proper string comparison
- **Streaming I/O**: Uses Node.js streams for efficient file processing
- **Progress Tracking**: Shows detailed progress during processing
- **Error Handling**: Robust error handling and cleanup

## Usage

### Running the Application

```bash
# Navigate to the server directory
cd server

# Run the sorting algorithm
npm start
```

### Using as a Module

```javascript
const { ExternalMergeSort } = require('./src/routers/test_123.js');

// 100MB memory limit (in bytes)
const sorter = new ExternalMergeSort('input.txt', 'output.txt', 100 * 1024 * 1024);
await sorter.sortFile();
```

## Technical Implementation

### Memory Management
- **Byte-Level Tracking**: Uses `Buffer.byteLength()` to calculate exact memory usage
- **Streaming Processing**: Reads file in chunks, processes complete lines
- **Buffer Management**: Maintains incomplete lines in buffer until complete
- **Dynamic Chunking**: Creates chunks based on actual memory usage, not line count

### Handling Large Lines
- **Single-Line Chunks**: Lines exceeding memory limit are processed individually
- **Warning System**: Alerts when processing lines larger than memory limit
- **Graceful Degradation**: Algorithm continues even with massive individual lines

### File Structure

```
server/
├── src/routers/
│   ├── test_123.js      # Main sorting algorithm
│   ├── demo.txt         # Sample input file
│   └── sorted_output.txt # Generated output file
├── package.json
└── README.md
```

## Algorithm Complexity

- **Time Complexity**: O(n log n) where n is the number of lines
- **Space Complexity**: O(k + L) where k is the number of chunks and L is the largest line size
- **I/O Complexity**: O(n) - each character is read and written exactly twice
- **Memory Usage**: Strictly bounded by the specified limit (100MB)

## Example

Given the input file `demo.txt`:
```
hey im one line




______________


h 
efficient


yellow


__________________


```

The algorithm will produce a lexicographically sorted output:
```

______________
__________________
efficient
h
hey im one line
yellow
```

## Edge Cases Handled

1. **Empty Lines**: Properly sorted with other content
2. **Lines Larger Than Memory**: Processed as individual chunks
3. **File Larger Than Memory**: Split into manageable chunks
4. **Mixed Line Sizes**: Efficiently handles varying line lengths
5. **Unicode Content**: Proper UTF-8 encoding support

## Performance Characteristics

For a 10GB file with 100MB memory:
- **Memory Usage**: Never exceeds 100MB (strictly enforced)
- **Chunk Size**: Variable, based on actual content and memory usage
- **Temporary Files**: Number depends on content distribution
- **Processing Time**: Depends on disk I/O speed and line size distribution
- **Scalability**: Can handle files larger than available RAM

## Memory Calculation Example

```javascript
// Example memory tracking
const line = "This is a sample line\n";
const bytes = Buffer.byteLength(line, 'utf8'); // 23 bytes
```

The algorithm accumulates lines until the total byte count approaches the memory limit, ensuring precise memory management.

## Requirements

- Node.js >= 12.0.0
- No external dependencies (uses only Node.js built-in modules)
- Sufficient disk space for temporary files during processing

## Limitations

- **Single-threaded**: Uses single-threaded processing for simplicity
- **Disk I/O Bound**: Performance limited by disk read/write speed
- **Temporary Space**: Requires space for temporary files during processing 