const { NlpManager } = require('node-nlp');
const FileManager = require('./FileManager');
const fs = require('fs');

async function trainNlp() {
    console.log('=== TRAINING LEARNING-MASTER AI (NODE-NLP) ===\n');

    try {
        const aiFileManager = new FileManager('./ai-project');

        // 1. Initialize NlpManager
        // Set autoSave to false so we can dictate where to save our model
        const manager = new NlpManager({ languages: ['en'], forceNER: true, autoSave: false, nlu: { useNoneFeature: false } });

        // 2. Load training data from ALL files in training directory
        console.log('1. Loading training data...');
        const trainingDir = 'data/training';
        const files = await aiFileManager.listDirAsync(trainingDir);
        const jsonlFiles = files.filter(f => f.name.endsWith('.jsonl'));

        let dataset = [];
        for (const file of jsonlFiles) {
            console.log(`   - Loading ${file.name}...`);
            const data = await aiFileManager.readTrainingDataAsync(
                `${trainingDir}/${file.name}`,
                'jsonl'
            );
            dataset = dataset.concat(data);
        }
        console.log(`\n   Total loaded ${dataset.length} training examples\n`);

        // 3. Smart Clustering: Group JSONL QA pairs into NLP Intents
        console.log('2. Clustering QA pairs into NLP Intents...');

        const intentToAnswers = new Map(); // intentName => Set of unique outputs
        const outputToIntent = new Map(); // exact output => intentName
        const inputToIntent = new Map();  // exact input => intentName
        let intentCounter = 1;

        let utterancesCount = 0;

        for (const item of dataset) {
            if (!item || typeof item.input !== 'string' || typeof item.output !== 'string') continue;

            const input = item.input.trim().toLowerCase();
            const output = item.output.trim();
            if (!input || !output) continue;

            const category = (item.category || 'general').replace(/[^a-zA-Z0-9]/g, '_');

            let intentName;

            // Rule 1: Identical inputs MUST use the same intent (to avoid collisions)
            if (inputToIntent.has(input)) {
                intentName = inputToIntent.get(input);
            }
            // Rule 2: Identical outputs logically belong to the same intent (different ways to ask the same thing)
            else if (outputToIntent.has(output)) {
                intentName = outputToIntent.get(output);
            }
            // Rule 3: Brand new QA pair -> Create new Intent
            else {
                intentName = `intent_${category}_${intentCounter++}`;
            }

            // Track mappings so future iterations cluster correctly
            inputToIntent.set(input, intentName);
            outputToIntent.set(output, intentName);

            // Safeguard against strings that tokenize to empty arrays
            if (input.length < 2) continue;

            // Register the Utterance (Document) in node-nlp
            try {
                manager.addDocument('en', input, intentName);
                utterancesCount++;
            } catch (err) {
                console.error(`\n[CRASH] Failed to add document:`, input);
                console.error(`[CRASH] Exception:`, err);
                process.exit(1);
            }

            // Register the Answer
            if (!intentToAnswers.has(intentName)) {
                intentToAnswers.set(intentName, new Set());
            }
            intentToAnswers.get(intentName).add(output);
        }

        // Add all unique answers to their respective intents in the NLP manager
        let uniqueAnswersCount = 0;
        for (const [intentName, answers] of intentToAnswers.entries()) {
            for (const answer of answers) {
                manager.addAnswer('en', intentName, answer);
                uniqueAnswersCount++;
            }
        }

        console.log(`   Created ${intentToAnswers.size} unique intents.`);
        console.log(`   Mapped ${utterancesCount} utterances and ${uniqueAnswersCount} dynamic answers.\n`);

        // 4. Train the AI with verbose progress
        console.log('3. Training Neural Network...');
        const startTime = Date.now();

        // node-nlp v3 exposes the neural net via the domain manager
        // We hook into the trainer's event system to watch each epoch
        let epochCount = 0;
        const originalTrain = manager.nlpManager?.train?.bind(manager) || null;

        // Wrap manager to capture progress
        const trainResult = await new Promise((resolve, reject) => {
            manager.train().then(result => {
                resolve(result);
            }).catch(reject);
        });

        const trainingTime = Date.now() - startTime;

        // Post-training model stats
        console.log(`\n   ✅ Training completed in ${trainingTime}ms`);
        console.log(`\n   ╔═══════════════════════════════════╗`);
        console.log(`   ║        TRAINING REPORT             ║`);
        console.log(`   ╠═══════════════════════════════════╣`);
        console.log(`   ║  Unique Intents:   ${String(intentToAnswers.size).padEnd(15)} ║`);
        console.log(`   ║  Total Utterances: ${String(utterancesCount).padEnd(15)} ║`);
        console.log(`   ║  Unique Answers:   ${String(uniqueAnswersCount).padEnd(15)} ║`);
        console.log(`   ║  Training Time:    ${String(trainingTime + 'ms').padEnd(15)} ║`);
        console.log(`   ║  Avg utt/Intent:   ${String((utterancesCount / intentToAnswers.size).toFixed(2)).padEnd(15)} ║`);
        console.log(`   ║  None Feature:     ${'OFF (forced)'.padEnd(15)} ║`);
        console.log(`   ╚═══════════════════════════════════╝\n`);

        // 5. Save the model
        console.log('4. Saving NLP Model...');
        const modelPath = 'ai-project/models/model.nlp';
        manager.save(modelPath);
        console.log(`   AI model saved successfully to ${modelPath}!\n`);

        console.log('=== NLP TRAINING COMPLETE ===');
        console.log('AI has upgraded to full NLU capabilities!');

    } catch (error) {
        console.error('Training failed:', error);
        process.exit(1);
    }
}

trainNlp();
