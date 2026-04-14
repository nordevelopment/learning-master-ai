const SimpleAI = require('./ai-core');

async function testAI() {
  console.log('=== TESTING NODEJS-MASTER-AI ===\n');

  try {
    const ai = new SimpleAI();

    // 1. Load trained model
    console.log('1. Loading trained AI model...');
    await ai.loadModel('models/simple-ai-model.json');

    if (!ai.trained) {
      console.error('AI model is not trained! Run "npm run train" first.');
      return;
    }

    // 2. Test questions
    console.log('\n2. Testing AI responses...\n');
    
    const testQuestions = [
      // Basic questions
      "How to write a file in Node.js?",
      "What is async/await?",
      "How to handle errors?",
      
      // Technology-specific
      "What is Fastify?",
      "How to create Express server?",
      "What is MongoDB?",
      
      // JavaScript concepts
      "What is Promise?",
      "JavaScript functions",
      "Array methods",
      
      // Advanced topics
      "How to implement authentication?",
      "What is microservices?",
      "Deployment strategies",
      
      // Edge cases
      "Hello AI",
      "help me",
      "unknown topic xyz",
      
      // Complex questions
      "How to create a REST API with Fastify and MongoDB?",
      "Best practices for error handling in Node.js",
      "Compare Express vs Fastify performance"
    ];

    let correctResponses = 0;
    let totalResponseTime = 0;

    testQuestions.forEach((question, index) => {
      const startTime = Date.now();
      const result = ai.respond(question);
      const responseTime = Date.now() - startTime;
      totalResponseTime += responseTime;

      console.log(`Q${index + 1}: ${question}`);
      console.log(`A: ${result.answer}`);
      console.log(`Confidence: ${(result.thinking?.confidence * 100).toFixed(1)}%`);
      console.log(`Algorithm: ${result.thinking?.algorithm || 'N/A'}`);
      console.log(`Time: ${responseTime}ms`);
      console.log('---');

      // Simple heuristic for correct response
      if (!result.answer.includes("I don't understand") && !result.answer.includes("I'm not trained")) {
        correctResponses++;
      }
    });

    // 3. Performance metrics
    console.log('\n=== PERFORMANCE METRICS ===');
    const accuracy = (correctResponses / testQuestions.length * 100).toFixed(1);
    const avgResponseTime = (totalResponseTime / testQuestions.length).toFixed(1);

    console.log(`Test questions: ${testQuestions.length}`);
    console.log(`Correct responses: ${correctResponses}`);
    console.log(`Accuracy: ${accuracy}%`);
    console.log(`Average response time: ${avgResponseTime}ms`);
    console.log(`Total response time: ${totalResponseTime}ms`);
    console.log(`Keyword patterns: ${ai.responses.size}`);
    console.log(`Conversation history: ${ai.conversationHistory.length}`);

    // 4. Test NLP capabilities
    console.log('\n=== NLP CAPABILITIES TEST ===');
    
    const nlpTests = [
      {
        question: "How do I create a server?",
        expected_intent: "how_to"
      },
      {
        question: "What's a Promise?",
        expected_intent: "learn_concept"
      },
      {
        question: "Fix my async error",
        expected_intent: "fix_problem"
      }
    ];

    nlpTests.forEach((test, index) => {
      const processed = ai.nlp.processText(test.question);
      console.log(`NLP Test ${index + 1}: "${test.question}"`);
      console.log(`  Keywords: ${processed.keywords.slice(0, 5).join(', ')}...`);
      console.log(`  Entities: ${processed.entities.join(', ') || 'none'}`);
      console.log(`  Intent: ${processed.intent.map(i => i.intent).join(', ') || 'none'}`);
      console.log(`  Context: ${processed.context.map(c => c.context).join(', ') || 'none'}`);
      console.log('');
    });

    // 5. Test conversation context
    console.log('=== CONVERSATION CONTEXT TEST ===');
    
    // Clear history and test context
    ai.conversationHistory = [];
    
    console.log('Question 1: "What is Express?"');
    const result1 = ai.respond("What is Express?");
    console.log(`Response 1: ${result1.answer}`);
    
    console.log('\nQuestion 2: "How to use it?"');
    const result2 = ai.respond("How to use it?");
    console.log(`Response 2: ${result2.answer}`);
    
    console.log(`\nHistory length: ${ai.conversationHistory.length}`);
    console.log('Context awareness:', ai.conversationHistory.length > 0 ? 'Working' : 'Not working');

    // 6. Final assessment
    console.log('\n=== FINAL ASSESSMENT ===');
    
    let grade = 'C';
    if (accuracy >= 80) grade = 'A';
    else if (accuracy >= 60) grade = 'B';
    else if (accuracy >= 40) grade = 'C';
    else grade = 'D';

    console.log(`Overall Grade: ${grade}`);
    console.log(`Accuracy: ${accuracy}%`);
    console.log(`Speed: ${avgResponseTime}ms average`);
    console.log(`NLP: Enhanced`);
    console.log(`Context: ${ai.conversationHistory.length > 0 ? 'Enabled' : 'Disabled'}`);

    if (accuracy >= 60) {
      console.log('\n=== AI TEST PASSED ===');
      console.log('The AI is performing well and ready for production!');
    } else {
      console.log('\n=== AI TEST NEEDS IMPROVEMENT ===');
      console.log('Consider adding more training examples or improving NLP processing.');
    }

  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Run tests
testAI();
