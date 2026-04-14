const SimpleAI = require('./ai-core');
const FileManager = require('./FileManager');

async function testAI() {
  console.log('=== TESTING LEARNING-MASTER AI ===\n');

  try {
    const ai = new SimpleAI();
    const aiFileManager = ai.fileManager || new FileManager('./ai-project');

    // 1. Load trained model
    const modelPath = `models/${ai.config.model_file}`;
    console.log(`1. Loading trained AI model: ${modelPath}...`);
    await ai.loadModel(modelPath);

    if (!ai.trained) {
      console.error('AI model is not trained! Run "npm run train" first.');
      return;
    }

    // 2. Load Validation Dataset
    console.log('2. Loading validation dataset...');
    let validationData = [];
    try {
      validationData = await aiFileManager.readTrainingDataAsync('data/test/validation-set.jsonl', 'jsonl');
      console.log(`   Loaded ${validationData.length} validation samples`);
    } catch (e) {
      console.warn('   Validation set not found. Using internal questions.');
    }

    // 3. Run Real Accuracy Calculation
    console.log('\n3. Running accuracy benchmark...');
    let correctCount = 0;
    const failures = [];

    if (validationData.length > 0) {
      validationData.forEach((item, index) => {
        const result = ai.respond(item.input);
        const topCandidate = result.thinking?.candidates?.[0];

        const isCorrect = topCandidate && (topCandidate.output === item.output || topCandidate.category === item.category);

        if (isCorrect) {
          correctCount++;
        } else {
          failures.push({
            input: item.input,
            expected: { category: item.category, output: item.output.substring(0, 50) + '...' },
            actual: topCandidate ? { category: topCandidate.category, output: topCandidate.output.substring(0, 50) + '...' } : 'None'
          });
        }
      });
    }

    const realAccuracy = validationData.length > 0 ? (correctCount / validationData.length) * 100 : 0;
    console.log(`\n   Benchmark Result: ${realAccuracy.toFixed(2)}% (${correctCount}/${validationData.length})`);

    if (failures.length > 0) {
      console.log('\n   Failures:');
      failures.forEach((f, i) => {
        console.log(`   ${i + 1}. Q: "${f.input}"`);
        console.log(`      Exp: [${f.expected.category}] ${f.expected.output}`);
        console.log(`      Act: [${f.actual.category || 'N/A'}] ${f.actual.output || 'N/A'}`);
      });
    }

    // 4. Test Manual Questions (Qualitative Test)
    console.log('\n4. Qualitative Testing...\n');

    const testQuestions = [
      "How to write a file in Node.js?",
      "What is async/await?",
      "How to handle errors?",
      "What is Fastify?",
      "How to create Express server?",
      "How to implement authentication?",
      "unknown topic xyz"
    ];

    testQuestions.forEach((question, index) => {
      const startTime = Date.now();
      const result = ai.respond(question);
      const responseTime = Date.now() - startTime;

      console.log(`Q${index + 1}: ${question}`);
      console.log(`A: ${result.answer.substring(0, 100)}${result.answer.length > 100 ? '...' : ''}`);
      console.log(`Confidence: ${(result.thinking?.confidence * 100).toFixed(1)}%`);
      console.log(`Intent: ${result.thinking?.intent?.map(i => i.intent).join(', ') || 'none'}`);
      console.log(`Time: ${responseTime}ms`);
      console.log('---');
    });

    // 5. Final assessment
    console.log('\n=== FINAL ASSESSMENT ===');

    let grade = 'C';
    if (realAccuracy >= 85) grade = 'A+';
    else if (realAccuracy >= 75) grade = 'A';
    else if (realAccuracy >= 60) grade = 'B';
    else if (realAccuracy >= 40) grade = 'C';
    else grade = 'D';

    console.log(`Overall Grade: ${grade}`);
    console.log(`Real Accuracy: ${realAccuracy.toFixed(1)}%`);
    console.log(`Model Version: ${ai.config.version}`);
    console.log(`Status: ${realAccuracy >= 60 ? 'OPTIMIZED' : 'NEEDS RETRAINING'}`);

    // Update model if requested via --update flag
    if (process.argv.includes('--update')) {
      console.log('\n6. Updating model with new accuracy estimate...');
      const modelData = await aiFileManager.readJsonAsync(modelPath);
      modelData.accuracy_estimate = `${realAccuracy.toFixed(1)}%`;
      modelData.last_validated = new Date().toISOString();
      await aiFileManager.writeJsonAsync(modelPath, modelData);
      console.log('   Model updated successfully!');
    }

  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}


// Run tests
testAI();
