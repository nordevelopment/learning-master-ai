const FileManager = require('./FileManager');

// Create instance
const fileManager = new FileManager('./data');

async function demonstrateFileOperations() {
  console.log('=== DEMONSTRATION OF FILE OPERATIONS ===\n');

  try {
    // 1. Async/Await - Recommended approach
    console.log('1. Async/Await writing:');
    await fileManager.writeFileAsync('test-async.txt', 'Hello from async/await!');
    
    console.log('2. Async/Await reading:');
    const asyncContent = await fileManager.readFileAsync('test-async.txt');
    console.log('Content:', asyncContent);
    
    // 2. More async operations
    console.log('\n3. Creating another file:');
    await fileManager.writeFileAsync('test-another.txt', 'Another async file!');
    
    console.log('4. Reading the second file:');
    const anotherContent = await fileManager.readFileAsync('test-another.txt');
    console.log('Content:', anotherContent);
    
    // 3. Append to file
    console.log('\n5. Appending to file:');
    await fileManager.appendFileAsync('test-async.txt', '\nAppended content!');
    
    const appendedContent = await fileManager.readFileAsync('test-async.txt');
    console.log('Updated content:', appendedContent);
    
    // 4. Check file existence
    console.log('\n6. File existence check:');
    const exists = await fileManager.fileExistsAsync('test-async.txt');
    console.log('File exists:', exists);
    
    // 5. Delete file
    console.log('\n7. Deleting file:');
    await fileManager.deleteFileAsync('test-another.txt');
    
    const existsAfterDelete = await fileManager.fileExistsAsync('test-another.txt');
    console.log('File exists after delete:', existsAfterDelete);
    
  } catch (error) {
    console.error('Error in demonstration:', error);
  }
}

// Run demonstration
demonstrateFileOperations();
