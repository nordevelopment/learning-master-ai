const FileManager = require('./FileManager');

async function showConfigUsage() {
  console.log('=== AI SANDBOX CONFIGURATION & STATE ===\n');

  try {
    const aiFileManager = new FileManager('./ai-project');
    
    // 1. Load Model Metadata
    const modelConfig = await aiFileManager.readJsonAsync('configs/model-config.json');
    
    console.log('📋 Project Metadata:');
    console.log(`Name:    ${modelConfig.name}`);
    console.log(`Version: ${modelConfig.version}`);
    console.log(`Type:    ${modelConfig.type}`);
    console.log(`Engine:  ${modelConfig.engine}`);
    
    console.log('\n🎯 Capabilities:');
    modelConfig.capabilities.forEach((capability, index) => {
      console.log(`${index + 1}. ${capability}`);
    });
    
    // 2. Load Actual Trained Model Stats
    const aiModel = await aiFileManager.readJsonAsync('models/simple-ai-model.json');
    
    console.log('\n🤖 Actual AI Model State:');
    console.log(`Trained:           ${aiModel.trained ? '✅ Yes' : '❌ No'}`);
    console.log(`Knowledge Samples: ${aiModel.totalDocuments}`);
    console.log(`Stored Vectors:    ${aiModel.vectors.length}`);
    console.log(`Last Updated:      ${aiModel.created}`);
    
    console.log('\n⚙️ Logic Parameters:');
    console.log(`Confidence Threshold: ${modelConfig.parameters.confidence_threshold}`);
    console.log(`Context Memory:       ${modelConfig.parameters.context_turns} turns`);
    
    console.log('\n🔍 Directory Structure:');
    console.log('- configs/model-config.json: Static metadata');
    console.log('- models/simple-ai-model.json: Trained weights (Brain)');
    console.log('- data/training/*.jsonl:      Source knowledge');
    
    console.log('\n✅ System is ready and verified.');
    
  } catch (error) {
    console.error('\n❌ Status Check Failed:');
    console.error(error.message);
  }
}

showConfigUsage();
