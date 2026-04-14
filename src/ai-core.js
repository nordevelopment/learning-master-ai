const fs = require('fs');
const path = require('path');
const FileManager = require('./FileManager');
const EnhancedNLP = require('./enhanced-nlp');

// Enhanced AI-like response system with advanced NLP
class SimpleAI {
  constructor() {
    this.fileManager = new FileManager('./ai-project');

    // 1. Load configuration
    try {
      const configPath = path.join(__dirname, '../ai-project/configs/model-config.json');
      this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      console.log(`[Config] Loaded: ${this.config.bot_name} v${this.config.version}`);
    } catch (error) {
      console.warn(`[Warning] model-config.json not found, using minimal defaults`);
      this.config = {
        bot_name: "AI Learning Master",
        model_file: "ai-Learning-master.json"
      };
    }

    this.responses = new Map();
    this.trained = false;
    this.nlp = new EnhancedNLP();
    this.conversationHistory = [];

    // 2. Apply parameters from config
    const params = this.config.parameters || {};
    this.maxHistoryLength = params.max_history_length || 20;

    // BM25 Parameters
    this.k1 = params.k1 || 1.5;  // Term frequency saturation
    this.b = params.b || 0.75;  // Length normalization
    this.avgDocLength = 0;

    // TF-IDF Data (kept for backward compatibility)
    this.idfMap = new Map();
    this.trainingVectors = [];
    this.totalDocuments = 0;

    // Context / Memory
    this.activeSlots = {};
    this.lastContextUpdate = 0;
    this.maxContextAge = params.max_context_age_turns || 5;
  }

  // Train on data with enhanced NLP and TF-IDF
  async train(trainingData) {
    console.log('Training hybrid AI (TF-IDF + Manual Rules)...');

    this.totalDocuments = trainingData.length;
    this.idfMap.clear();
    this.trainingVectors = [];
    this.responses.clear();

    // 1. Calculate Document Frequency (for IDF)
    const wordDocCount = new Map();

    trainingData.forEach(item => {
      const processed = this.nlp.processText(item.input);
      const uniqueWords = new Set(processed.keywords);

      uniqueWords.forEach(word => {
        wordDocCount.set(word, (wordDocCount.get(word) || 0) + 1);
      });
    });

    // 2. Train Intent Classifier (Naive Bayes)
    this.nlp.trainIntentClassifier(trainingData);

    // 3. Calculate IDF for each word
    // IDF = log(Total Docs / Docs containing the word)
    for (const [word, count] of wordDocCount.entries()) {
      this.idfMap.set(word, Math.log(this.totalDocuments / count) + 1);
    }

    // 3. Calculate average document length for BM25
    this.avgDocLength = this.calculateAvgDocLength(trainingData);
    console.log(`Average document length: ${this.avgDocLength.toFixed(2)} keywords`);

    // 4. Create TF-IDF vectors for each training item (with docLength for BM25)
    trainingData.forEach((item, index) => {
      const processed = this.nlp.processText(item.input);
      const keywords = processed.keywords;

      // Calculate Term Frequency (TF)
      const tfMap = new Map();
      keywords.forEach(word => {
        tfMap.set(word, (tfMap.get(word) || 0) + 1);
      });

      // Create TF-IDF Vector
      const vector = new Map();
      for (const [word, tf] of tfMap.entries()) {
        const idf = this.idfMap.get(word) || 0;
        const manualBonus = this.getManualWeight(word);
        // Hybrid: TF * IDF * ManualBonus
        vector.set(word, (tf / keywords.length) * idf * manualBonus);
      }

      const trainingItem = {
        id: index,
        output: item.output,
        category: item.category || 'general',
        input: item.input,
        entities: processed.entities,
        intent: processed.intent,
        vector: vector,
        docLength: keywords.length  // Store for BM25
      };

      this.trainingVectors.push(trainingItem);

      // Keep the fast lookup map for candidates
      keywords.forEach(keyword => {
        if (!this.responses.has(keyword)) {
          this.responses.set(keyword, []);
        }
        this.responses.get(keyword).push(trainingItem);
      });
    });

    this.trained = true;
    console.log(`AI trained on ${this.totalDocuments} examples`);
    console.log(`TF-IDF model built with ${this.idfMap.size} unique terms`);
  }

  // Helper for Hybrid approach: defined manual weights for important terms
  getManualWeight(word) {
    const weights = {
      // High priority tech
      'node': 2.0, 'nodejs': 2.0, 'js': 1.5, 'javascript': 1.5,
      'express': 2.5, 'fastify': 2.5, 'nestjs': 2.5,
      'mongodb': 2.0, 'sql': 1.8, 'database': 1.5,
      'npm': 1.8, 'async': 1.5, 'await': 1.5, 'promise': 1.5,
      // Actions
      'install': 1.2, 'create': 1.2, 'fix': 1.5, 'error': 1.5,
      'how': 1.1, 'what': 1.1, 'why': 1.1
    };
    return weights[word] || 1.0;
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

  // Enhanced response generation with Hybrid TF-IDF + Cosine Similarity
  respond(question) {
    try {
      // Validate input
      if (!question || typeof question !== 'string') {
        return {
          answer: "Please provide a valid question.",
          thinking: { error: 'invalid_input' }
        };
      }

      if (!this.trained) {
        return { answer: "I'm not trained yet! Please run 'npm run train' first.", thinking: {} };
      }

      // Process question with error handling
      let processed;
      try {
        processed = this.nlp.processText(question);
      } catch (nlpError) {
        console.warn('NLP processing error:', nlpError.message);
        processed = {
          keywords: question.toLowerCase().split(' ').filter(w => w.length > 2),
          intent: [],
          context: [],
          slots: {},
          entities: []
        };
      }

      const keywords = [...(processed.keywords || [])];
      const currentSlots = processed.slots || {};

      // 1. Update Context Memory (Slot Filling)
      this.updateContext(currentSlots);

      // 2. Query Enrichment
      if (keywords.length < 10) {
        if (this.activeSlots.technology && !currentSlots.technology) {
          keywords.push(this.activeSlots.technology);
          keywords.push(this.activeSlots.technology);
        }
        if (this.activeSlots.topic && !currentSlots.topic) {
          keywords.push(this.activeSlots.topic);
        }
      }

      this.addToHistory(question, processed);

      // 3. Calculate TF-IDF Vector for the Question
      const qTfMap = new Map();
      keywords.forEach(word => {
        qTfMap.set(word, (qTfMap.get(word) || 0) + 1);
      });

      // Handle edge case: no keywords
      if (qTfMap.size === 0) {
        return this.generateFallbackResponse(processed);
      }

      const questionVector = new Map();
      for (const [word, tf] of qTfMap.entries()) {
        const idf = this.idfMap.get(word) || 0;
        const manualBonus = this.getManualWeight(word);
        questionVector.set(word, (tf / keywords.length) * idf * manualBonus);
      }

      // 4. Find Candidates
      const candidates = new Set();
      keywords.forEach(keyword => {
        if (this.responses.has(keyword)) {
          this.responses.get(keyword).forEach(res => candidates.add(res));
        }
      });

      if (candidates.size === 0) {
        const fallback = this.generateFallbackResponse(processed);
        return {
          answer: fallback,
          thinking: { keywords, intent: processed.intent, confidence: 0, candidates: [], slots: currentSlots }
        };
      }

      // 5. Rank Candidates using BM25
      let bestResponse = null;
      let maxSimilarity = -1;
      const scoredCandidates = [];

      // Normalize question TF for BM25
      const questionDocLength = keywords.length;

      for (const candidate of candidates) {
        // Use BM25 score instead of Cosine Similarity
        let score = this.calculateBM25Score(qTfMap, candidate.vector, candidate.docLength);

        // Technology context boost
        if (this.activeSlots.technology && candidate.input.toLowerCase().includes(this.activeSlots.technology)) {
          score *= 1.15;
        }

        // Intent match bonus
        if (processed.intent && processed.intent.length > 0 && candidate.intent && candidate.intent.length > 0) {
          const hasIntentMatch = processed.intent.some(qInt =>
            candidate.intent.some(cInt => qInt.intent === cInt.intent)
          );
          if (hasIntentMatch) score *= 1.2;
        }

        scoredCandidates.push({
          input: candidate.input,
          similarity: score,
          output: candidate.output,
          category: candidate.category
        });

        if (score > maxSimilarity) {
          maxSimilarity = score;
          bestResponse = candidate;
        }
      }

      // Normalize confidence score (BM25 scores can be higher)
      const normalizedConfidence = Math.min(maxSimilarity / 10, 1);

      // Negative Matching: Filter out weak candidates with re-ranking
      const strongCandidates = scoredCandidates.filter(c => c.similarity > maxSimilarity * 0.5);

      // If no strong candidates, return clarifying question
      if (strongCandidates.length === 0 || normalizedConfidence < 0.05) {
        const fallback = this.generateClarifyingQuestion(processed);
        return {
          answer: fallback,
          thinking: {
            keywords,
            intent: processed.intent,
            confidence: normalizedConfidence,
            candidates: scoredCandidates.slice(0, 3),
            slots: currentSlots,
            reranked: false
          }
        };
      }

      // Re-ranking: Sort by score and apply final adjustments
      strongCandidates.sort((a, b) => {
        // Tie-breaker: if BM25 scores are identical (or extremely close), randomly swap them
        if (Math.abs(b.similarity - a.similarity) < 0.0001) {
          return Math.random() - 0.5;
        }
        return b.similarity - a.similarity;
      });

      // After tie-breaking, our true winner is the first element
      const winningCandidate = strongCandidates[0];

      // Context Decay
      this.lastContextUpdate++;
      if (this.lastContextUpdate > this.maxContextAge) {
        this.clearOldContext();
      }

      let finalAnswer = winningCandidate.output;
      if (normalizedConfidence > 0.4) {
        finalAnswer = this.enhanceResponse(winningCandidate.output, processed);
      }

      return {
        answer: finalAnswer,
        thinking: {
          keywords: keywords,
          intent: (processed.intent || []).slice(0, 3),
          confidence: normalizedConfidence,
          candidates: scoredCandidates.sort((a, b) => b.similarity - a.similarity).slice(0, 3),
          slots: currentSlots,
          reranked: true,
          algorithm: 'BM25'
        }
      };
    } catch (error) {
      console.error('Error in respond():', error.message);
      return {
        answer: "I encountered an error processing your question. Please try rephrasing it.",
        thinking: { error: 'processing_error', message: error.message }
      };
    }
  }

  // Get data for Knowledge Map visualization
  getKnowledgeMap() {
    const categories = {};
    const techDensity = {};

    this.trainingVectors.forEach(v => {
      // Category stats
      categories[v.category] = (categories[v.category] || 0) + 1;

      // Technology density
      if (v.entities) {
        v.entities.forEach(entity => {
          techDensity[entity] = (techDensity[entity] || 0) + 1;
        });
      }
    });

    return {
      categories: Object.entries(categories).map(([name, count]) => ({ name, count })),
      technologies: Object.entries(techDensity)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15),
      totalPatterns: this.responses.size,
      totalDocuments: this.totalDocuments
    };
  }

  // Manage Context Memory
  updateContext(newSlots) {
    if (Object.keys(newSlots).length > 0) {
      // If a NEW technology is mentioned, we might want to shift focus
      if (newSlots.technology && this.activeSlots.technology && newSlots.technology !== this.activeSlots.technology) {
        console.log(`Context shifting from ${this.activeSlots.technology} to ${newSlots.technology}`);
        // Optional: clear other slots if tech shifts
      }

      this.activeSlots = { ...this.activeSlots, ...newSlots };
      this.lastContextUpdate = 0; // Reset "age" of context
    }
  }

  clearOldContext() {
    console.log('Context decayed, clearing memory...');
    this.activeSlots = {};
    this.lastContextUpdate = 0;
  }

  // Calculate BM25 Score - Improved ranking algorithm
  // BM25 is better than TF-IDF for variable document lengths
  calculateBM25Score(queryTerms, docVector, docLength) {
    let score = 0;

    for (const [term, queryTf] of queryTerms.entries()) {
      const docTf = docVector.get(term) || 0;
      const idf = this.idfMap.get(term) || Math.log(this.totalDocuments + 1);
      const manualBonus = this.getManualWeight(term);

      // BM25 formula with term frequency saturation
      // Prevents over-weighting of frequent terms
      const tfComponent = (docTf * (this.k1 + 1)) / (docTf + this.k1 * (1 - this.b + this.b * (docLength / this.avgDocLength)));

      score += idf * tfComponent * manualBonus;
    }

    return score;
  }

  // Calculate Average Document Length for BM25 normalization
  calculateAvgDocLength(trainingData) {
    let totalLength = 0;
    trainingData.forEach(item => {
      const processed = this.nlp.processText(item.input);
      totalLength += processed.keywords.length;
    });
    return totalLength / trainingData.length;
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

  // Generate clarifying question when confidence is too low (Negative Matching)
  generateClarifyingQuestion(processed) {
    const entities = processed?.entities || [];
    const intent = processed?.intent || [];

    if (entities.length > 0) {
      return `I see you're asking about ${entities.join(', ')}. Could you provide more details about what you'd like to know? For example: "How do I use ${entities[0]} with Node.js?"`;
    }

    if (intent.length > 0) {
      const topIntent = intent[0]?.intent || 'general';
      const intentQuestions = {
        'how_to': 'What specific task would you like to accomplish? (e.g., creating a server, connecting to database)',
        'fix_problem': 'What error message are you seeing? Please describe the issue.',
        'learn_concept': 'Which specific technology or concept would you like to learn about?',
        'best_practice': 'In what context are you asking about best practices?',
        'compare_options': 'What technologies or approaches would you like to compare?'
      };

      if (intentQuestions[topIntent]) {
        return `To help you better with "${topIntent}", ${intentQuestions[topIntent]}`;
      }
    }

    return "I'd like to help! Could you rephrase your question with more specific details? For example, mention the technology (Node.js, Express, MongoDB) or what you're trying to achieve.";
  }

  // Get weighted context from conversation history (Recency Bias)
  getWeightedContext() {
    if (this.conversationHistory.length === 0) return { keywords: [], entities: [] };

    const weights = [];
    const totalItems = this.conversationHistory.length;

    // More recent = higher weight (recency bias)
    for (let i = totalItems - 1; i >= 0; i--) {
      const age = totalItems - i;
      const weight = Math.max(0.2, 1 - (age * 0.1)); // Minimum 0.2 weight
      weights.push({ history: this.conversationHistory[i], weight });
    }

    const allKeywords = new Map();
    const allEntities = new Map();

    weights.forEach(({ history, weight }) => {
      history.processed.keywords.forEach(kw => {
        allKeywords.set(kw, (allKeywords.get(kw) || 0) + weight);
      });
      history.processed.entities.forEach(ent => {
        allEntities.set(ent, (allEntities.get(ent) || 0) + weight);
      });
    });

    return {
      keywords: Array.from(allKeywords.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([kw]) => kw),
      entities: Array.from(allEntities.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([ent]) => ent)
    };
  }

  // Generate intelligent fallback response
  generateFallbackResponse(processed) {
    // Safe destructuring with fallbacks
    const intent = processed?.intent || [];
    const context = processed?.context || [];
    const entities = processed?.entities || [];

    try {
      // Check for specific contexts
      if (context.some && context.some(c => c.context === 'greeting')) {
        return `Hello! I'm ${this.config.bot_name}. I can help you with Node.js, JavaScript, web development, and programming concepts. What would you like to learn about?`;
      }

      if (context.some && context.some(c => c.context === 'help_request')) {
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
    } catch (e) {
      // Fallback silently if context/intent processing fails
    }

    return "I don't understand your question. Try asking about specific Node.js topics like:\n\n- 'How to create an Express server?'\n- 'What is async/await?'\n- 'How to handle errors in Node.js?'\n- 'What is MongoDB?'\n\nI'm trained on 370+ Node.js and JavaScript topics!";
  }

  // Calculate accuracy based on a test dataset
  calculateAccuracy(testData) {
    if (!testData || testData.length === 0) return 0;

    console.log(`Calculating accuracy on ${testData.length} samples...`);
    let correct = 0;

    testData.forEach(item => {
      // Use respond with a clean context for testing
      const originalHistory = this.conversationHistory;
      const originalSlots = this.activeSlots;

      this.conversationHistory = [];
      this.activeSlots = {};

      const result = this.respond(item.input);

      // Restore context
      this.conversationHistory = originalHistory;
      this.activeSlots = originalSlots;

      // Check if the top candidate's category matches the ground truth
      // For retrieval, we also check if the confidence is reasonable
      const topCandidate = result.thinking?.candidates?.[0];
      if (topCandidate) {
        const categoryMatch = topCandidate.category === item.category;
        const outputMatch = topCandidate.output === item.output;

        // Count as correct if category matches (semantic accuracy)
        // or if output is an exact match
        if (categoryMatch || outputMatch) {
          correct++;
        }
      }
    });

    this.accuracyEstimate = (correct / testData.length) * 100;
    return this.accuracyEstimate;
  }

  // Save trained model
  async saveModel(filePath) {
    const aiModel = {
      type: this.config.type || 'AI Learning Master Sandbox',
      version: this.config.version || '3.0.0',
      trained: this.trained,
      bm25Params: {
        k1: this.k1,
        b: this.b,
        avgDocLength: this.avgDocLength
      },
      idf: Object.fromEntries(this.idfMap),
      intentStats: {
        intents: Object.fromEntries(this.nlp.intentStats.intents),
        wordCounts: Object.fromEntries(Array.from(this.nlp.intentStats.wordCounts.entries()).map(([k, v]) => [k, Object.fromEntries(v)])),
        vocabulary: Array.from(this.nlp.intentStats.vocabulary),
        totalDocuments: this.nlp.intentStats.totalDocuments
      },
      vectors: this.trainingVectors.map(v => ({
        ...v,
        vector: Object.fromEntries(v.vector)
      })),
      totalDocuments: this.totalDocuments,
      intelligence_level: 'Hybrid (BM25 + Naive Bayes + NLP)',
      accuracy_estimate: this.accuracyEstimate ? `${this.accuracyEstimate.toFixed(1)}%` : 'Not calculated',
      created: new Date().toISOString()
    };

    const fileManager = new FileManager('./ai-project');
    await fileManager.writeJsonAsync(filePath, aiModel);
    return aiModel;
  }

  // Load trained model
  async loadModel(filePath) {
    const fileManager = new FileManager('./ai-project');
    const modelData = await fileManager.readJsonAsync(filePath);

    this.totalDocuments = modelData.totalDocuments;
    this.idfMap = new Map(Object.entries(modelData.idf));
    this.trained = modelData.trained;

    // Load BM25 parameters (v4.0.0+)
    if (modelData.bm25Params) {
      this.k1 = modelData.bm25Params.k1 || 1.5;
      this.b = modelData.bm25Params.b || 0.75;
      this.avgDocLength = modelData.bm25Params.avgDocLength || 10;
    }

    // Load Intent Classifier Stats
    if (modelData.intentStats) {
      this.nlp.intentStats.intents = new Map(Object.entries(modelData.intentStats.intents));
      this.nlp.intentStats.totalDocuments = modelData.intentStats.totalDocuments;
      this.nlp.intentStats.vocabulary = new Set(modelData.intentStats.vocabulary);
      this.nlp.intentStats.wordCounts = new Map(
        Object.entries(modelData.intentStats.wordCounts).map(([k, v]) => [k, new Map(Object.entries(v))])
      );
    }

    // Reconstruct vectors and responses map (with docLength for BM25)
    this.trainingVectors = modelData.vectors.map(v => ({
      ...v,
      vector: new Map(Object.entries(v.vector)),
      docLength: v.docLength || v.vector?.size || 10
    }));

    this.responses.clear();
    this.trainingVectors.forEach(v => {
      const processed = this.nlp.processText(v.input);
      processed.keywords.forEach(keyword => {
        if (!this.responses.has(keyword)) {
          this.responses.set(keyword, []);
        }
        this.responses.get(keyword).push(v);
      });
    });

    console.log(`Loaded Hybrid AI model: ${modelData.type} v${modelData.version}`);
    console.log(`BM25 params: k1=${this.k1}, b=${this.b}, avgDocLen=${this.avgDocLength.toFixed(2)}`);
    return modelData;
  }
}

module.exports = SimpleAI;
