const SimpleAI = require('../src/ai-core');

async function testFuzzy() {
  const ai = new SimpleAI();
  await ai.loadModel('models/simple-ai-model.json');

  console.log('=== TESTING FUZZY SEARCH (Typos Handling) ===\n');

  const typoCases = [
    { input: "Tell me about Exprees", target: "express" },
    { input: "How to connect Mongodb?", target: "mongodb" }, // check case and slight difference
    { input: "What is Fastife?", target: "fastify" },
    { input: "ReactJS basics", target: "react" },
    { input: "TypeScrit config", target: "typescript" }
  ];

  typoCases.forEach(test => {
    const processed = ai.nlp.processText(test.input);
    const found = processed.entities.includes(test.target) || (processed.slots && processed.slots.technology === test.target);
    
    console.log(`Input: "${test.input}"`);
    console.log(`  Extracted Entities: ${processed.entities.join(', ') || 'none'}`);
    console.log(`  Identified Technology: ${processed.slots.technology || 'none'}`);
    console.log(`  Status: ${found ? '✅ FIXED' : '❌ FAILED'}`);
    console.log('---');
  });
}

testFuzzy();
