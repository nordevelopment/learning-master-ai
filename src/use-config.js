const FileManager = require('./FileManager');

async function showConfigUsage() {
  console.log('=== NODEJS-MASTER-AI CONFIGURATION ===\n');

  try {
    const aiFileManager = new FileManager('./ai-project');
    
    // Load current AI model configuration
    const modelConfig = await aiFileManager.readJsonAsync('configs/model-config.json');
    
    console.log('📋 Current AI Configuration:');
    console.log(`Name: ${modelConfig.name}`);
    console.log(`Version: ${modelConfig.version}`);
    console.log(`Type: ${modelConfig.type}`);
    console.log(`Intelligence Level: ${modelConfig.intelligence_level}`);
    console.log(`Accuracy: ${modelConfig.accuracy_estimate}`);
    
    console.log('\n🎯 Capabilities:');
    modelConfig.capabilities.forEach((capability, index) => {
      console.log(`${index + 1}. ${capability}`);
    });
    
    console.log('\n📊 Training Statistics:');
    console.log(`Training Samples: ${modelConfig.training_samples}`);
    console.log(`Keyword Patterns: ${modelConfig.keyword_patterns}`);
    console.log(`Model Size: ${modelConfig.model_size_characters} characters`);
    console.log(`Response Time: ${modelConfig.response_time_ms}`);
    
    console.log('\n⚙️ Parameters:');
    console.log(`Max Tokens: ${modelConfig.parameters.max_tokens}`);
    console.log(`Temperature: ${modelConfig.parameters.temperature}`);
    console.log(`Top P: ${modelConfig.parameters.top_p}`);
    console.log(`Frequency Penalty: ${modelConfig.parameters.frequency_penalty}`);
    
    console.log('\n📅 Created:', modelConfig.created);
    
    // Load actual AI model to show comparison
    const aiModel = await aiFileManager.readJsonAsync('models/simple-ai-model.json');
    
    console.log('\n🤖 Actual AI Model State:');
    console.log(`Responses Count: ${Object.keys(aiModel.responses).length}`);
    console.log(`Trained: ${aiModel.trained ? 'Yes' : 'No'}`);
    console.log(`Model Type: ${aiModel.type}`);
    
    console.log('\n💡 Usage Examples:');
    console.log('1. Node.js Assistant:');
    console.log('   Ask: "How to write file?"');
    console.log('   Answer: AI will use keyword matching');
    console.log('');
    console.log('2. Framework Comparison:');
    console.log('   Ask: "Express vs Fastify?"');
    console.log('   Answer: AI compares features and recommends');
    console.log('');
    console.log('3. JavaScript Concepts:');
    console.log('   Ask: "What is closure?"');
    console.log('   Answer: AI explains concept with examples');
    
    console.log('\n🔍 Configuration Files:');
    console.log('- configs/model-config.json: AI metadata and parameters');
    console.log('- models/simple-ai-model.json: Trained AI brain');
    console.log('- prompts/chat-prompts.json: AI behavior guidelines');
    console.log('- data/training/*.jsonl: Knowledge base');
    
    console.log('\n✅ This configuration could be used for:');
    console.log('- Future TensorFlow.js integration');
    console.log('- API endpoint configuration');
    console.log('- Performance monitoring');
    console.log('- Custom AI behavior tuning');
    
  } catch (error) {
    console.error('Error loading configuration:', error);
  }
}

showConfigUsage();
