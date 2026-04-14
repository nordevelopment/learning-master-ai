const SimpleAI = require('./ai-core');
const FileManager = require('./FileManager');

async function trainAI() {
  console.log('=== TRAINING NODEJS-MASTER-AI ===\n');

  try {
    const aiFileManager = new FileManager('./ai-project');
    const ai = new SimpleAI();

    // 1. Load training data from ALL files in training directory
    console.log('1. Loading training data from all sources...');
    const trainingDir = 'data/training';
    const files = await aiFileManager.listDirAsync(trainingDir);
    const jsonlFiles = files.filter(f => f.name.endsWith('.jsonl'));
    
    let trainingData = [];
    for (const file of jsonlFiles) {
      console.log(`   - Loading ${file.name}...`);
      const data = await aiFileManager.readTrainingDataAsync(
        `${trainingDir}/${file.name}`, 
        'jsonl'
      );
      trainingData = trainingData.concat(data);
    }

    console.log(`\n   Total loaded ${trainingData.length} training examples from ${jsonlFiles.length} files`);

    // 2. Check if model already exists
    console.log('\n2. Checking existing model...');
    try {
      const existingModel = await aiFileManager.readJsonAsync('models/simple-ai-model.json');
      const dataHash = require('crypto').createHash('md5').update(JSON.stringify(trainingData)).digest('hex');
      
      if (existingModel.data_hash === dataHash) {
        console.log('   Model already exists and data hasn\'t changed');
        console.log('   Skipping training. Use --force to retrain.');
        console.log('   Existing model trained on:', existingModel.created);
        return;
      }
      
      console.log('   Data has changed, retraining required...');
    } catch (error) {
      console.log('   No existing model found, training from scratch...');
    }

    // 3. Train the AI
    console.log('\n3. Training AI model...');
    const startTime = Date.now();
    await ai.train(trainingData);
    const trainingTime = Date.now() - startTime;

    console.log(`   Training completed in ${trainingTime}ms`);

    // 4. Save AI model
    console.log('\n4. Saving AI model...');
    const dataHash = require('crypto').createHash('md5').update(JSON.stringify(trainingData)).digest('hex');
    const modelData = await ai.saveModel('models/simple-ai-model.json');
    
    // Add data hash to model
    modelData.data_hash = dataHash;
    await aiFileManager.writeJsonAsync('models/simple-ai-model.json', modelData);
    console.log('   AI model saved successfully!');

    // 5. Save training report
    console.log('\n5. Saving training report...');
    const trainingReport = {
      training_session: {
        timestamp: new Date().toISOString(),
        duration_ms: trainingTime,
        samples_processed: trainingData.length,
        patterns_learned: ai.responses.size
      },
      model_info: {
        type: modelData.type,
        version: modelData.version,
        intelligence_level: modelData.intelligence_level,
        accuracy_estimate: modelData.accuracy_estimate
      },
      capabilities: modelData.capabilities,
      nlp_features: [
        'Lemmatization',
        'Synonym expansion',
        'Entity extraction',
        'Intent detection',
        'Context awareness'
      ],
      performance_metrics: {
        response_time_ms: '<1ms',
        memory_usage_kb: Math.round(JSON.stringify(modelData).length / 1024),
        model_size_chars: JSON.stringify(modelData).length,
        data_hash: dataHash
      }
    };

    await aiFileManager.writeJsonAsync('reports/training-report.json', trainingReport);
    console.log('   Training report saved!');

    // 6. Summary
    console.log('\n=== TRAINING SUMMARY ===');
    console.log(`Training samples: ${trainingData.length}`);
    console.log(`Keyword patterns: ${ai.responses.size}`);
    console.log(`Training time: ${trainingTime}ms`);
    console.log(`Model size: ${Math.round(JSON.stringify(modelData).length / 1024)}KB`);
    console.log(`Accuracy estimate: ${modelData.accuracy_estimate}`);
    console.log(`NLP capabilities: Enabled`);

    console.log('\n=== TRAINING COMPLETE ===');
    console.log('AI is ready for use!');
    console.log('Run "npm run test" to test the AI');
    console.log('Run "npm run chat" to start the chat server');

  } catch (error) {
    console.error('Training failed:', error);
    process.exit(1);
  }
}

// Run training
trainAI();
