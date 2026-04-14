const SimpleAI = require('../src/ai-core');

async function testMemory() {
  const ai = new SimpleAI();
  await ai.loadModel('models/simple-ai-model.json');

  console.log('=== TESTING CONTEXTUAL MEMORY (Slot Filling) ===\n');

  // Turn 1: Establish topic
  console.log('User: "Tell me about Express framework"');
  let res1 = ai.respond("Tell me about Express framework");
  console.log(`AI: ${res1.substring(0, 100)}...`);
  console.log(`Active Slots: ${JSON.stringify(ai.activeSlots)}\n`);

  // Turn 2: Follow-up question without subject
  console.log('User: "How to install it?"');
  let res2 = ai.respond("How to install it?");
  console.log(`AI: ${res2.substring(0, 100)}...`);
  console.log(`Active Slots: ${JSON.stringify(ai.activeSlots)}\n`);

  // Turn 3: Another follow-up
  console.log('User: "Show me code for middleware"');
  let res3 = ai.respond("Show me code for middleware");
  console.log(`AI: ${res3.substring(0, 100)}...`);
  console.log(`Active Slots: ${JSON.stringify(ai.activeSlots)}\n`);

  // Turn 4: Shift topic
  console.log('User: "What about MongoDB?"');
  let res4 = ai.respond("What about MongoDB?");
  console.log(`AI: ${res4.substring(0, 100)}...`);
  console.log(`Active Slots: ${JSON.stringify(ai.activeSlots)}\n`);

  // Turn 5: Follow-up on new topic
  console.log('User: "How to connect?"');
  let res5 = ai.respond("How to connect?");
  console.log(`AI: ${res5.substring(0, 100)}...`);
  console.log(`Active Slots: ${JSON.stringify(ai.activeSlots)}\n`);
}

testMemory();
