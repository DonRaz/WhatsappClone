const { ExternalMergeSort } = require('./src/routers/deleteme/test_123.js');
const fs = require('fs');
const path = require('path');

async function testWithFile(inputFile, memoryLimitMB) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Testing with: ${inputFile}`);
    console.log(`Memory limit: ${memoryLimitMB}MB`);
    console.log(`${'='.repeat(50)}`);
    
    const outputFile = inputFile.replace('.txt', '_sorted.txt');
    
    if (!fs.existsSync(inputFile)) {
        console.error(`Input file ${inputFile} does not exist!`);
        return;
    }
    
    // Show original content
    console.log('\nOriginal content:');
    const originalContent = fs.readFileSync(inputFile, 'utf8');
    const originalLines = originalContent.split('\n');
    originalLines.forEach((line, index) => {
        console.log(`${index + 1}: "${line}"`);
    });
    
    // Sort the file
    const sorter = new ExternalMergeSort(inputFile, outputFile, memoryLimitMB * 1024 * 1024);
    
    try {
        const startTime = Date.now();
        await sorter.sortFile();
        const endTime = Date.now();
        
        console.log(`\nSorting completed in ${endTime - startTime}ms`);
        
        // Show sorted content
        console.log('\nSorted content:');
        const sortedContent = fs.readFileSync(outputFile, 'utf8');
        const sortedLines = sortedContent.split('\n');
        sortedLines.forEach((line, index) => {
            console.log(`${index + 1}: "${line}"`);
        });
        
        // Verify sorting is correct
        const isCorrectlySorted = verifySorting(sortedLines);
        console.log(`\nSorting verification: ${isCorrectlySorted ? 'PASSED' : 'FAILED'}`);
        
    } catch (error) {
        console.error('Error during sorting:', error);
    }
}

function verifySorting(lines) {
    for (let i = 1; i < lines.length; i++) {
        if (lines[i - 1].localeCompare(lines[i]) > 0) {
            console.log(`Sorting error at lines ${i} and ${i + 1}:`);
            console.log(`  "${lines[i - 1]}" should come after "${lines[i]}"`);
            return false;
        }
    }
    return true;
}

async function main() {
    console.log('External Merge Sort Test Suite');
    console.log('Testing character-level memory management\n');
    
    // Test with small file and normal memory
    await testWithFile('./src/routers/demo.txt', 100);
    
    // Test with larger file and normal memory
    await testWithFile('./src/routers/large_test.txt', 100);
    
    // Test with larger file and very limited memory (1KB)
    console.log('\n' + '='.repeat(60));
    console.log('Testing with extremely limited memory (1KB)');
    console.log('This will create many small chunks');
    console.log('='.repeat(60));
    
    await testWithFile('./src/routers/large_test.txt', 0.001); // 1KB
}

if (require.main === module) {
    main().catch(console.error);
} 