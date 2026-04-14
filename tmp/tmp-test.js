const { NlpManager } = require('node-nlp');
const fs = require('fs');

async function run() {
    const manager = new NlpManager({ languages: ['en'], forceNER: true, autoSave: false, nlu: { useNoneFeature: false } });
    manager.load('./ai-project/models/model.nlp');
    const res = await manager.process('en', 'I want to build a backend HTTP API with java script, what should I use?');
    console.log("INTENT:", res.intent);
    console.log("SCORE:", res.score);
    console.log("CLASSIFICATIONS:", res.classifications.slice(0, 5));
}

run();
