const { NlpManager } = require('node-nlp');

try {
    console.log("Initializing NlpManager...");
    const manager = new NlpManager({ languages: ['en'], forceNER: true });
    console.log("Adding document...");
    manager.addDocument('en', 'hello world', 'greeting');
    console.log("Adding answer...");
    manager.addAnswer('en', 'greeting', 'hello there!');
    console.log("Training...");
    manager.train().then(() => {
        console.log("Done.");
    }).catch(e => {
        console.error("Train error:", e);
    });
} catch (e) {
    console.error("Init Error:", e);
}
