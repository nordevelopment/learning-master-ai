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
    
    const result = ai.respond(question);
    
    return {
      question,
      answer: result.answer,
      thinking: result.thinking,
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
    const knowledgeMap = ai.getKnowledgeMap();
    return {
      trained: ai.trained,
      patterns: ai.responses.size,
      nlp_enabled: !!ai.nlp,
      conversation_history: ai.conversationHistory.length,
      max_history_length: ai.maxHistoryLength,
      knowledgeMap: knowledgeMap,
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

// Debug endpoint - AI visualization data
app.get('/api/debug', async (request, reply) => {
    // Get top IDF values
    const topIdf = Array.from(ai.idfMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, score]) => ({ word, idf: parseFloat(score.toFixed(3)) }));
    
    // Get Intent stats
    const intentStats = {
      totalCategories: ai.nlp.intentStats.intents.size,
      totalVocabulary: ai.nlp.intentStats.vocabulary.size,
      categories: Array.from(ai.nlp.intentStats.intents.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }))
    };
    
    // Get manual weights
    const manualWeights = {
      high: ['express', 'fastify', 'node', 'mongodb'],
      medium: ['npm', 'async', 'database', 'sql'],
      standard: ['install', 'create', 'fix', 'error']
    };
    
    // Get BM25 params
    const bm25Params = {
      k1: ai.k1,
      b: ai.b,
      avgDocLength: parseFloat(ai.avgDocLength.toFixed(2))
    };
    
    // Get recent conversation context
    const recentContext = ai.conversationHistory.slice(-5).map(h => ({
      question: h.question.slice(0, 50) + (h.question.length > 50 ? '...' : ''),
      keywords: h.processed.keywords.slice(0, 5),
      intent: h.processed.intent[0]?.intent || 'unknown'
    }));
    
    return {
      version: '4.0.0',
      algorithm: 'BM25 + Naive Bayes + TF-IDF Hybrid',
      bm25: bm25Params,
      idf: {
        count: ai.idfMap.size,
        top20: topIdf
      },
      intent: intentStats,
      manualWeights: manualWeights,
      context: {
        historyLength: ai.conversationHistory.length,
        maxHistory: ai.maxHistoryLength,
        recent: recentContext
      },
      stats: {
        totalDocuments: ai.totalDocuments,
        totalPatterns: ai.responses.size,
        contextAge: ai.lastContextUpdate
      }
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
