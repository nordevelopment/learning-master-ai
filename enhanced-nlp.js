// Enhanced Natural Language Processing for NodeJS-Master-AI
class EnhancedNLP {
  constructor() {
    this.lemmatizer = this.createSimpleLemmatizer();
    this.synonyms = this.createSynonymMap();
    this.contextPatterns = this.createContextPatterns();
    this.intentPatterns = this.createIntentPatterns();
    this.entityExtractors = this.createEntityExtractors();
  }

  // Simple lemmatizer for word normalization
  createSimpleLemmatizer() {
    return {
      // Verb lemmas
      'running': 'run',
      'ran': 'run',
      'runs': 'run',
      'creating': 'create',
      'created': 'create',
      'writes': 'write',
      'wrote': 'write',
      'writing': 'write',
      'handles': 'handle',
      'handled': 'handle',
      'handling': 'handle',
      'installing': 'install',
      'installed': 'install',
      'connects': 'connect',
      'connected': 'connect',
      'connecting': 'connect',
      'builds': 'build',
      'built': 'build',
      'building': 'build',
      'deploys': 'deploy',
      'deployed': 'deploy',
      'deploying': 'deploy',
      
      // Noun lemmas
      'functions': 'function',
      'classes': 'class',
      'objects': 'object',
      'arrays': 'array',
      'strings': 'string',
      'numbers': 'number',
      'promises': 'promise',
      'errors': 'error',
      'types': 'type',
      'methods': 'method',
      'variables': 'variable',
      'modules': 'module',
      'packages': 'package',
      'libraries': 'library',
      'frameworks': 'framework',
      'servers': 'server',
      'apis': 'api',
      'databases': 'database',
      'requests': 'request',
      'responses': 'response',
      'middlewares': 'middleware',
      'routers': 'router',
      'controllers': 'controller',
      'services': 'service',
      'components': 'component',
      'hooks': 'hook',
      'events': 'event',
      'streams': 'stream',
      'buffers': 'buffer',
      'processes': 'process',
      'threads': 'thread',
      'clusters': 'cluster',
      'workers': 'worker',
      
      // Adjective lemmas
      'asynchronous': 'async',
      'synchronous': 'sync',
      'secure': 'security',
      'encrypted': 'encrypt',
      'compressed': 'compress',
      'optimized': 'optimize',
      'scalable': 'scale',
      'reliable': 'reliability',
      'efficient': 'efficiency',
      
      // Remove plurals and common suffixes
      'ies': 'y',
      'ves': 'f',
      'ses': 's',
      'xes': 'x',
      'zes': 'z',
      'ches': 'ch',
      'shes': 'sh',
      'ments': 'ment',
      'tions': 'tion',
      'sions': 'sion',
      'ings': 'ing',
      'ers': 'er',
      'eds': 'ed'
    };
  }

  // Synonym mapping for better understanding
  createSynonymMap() {
    return {
      // Programming concepts
      'function': ['method', 'procedure', 'routine', 'subroutine'],
      'variable': ['var', 'let', 'const', 'identifier'],
      'array': ['list', 'collection', 'sequence'],
      'object': ['dict', 'dictionary', 'hash', 'map'],
      'string': ['text', 'str', 'character'],
      'number': ['int', 'integer', 'float', 'numeric'],
      'async': ['asynchronous', 'non-blocking', 'callback'],
      'await': ['wait', 'pause', 'suspend'],
      'promise': ['future', 'deferred', 'task'],
      'error': ['exception', 'issue', 'problem', 'bug'],
      'debug': ['fix', 'troubleshoot', 'solve'],
      'test': ['spec', 'unit test', 'integration test'],
      'deploy': ['publish', 'release', 'ship'],
      'install': ['add', 'include', 'setup'],
      'create': ['make', 'build', 'generate', 'write'],
      'connect': ['link', 'join', 'attach'],
      'server': ['backend', 'api', 'service'],
      'client': ['frontend', 'ui', 'interface'],
      'database': ['db', 'storage', 'datastore'],
      'api': ['endpoint', 'interface', 'service'],
      'middleware': ['interceptor', 'filter', 'handler'],
      'authentication': ['auth', 'login', 'signin'],
      'authorization': ['permission', 'access', 'rights'],
      'security': ['protection', 'safety', 'encryption'],
      'performance': ['speed', 'optimization', 'efficiency'],
      'scalability': ['scaling', 'growth', 'expansion'],
      
      // Node.js specific
      'node': ['nodejs', 'node.js'],
      'npm': ['package manager', 'package'],
      'express': ['expressjs', 'express.js'],
      'fastify': ['fastifyjs'],
      'react': ['reactjs', 'react.js'],
      'vue': ['vuejs', 'vue.js'],
      'angular': ['angularjs'],
      'typescript': ['ts'],
      'javascript': ['js', 'ecmascript'],
      'json': ['javascript object notation'],
      'xml': ['extensible markup language'],
      'http': ['hypertext transfer protocol'],
      'https': ['secure http'],
      'websocket': ['ws', 'realtime'],
      'grpc': ['google rpc'],
      'graphql': ['gql'],
      'rest': ['restful', 'rest api'],
      'docker': ['container'],
      'kubernetes': ['k8s'],
      'aws': ['amazon web services'],
      'azure': ['microsoft azure'],
      'gcp': ['google cloud platform'],
      
      // Common terms
      'how': ['what way', 'what method', 'what approach'],
      'what': ['which', 'define', 'explain'],
      'why': ['reason', 'cause', 'purpose'],
      'when': ['time', 'moment', 'occasion'],
      'where': ['location', 'place', 'position'],
      'example': ['demo', 'sample', 'illustration'],
      'tutorial': ['guide', 'lesson', 'walkthrough'],
      'documentation': ['docs', 'reference', 'manual'],
      'best': ['optimal', 'recommended', 'preferred'],
      'easy': ['simple', 'basic', 'straightforward'],
      'hard': ['difficult', 'complex', 'challenging'],
      'fast': ['quick', 'rapid', 'efficient'],
      'slow': ['lagging', 'performance issue'],
      'good': ['better', 'recommended', 'proper'],
      'bad': ['poor', 'wrong', 'incorrect'],
      'new': ['latest', 'modern', 'recent'],
      'old': ['legacy', 'outdated', 'previous']
    };
  }

  // Context patterns for better understanding
  createContextPatterns() {
    return {
      greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
      farewell: ['bye', 'goodbye', 'see you', 'farewell', 'later'],
      thanks: ['thank', 'thanks', 'appreciate', 'grateful'],
      apology: ['sorry', 'apologize', 'excuse me', 'pardon'],
      question_words: ['how', 'what', 'why', 'when', 'where', 'which', 'who', 'whose'],
      help_request: ['help', 'assist', 'support', 'guide', 'explain'],
      problem_report: ['error', 'issue', 'problem', 'bug', 'broken', 'not working'],
      comparison: ['vs', 'versus', 'compare', 'difference', 'better', 'worse'],
      example_request: ['example', 'demo', 'sample', 'show me', 'illustrate'],
      tutorial_request: ['tutorial', 'guide', 'how to', 'step by step', 'learn'],
      best_practice: ['best practice', 'recommended', 'proper', 'correct way'],
      troubleshooting: ['fix', 'solve', 'debug', 'troubleshoot', 'resolve'],
      performance: ['performance', 'speed', 'optimize', 'fast', 'slow'],
      security: ['security', 'secure', 'protect', 'safe', 'authentication'],
      deployment: ['deploy', 'deployment', 'publish', 'release', 'production'],
      testing: ['test', 'testing', 'unit test', 'integration test'],
      database: ['database', 'db', 'sql', 'nosql', 'query'],
      api: ['api', 'endpoint', 'rest', 'graphql', 'service'],
      frontend: ['frontend', 'ui', 'client', 'browser', 'interface'],
      backend: ['backend', 'server', 'api', 'service']
    };
  }

  // Intent patterns for understanding user goals
  createIntentPatterns() {
    return {
      learn_concept: {
        keywords: ['what', 'explain', 'define', 'describe', 'tell me about'],
        weight: 3
      },
      how_to: {
        keywords: ['how', 'how to', 'way', 'method', 'approach'],
        weight: 4
      },
      fix_problem: {
        keywords: ['fix', 'solve', 'error', 'issue', 'problem', 'bug'],
        weight: 4
      },
      compare_options: {
        keywords: ['vs', 'versus', 'compare', 'difference', 'better'],
        weight: 3
      },
      get_example: {
        keywords: ['example', 'demo', 'sample', 'show me', 'code'],
        weight: 3
      },
      best_practice: {
        keywords: ['best', 'recommended', 'proper', 'correct', 'should'],
        weight: 3
      },
      troubleshooting: {
        keywords: ['debug', 'troubleshoot', 'diagnose', 'identify'],
        weight: 3
      },
      setup_config: {
        keywords: ['setup', 'configure', 'install', 'config'],
        weight: 3
      },
      performance_opt: {
        keywords: ['optimize', 'performance', 'speed', 'fast', 'efficient'],
        weight: 3
      },
      security_help: {
        keywords: ['security', 'secure', 'protect', 'auth', 'permission'],
        weight: 3
      }
    };
  }

  // Entity extractors for identifying specific items
  createEntityExtractors() {
    return {
      // Extract technology names
      technologies: {
        patterns: [
          /\b(node|nodejs|express|fastify|react|vue|angular|typescript|javascript|mongodb|postgresql|redis|mysql|docker|kubernetes|aws|azure|gcp|graphql|rest|grpc|socket\.io|jwt|oauth|passport|mongoose|sequelize|prisma|nestjs|next\.js|gatsby|webpack|babel|eslint|prettier|jest|mocha|chai|sinon|pm2|nodemon|ts-node|eslint|prettier|git|github|gitlab|bitbucket|heroku|vercel|netlify|digitalocean|vultr|linode)\b/gi
        ],
        weight: 5
      },
      
      // Extract file extensions
      file_types: {
        patterns: [
          /\b\.(js|ts|jsx|tsx|json|xml|html|css|scss|less|md|txt|csv|sql|yml|yaml|env|lock|config|gitignore|dockerfile|test|spec)\b/gi
        ],
        weight: 3
      },
      
      // Extract commands
      commands: {
        patterns: [
          /\b(npm|yarn|pnpm|node|git|docker|kubectl|curl|wget|ssh|scp|rsync|grep|sed|awk|find|ls|cd|mkdir|rm|cp|mv|cat|less|more|tail|head|sort|uniq|wc|chmod|chown|ps|kill|top|htop|df|du|free|uname|whoami|pwd|echo|printf|date|sleep|watch|nohup|crontab|systemctl|service|mount|umount|tar|zip|unzip|gzip|gunzip|ssh-keygen|openssl|node|ts-node|nodemon|pm2)\b/gi
        ],
        weight: 4
      },
      
      // Extract code patterns
      code_patterns: {
        patterns: [
          /\b(function|class|const|let|var|if|else|for|while|do|switch|case|break|continue|return|try|catch|finally|throw|new|this|super|import|export|from|require|module|exports|async|await|promise|resolve|reject|then|catch|finally|fetch|axios|request|response|req|res|next|app|server|port|host|localhost|127\.0\.0\.1|0\.0\.0\.0|3000|8080|5000|443|80|http|https|ws|wss)\b/gi
        ],
        weight: 3
      },
      
      // Extract error messages
      error_patterns: {
        patterns: [
          /\b(error|exception|cannot|unable|failed|failure|timeout|undefined|null|nan|referenceerror|typeerror|syntaxerror|rangeerror|urierror|evalerror)\b/gi
        ],
        weight: 4
      }
    };
  }

  // Enhanced text preprocessing
  preprocessText(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')  // Remove special chars
      .replace(/\s+/g, ' ')     // Normalize spaces
      .trim();
  }

  // Lemmatization
  lemmatize(word) {
    // Direct mapping
    if (this.lemmatizer[word]) {
      return this.lemmatizer[word];
    }
    
    // Pattern-based lemmatization
    for (const [ending, replacement] of Object.entries(this.lemmatizer)) {
      if (word.endsWith(ending) && word.length > ending.length + 2) {
        return word.slice(0, -ending.length) + replacement;
      }
    }
    
    return word;
  }

  // Synonym expansion
  expandSynonyms(words) {
    const expanded = new Set(words);
    
    words.forEach(word => {
      const synonyms = this.synonyms[word];
      if (synonyms) {
        synonyms.forEach(synonym => expanded.add(synonym));
      }
    });
    
    return Array.from(expanded);
  }

  // Extract entities from text
  extractEntities(text) {
    const entities = new Set();
    
    Object.entries(this.entityExtractors).forEach(([type, extractor]) => {
      extractor.patterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
          matches.forEach(match => {
            entities.add(match.toLowerCase());
          });
        }
      });
    });
    
    return Array.from(entities);
  }

  // Detect user intent
  detectIntent(text) {
    const detectedIntents = [];
    const processedText = this.preprocessText(text);
    
    Object.entries(this.intentPatterns).forEach(([intent, config]) => {
      const matches = config.keywords.filter(keyword => 
        processedText.includes(keyword.toLowerCase())
      ).length;
      
      if (matches > 0) {
        detectedIntents.push({
          intent,
          confidence: (matches / config.keywords.length) * config.weight,
          matches
        });
      }
    });
    
    return detectedIntents.sort((a, b) => b.confidence - a.confidence);
  }

  // Detect context
  detectContext(text) {
    const processedText = this.preprocessText(text);
    const detectedContexts = [];
    
    Object.entries(this.contextPatterns).forEach(([context, patterns]) => {
      const matches = patterns.filter(pattern => 
        processedText.includes(pattern.toLowerCase())
      ).length;
      
      if (matches > 0) {
        detectedContexts.push({
          context,
          matches,
          confidence: matches / patterns.length
        });
      }
    });
    
    return detectedContexts.sort((a, b) => b.confidence - a.confidence);
  }

  // Enhanced keyword extraction
  extractKeywords(text) {
    const processedText = this.preprocessText(text);
    const words = processedText.split(' ').filter(word => word.length > 2);
    
    // Lemmatize words
    const lemmatizedWords = words.map(word => this.lemmatize(word));
    
    // Expand synonyms
    const expandedWords = this.expandSynonyms(lemmatizedWords);
    
    // Extract entities
    const entities = this.extractEntities(text);
    
    // Create multi-word phrases
    const phrases = [];
    for (let i = 0; i < lemmatizedWords.length - 1; i++) {
      phrases.push(lemmatizedWords[i] + ' ' + lemmatizedWords[i + 1]);
    }
    
    // Weight keywords
    const weightedKeywords = [];
    
    // Process individual words
    expandedWords.forEach(word => {
      let weight = 1;
      
      // Technology weight
      if (['axios', 'fastify', 'express', 'npm', 'node', 'http', 'api', 'server', 'nestjs', 'typescript', 'javascript', 'react', 'vue', 'angular', 'mongodb', 'postgresql', 'redis', 'docker', 'kubernetes', 'aws', 'graphql', 'rest', 'grpc'].includes(word)) {
        weight = 5;
      }
      // Action words
      else if (['install', 'create', 'handle', 'make', 'write', 'read', 'use', 'connect', 'build', 'deploy', 'fix', 'solve', 'debug', 'test', 'optimize', 'secure'].includes(word)) {
        weight = 3;
      }
      // Concept words
      else if (['function', 'class', 'object', 'array', 'string', 'number', 'promise', 'async', 'await', 'error', 'type', 'method', 'variable', 'module', 'package', 'library', 'framework', 'database', 'security', 'performance'].includes(word)) {
        weight = 2;
      }
      
      weightedKeywords.push({ word, weight });
    });
    
    // Process entities with higher weight
    entities.forEach(entity => {
      weightedKeywords.push({ word: entity, weight: 4 });
    });
    
    // Process phrases
    phrases.forEach(phrase => {
      weightedKeywords.push({ word: phrase, weight: 2 });
    });
    
    // Return all keywords with weights
    return [
      ...expandedWords,
      ...entities,
      ...phrases,
      ...weightedKeywords.map(item => item.word)
    ];
  }

  // Enhanced text similarity calculation
  calculateSimilarity(text1, text2) {
    const keywords1 = new Set(this.extractKeywords(text1));
    const keywords2 = new Set(this.extractKeywords(text2));
    
    const intersection = new Set([...keywords1].filter(x => keywords2.has(x)));
    const union = new Set([...keywords1, ...keywords2]);
    
    // Jaccard similarity
    const jaccardSimilarity = intersection.size / union.size;
    
    // Bonus for entity matches
    const entities1 = new Set(this.extractEntities(text1));
    const entities2 = new Set(this.extractEntities(text2));
    const entityIntersection = new Set([...entities1].filter(x => entities2.has(x)));
    const entityBonus = entityIntersection.size * 0.1;
    
    // Bonus for intent matches
    const intent1 = this.detectIntent(text1);
    const intent2 = this.detectIntent(text2);
    const intentBonus = intent1.some(i1 => 
      intent2.some(i2 => i1.intent === i2.intent)
    ) ? 0.2 : 0;
    
    return Math.min(1, jaccardSimilarity + entityBonus + intentBonus);
  }

  // Generate response suggestions based on context
  generateResponseSuggestions(input, possibleResponses) {
    const intent = this.detectIntent(input);
    const context = this.detectContext(input);
    
    // Sort responses by similarity
    const scoredResponses = possibleResponses.map(response => ({
      response,
      score: this.calculateSimilarity(input, response)
    }));
    
    return scoredResponses
      .sort((a, b) => b.score - a.score)
      .map(item => item.response);
  }

  // Main processing function
  processText(text) {
    return {
      keywords: this.extractKeywords(text),
      entities: this.extractEntities(text),
      intent: this.detectIntent(text),
      context: this.detectContext(text),
      processed: this.preprocessText(text)
    };
  }
}

module.exports = EnhancedNLP;
