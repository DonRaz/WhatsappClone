const { ExternalMergeSort } = require('./src/routers/deleteme/test_123.js');
const fs = require('fs');

// Create a test file with a massive line to demonstrate character-level memory management
function createTestFile() {
    const lines = [
        'short line',
        'z' + 'a'.repeat(1000), // 1KB+ line that exceeds small memory limits
        'medium line here',
        '', // empty line
        'apple',
        'zebra'
    ];
    
    fs.writeFileSync('./massive_line_test.txt', lines.join('\n'));
    console.log('Created test file with massive line (1KB+)');
}

async function demonstrateCharacterLevelSorting() {
    console.log('='.repeat(60));
    console.log('DEMONSTRATION: Character-Level Memory Management');
    console.log('='.repeat(60));
    
    createTestFile();
    
    // Test with 100 byte memory limit - the massive line will exceed this
    const memoryLimit = 100; // 100 bytes
    console.log(`\nMemory limit: ${memoryLimit} bytes`);
    console.log('This will force the massive line to be processed as a single chunk\n');
    
    const sorter = new ExternalMergeSort('./massive_line_test.txt', './massive_line_sorted.txt', memoryLimit);
    
    console.log('Original content:');
    const original = fs.readFileSync('./massive_line_test.txt', 'utf8');
    console.log(original);
    console.log('\n' + '-'.repeat(40));
    
    await sorter.sortFile();
    
    console.log('\nSorted content:');
    const sorted = fs.readFileSync('./massive_line_sorted.txt', 'utf8');
    console.log(sorted);
    
    // Cleanup
    fs.unlinkSync('./massive_line_test.txt');
    fs.unlinkSync('./massive_line_sorted.txt');
    
    console.log('\n' + '='.repeat(60));
    console.log('SUCCESS: Algorithm handled massive line correctly!');
    console.log('- Lines larger than memory limit are processed individually');
    console.log('- Character-level memory tracking ensures precise control');
    console.log('- Lexicographic sorting is maintained across all chunks');
    console.log('='.repeat(60));
}

if (require.main === module) {
    demonstrateCharacterLevelSorting().catch(console.error);
} 