const fastify = require('fastify');
const path = require('path');
const SimpleAI = require('./ai-core');

// Initialize Fastify app
const app = fastify({
  logger: true
});

// Serve static files
app.register(require('@fastify/static'), {
  root: path.join(__dirname, '..', 'public'),
  prefix: '/'
});

// AI instance
const ai = new SimpleAI();

// Load trained AI model
async function initializeAI() {
  try {
    await ai.loadModel('models/simple-ai-model.json');
    console.log('AI is ready for chat!');
  } catch (error) {
    console.error('Error loading AI model:', error);
    console.log('Make sure to run "npm run train" first!');
  }
}

// Health check endpoint
app.get('/api/health', async (request, reply) => {
  return {
    status: 'ok',
    ai: {
      trained: ai.trained,
      patterns: ai.responses.size,
      nlp_enabled: !!ai.nlp,
      conversation_history: ai.conversationHistory.length
    },
    timestamp: new Date().toISOString()
  };
});

// Chat API endpoint
app.post('/api/ask', async (request, reply) => {
  try {
    const { question } = request.body;
    
    if (!question) {
      return reply.status(400).send({ error: 'Question is required' });
    }
    
    const answer = ai.respond(question);
    
    return {
      question,
      answer,
      timestamp: new Date().toISOString(),
      ai: {
        trained: ai.trained,
        patterns: ai.responses.size,
        nlp_enabled: !!ai.nlp
      }
    };
    
  } catch (error) {
    console.error('API Error:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
});

// Get conversation history
app.get('/api/history', async (request, reply) => {
  return {
    history: ai.conversationHistory,
    count: ai.conversationHistory.length
  };
});

// Clear conversation history
app.delete('/api/history', async (request, reply) => {
  ai.conversationHistory = [];
  return {
    message: 'Conversation history cleared',
    timestamp: new Date().toISOString()
  };
});

// Get AI capabilities
app.get('/api/capabilities', async (request, reply) => {
  return {
    trained: ai.trained,
    patterns: ai.responses.size,
    nlp_enabled: !!ai.nlp,
    conversation_history: ai.conversationHistory.length,
    max_history_length: ai.maxHistoryLength,
    supported_topics: [
      'Node.js fundamentals',
      'Web frameworks (Express, Fastify, NestJS)',
      'HTTP clients (axios, fetch)',
      'JavaScript concepts (ES6+, TypeScript)',
      'Database integration',
      'Testing strategies',
      'Security patterns',
      'Performance optimization',
      'Deployment solutions'
    ]
  };
});

// Start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  await initializeAI();
  
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
    
    console.log(`\n=== NodeJS-Master-AI Fastify Server ===`);
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Open your browser and navigate to http://localhost:${PORT}`);
    console.log(`API endpoints:`);
    console.log(`  GET  /api/health - Health check`);
    console.log(`  POST /api/ask - Ask AI question`);
    console.log(`  GET  /api/history - Conversation history`);
    console.log(`  GET  /api/capabilities - AI capabilities`);
    console.log(`\nFeatures:`);
    console.log(`- Fast HTTP API with Fastify`);
    console.log(`- Enhanced NLP processing`);
    console.log(`- Conversation history`);
    console.log(`- RESTful endpoints`);
    console.log(`- Static file serving`);
    console.log(`\nPress Ctrl+C to stop the server`);
    
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  app.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

startServer().catch(console.error);
