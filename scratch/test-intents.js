const SimpleAI = require('../src/ai-core');
const path = require('path');

async function debugIntents() {
  const ai = new SimpleAI();
  await ai.loadModel('models/simple-ai-model.json');

  const testCases = [
    "Tell me about async and await in JavaScript",
    "How to connect to MongoDB database?",
    "My server is throwing a 500 error, how to fix?",
    "Best practices for project structure in Express",
    "How to install npm packages?"
  ];

  console.log('=== DEBUGGING INTENT CLASSIFICATION (Naive Bayes) ===\n');

  testCases.forEach(question => {
    const processed = ai.nlp.processText(question);
    console.log(`Question: "${question}"`);
    console.log(`Detected Intents (Top 3):`);
    
    processed.intent.forEach((intent, i) => {
      // Конвертируем конфиденс в проценты для наглядности
      // В Naive Bayes после exp() это относительная вероятность
      const confidence = (intent.confidence * 100).toFixed(2);
      console.log(`  ${i + 1}. [${intent.intent}] - Confidence: ${confidence}%`);
    });
    
    console.log(`Result: ${ai.respond(question).substring(0, 100)}...`);
    console.log('--------------------------------------------------\n');
  });
}

debugIntents();
