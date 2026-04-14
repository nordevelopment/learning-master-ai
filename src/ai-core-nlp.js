const { NlpManager } = require('node-nlp');
const fs = require('fs');

class SimpleAINlp {
    constructor() {
        this.config = JSON.parse(fs.readFileSync('./ai-project/configs/model-config.json', 'utf8'));
        this.manager = new NlpManager({ languages: ['en'], forceNER: true, autoSave: false, nlu: { useNoneFeature: false } });
        this.trained = false;
        this.conversationHistory = [];
        this.nlp = true;
        this.responses = { size: 1185 };
    }

    async loadModel() {
        const modelPath = './ai-project/models/model.nlp';
        if (fs.existsSync(modelPath)) {
            this.manager.load(modelPath);
            this.trained = true;
            console.log('NLU Brain Loaded Successfully!');
            return true;
        }
        return false;
    }

    async respond(question, slots) {
        // Process through NLP.js
        const result = await this.manager.process('en', question);

        let finalAnswer = result.answer;
        let confidence = result.score;

        // Smart Fallback Handling
        if (!finalAnswer || confidence < 0.25) {
            const topIntent = result.classifications[0];
            if (topIntent && topIntent.intent !== 'None' && topIntent.score > 0.1) {
                finalAnswer = `I don't have a direct answer, but it sounds like you're talking about ${topIntent.intent.replace(/_/g, ' ')}. Could you clarify?`;
            } else {
                finalAnswer = "I'm still learning and I'm not entirely sure what you mean. Could you ask in a different way?";
            }
        }

        // Format `thinking` object so the frontend Debug panel can visualize what happened
        const thinking = {
            keywords: result.utterance.split(' ').map(w => w.toLowerCase()),
            intent: result.classifications.slice(0, 3).map(c => ({
                intent: c.label || c.intent || 'None',
                score: c.value !== undefined ? c.value : c.score || 0
            })),
            confidence: confidence,
            candidates: result.classifications.slice(0, 3).map(c => ({
                category: c.label || c.intent || 'None',
                similarity: c.value !== undefined ? c.value : c.score || 0,
                output: (c.label || c.intent) === result.intent ? (result.answer || '') : '',
                input: c.label || c.intent || 'None'
            })),
            algorithm: 'node-nlp Machine Learning',
            entities: result.entities // Exposing NER!
        };

        this.conversationHistory.push({
            question,
            processed: { intent: thinking.intent },
            timestamp: new Date().toISOString()
        });

        if (this.conversationHistory.length > 20) {
            this.conversationHistory.shift();
        }

        return {
            answer: finalAnswer,
            thinking: thinking
        };
    }

    getKnowledgeMap() {
        return {
            categories: [{ name: 'NLP Model Intents', count: 1184 }],
            technologies: [{ name: 'Deep Context Mapping', count: 1246 }],
            totalPatterns: 1184,
            totalDocuments: 1246
        };
    }
}

module.exports = SimpleAINlp;
