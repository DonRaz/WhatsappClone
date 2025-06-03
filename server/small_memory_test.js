const { ExternalMergeSort } = require('./src/routers/deleteme/test_123.js');

async function testSmallMemory() {
    console.log('Testing with 50 bytes memory limit...');
    const sorter = new ExternalMergeSort('./src/routers/large_test.txt', './src/routers/test_output.txt', 50);
    await sorter.sortFile();
    console.log('Completed!');
}

testSmallMemory().catch(console.error); 