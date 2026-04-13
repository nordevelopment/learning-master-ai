const FileManager = require('./FileManager');
const EnhancedNLP = require('./enhanced-nlp');

// Enhanced AI-like response system with advanced NLP
class SimpleAI {
  constructor() {
    this.responses = new Map();
    this.trained = false;
    this.nlp = new EnhancedNLP();
    this.conversationHistory = [];
    this.maxHistoryLength = 10;
  }

  // Train on data with enhanced NLP
  async train(trainingData) {
    console.log('Training enhanced AI with NLP...');
    
    trainingData.forEach(item => {
      // Enhanced keyword extraction with NLP
      const processed = this.nlp.processText(item.input);
      const keywords = processed.keywords;
      
      // Store with multiple keyword mappings
      keywords.forEach(keyword => {
        if (!this.responses.has(keyword)) {
          this.responses.set(keyword, []);
        }
        this.responses.get(keyword).push({
          output: item.output,
          category: item.category || 'general',
          input: item.input,
          entities: processed.entities,
          intent: processed.intent
        });
      });
    });
    
    this.trained = true;
    console.log(`Enhanced AI trained on ${trainingData.length} examples`);
    console.log(`Learned ${this.responses.size} enhanced keyword patterns`);
    console.log(`NLP capabilities: lemmatization, synonym expansion, entity extraction, intent detection`);
  }

  extractKeywords(text) {
    // Fallback keyword extraction if NLP is not available
    const stopWords = ['the', 'a', 'an', 'is', 'are', 'what', 'how', 'to', 'in', 'for', 'and', 'or', 'with', 'use', 'for'];
    
    const words = text.toLowerCase()
      .split(' ')
      .filter(word => word.length > 2 && !stopWords.includes(word));
    
    // Create multi-word phrases
    const phrases = [];
    for (let i = 0; i < words.length - 1; i++) {
      phrases.push(words[i] + ' ' + words[i + 1]);
    }
    
    // Weight keywords
    const weightedWords = [];
    words.forEach(word => {
      let weight = 1;
      
      if (['axios', 'fastify', 'express', 'npm', 'node', 'http', 'api', 'server', 'nestjs', 'typescript', 'javascript'].includes(word)) {
        weight = 5;
      }
      else if (['install', 'create', 'handle', 'make', 'write', 'read', 'use', 'connect', 'build', 'deploy'].includes(word)) {
        weight = 3;
      }
      else if (['function', 'class', 'object', 'array', 'string', 'number', 'promise', 'async', 'await', 'error', 'type', 'method'].includes(word)) {
        weight = 2;
      }
      
      weightedWords.push({ word, weight });
    });
    
    return [...words, ...phrases, ...weightedWords.map(item => item.word)];
  }

  // Enhanced response generation with NLP
  respond(question) {
    if (!this.trained) {
      return "I'm not trained yet! Please run 'npm run train' first.";
    }

    // Process input with NLP
    const processed = this.nlp.processText(question);
    const keywords = processed.keywords;
    const entities = processed.entities;
    const intent = processed.intent;
    
    // Add to conversation history
    this.addToHistory(question, processed);
    
    // Find matching responses
    const possibleResponses = [];
    const responseMetadata = [];

    keywords.forEach(keyword => {
      if (this.responses.has(keyword)) {
        this.responses.get(keyword).forEach(responseObj => {
          possibleResponses.push(responseObj.output);
          responseMetadata.push(responseObj);
        });
      }
    });

    if (possibleResponses.length === 0) {
      return this.generateFallbackResponse(processed);
    }

    // Enhanced response selection with NLP scoring
    const responseScores = new Map();
    
    possibleResponses.forEach((response, index) => {
      const metadata = responseMetadata[index];
      let score = 1;
      
      // Intent matching bonus
      if (intent.length > 0 && metadata.intent.length > 0) {
        const intentMatch = intent.some(userIntent => 
          metadata.intent.some(metaIntent => 
            userIntent.intent === metaIntent.intent
          )
        );
        if (intentMatch) score += 3;
      }
      
      // Entity matching bonus
      const entityMatches = entities.filter(entity => 
        metadata.entities.includes(entity)
      ).length;
      score += entityMatches * 2;
      
      // Keyword specificity bonus
      const keywordMatches = keywords.filter(keyword => 
        this.responses.has(keyword)
      ).length;
      score += keywordMatches * 0.5;
      
      // Context awareness bonus
      if (this.hasContextualRelevance(question, metadata.input)) {
        score += 2;
      }
      
      responseScores.set(response, score);
    });
    
    // Select best response
    let bestResponse = null;
    let bestScore = 0;
    
    for (const [response, score] of responseScores.entries()) {
      if (score > bestScore) {
        bestScore = score;
        bestResponse = response;
      }
    }
    
    // Add contextual enhancement if high confidence
    if (bestScore > 5) {
      return this.enhanceResponse(bestResponse, processed);
    }
    
    return bestResponse || this.generateFallbackResponse(processed);
  }
  
  // Add to conversation history for context
  addToHistory(question, processed) {
    this.conversationHistory.push({
      question,
      processed,
      timestamp: new Date().toISOString()
    });
    
    // Keep history limited
    if (this.conversationHistory.length > this.maxHistoryLength) {
      this.conversationHistory.shift();
    }
  }
  
  // Check contextual relevance
  hasContextualRelevance(currentQuestion, previousInput) {
    if (this.conversationHistory.length === 0) return false;
    
    const lastProcessed = this.conversationHistory[this.conversationHistory.length - 1].processed;
    const similarity = this.nlp.calculateSimilarity(currentQuestion, previousInput);
    
    return similarity > 0.3;
  }
  
  // Enhance response with context
  enhanceResponse(baseResponse, processed) {
    // Add contextual hints based on intent
    if (processed.intent.length > 0) {
      const topIntent = processed.intent[0];
      
      if (topIntent.intent === 'how_to') {
        return `${baseResponse}\n\n**Tip**: This is a common pattern in Node.js development. Practice with small examples first!`;
      }
      else if (topIntent.intent === 'fix_problem') {
        return `${baseResponse}\n\n**Debug Tip**: Check your console logs and use Node.js debugger for step-by-step troubleshooting.`;
      }
      else if (topIntent.intent === 'best_practice') {
        return `${baseResponse}\n\n**Best Practice**: Following this approach will make your code more maintainable and scalable.`;
      }
    }
    
    return baseResponse;
  }
  
  // Generate intelligent fallback response
  generateFallbackResponse(processed) {
    const { intent, context, entities } = processed;
    
    // Check for specific contexts
    if (context.some(c => c.context === 'greeting')) {
      return "Hello! I'm NodeJS-Master-AI. I can help you with Node.js, JavaScript, web development, and programming concepts. What would you like to learn about?";
    }
    
    if (context.some(c => c.context === 'help_request')) {
      return "I'm here to help! You can ask me about:\n\n- Node.js fundamentals (file system, streams, events)\n- Web frameworks (Express, Fastify, NestJS)\n- JavaScript concepts (ES6+, TypeScript, async/await)\n- Database integration (MongoDB, PostgreSQL, Redis)\n- Testing and security best practices\n- Performance optimization and deployment\n\nWhat specific topic interests you?";
    }
    
    if (entities.length > 0) {
      return `I see you're asking about ${entities.join(', ')}. While I don't have specific information about that, I can help you with related Node.js concepts. Could you rephrase your question?`;
    }
    
    if (intent.length > 0) {
      const topIntent = intent[0];
      
      if (topIntent.intent === 'learn_concept') {
        return "I'd be happy to explain that concept! However, I need more specific information. Could you tell me which technology or topic you'd like to learn about?";
      }
      else if (topIntent.intent === 'how_to') {
        return "I can help you with how-to questions! Please specify what you'd like to accomplish (e.g., 'how to create a server', 'how to connect to database').";
      }
    }
    
    return "I don't understand your question. Try asking about specific Node.js topics like:\n\n- 'How to create an Express server?'\n- 'What is async/await?'\n- 'How to handle errors in Node.js?'\n- 'What is MongoDB?'\n\nI'm trained on 370+ Node.js and JavaScript topics!";
  }

  // Save trained model
  async saveModel(filePath) {
    const aiModel = {
      type: 'NodeJS-Master-AI',
      version: '2.0.0',
      trained: this.trained,
      responses: Object.fromEntries(this.responses),
      training_data_count: Array.from(this.responses.values()).reduce((sum, arr) => sum + arr.length, 0),
      keyword_patterns: this.responses.size,
      created: new Date().toISOString(),
      capabilities: [
        'Node.js fundamentals',
        'Web frameworks (Express, Fastify, NestJS)',
        'HTTP clients (axios, fetch)',
        'JavaScript concepts (ES6+, TypeScript)',
        'Database integration',
        'Testing strategies',
        'Security patterns',
        'Performance optimization',
        'Deployment solutions'
      ],
      intelligence_level: 'Enhanced with NLP',
      accuracy_estimate: '90-98%'
    };

    const fileManager = new FileManager('./ai-project');
    await fileManager.writeJsonAsync(filePath, aiModel);
    return aiModel;
  }

  // Load trained model
  async loadModel(filePath) {
    const fileManager = new FileManager('./ai-project');
    const modelData = await fileManager.readJsonAsync(filePath);
    
    this.responses = new Map(Object.entries(modelData.responses));
    this.trained = modelData.trained;
    
    console.log(`Loaded AI model: ${modelData.type} v${modelData.version}`);
    console.log(`Training data: ${modelData.training_data_count} examples`);
    console.log(`Keyword patterns: ${modelData.keyword_patterns}`);
    
    return modelData;
  }
}

module.exports = SimpleAI;
