const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'ai-project', 'data', 'training', 'nodejs-training.jsonl');

const newItems = [
    {input: "How to set up middleware in Express?", output: "In Express, middleware are functions that have access to the request and response objects. Use app.use() to apply them globally or as a second argument in routes.", category: "web_frameworks"},
    {input: "How to configure routes in Fastify?", output: "In Fastify, you can define routes using fastify.route() or shorthand methods like fastify.get(). Example: fastify.get('/' , async (request, reply) => { return { hello: 'world' } }).", category: "web_frameworks"},
    {input: "Explain JWT authentication process", output: "JWT (JSON Web Token) is a compact way to transmit information as a JSON object. Process: 1. User logs in. 2. Server creates a signed token. 3. Client stores token. 4. Client sends token in Authorization header for future requests.", category: "security"},
    {input: "How to implement rate limiting in Node.js?", output: "To implement rate limiting, use libraries like express-rate-limit. It prevents brute-force attacks by limiting the number of requests from a single IP within a timeframe.", category: "security"},
    {input: "What is the difference between SQL and NoSQL databases?", output: "SQL databases (PostgreSQL, MySQL) are relational and use structured schemas. NoSQL databases (MongoDB, Redis) are document-based or key-value pairs, offering more flexibility for unstructured data.", category: "database"},
    {input: "How to connect Express to MongoDB?", output: "Use Mongoose library! Install it via npm, then use mongoose.connect('mongodb://localhost:27017/myapp') to establish connection.", category: "database"},
    {input: "How to query documents in Mongoose?", output: "Use model methods like find(), findOne(), or findById(). Example: User.find({ age: { $gt: 18 } }) finds all users older than 18.", category: "database"},
    {input: "What is a Promise in JavaScript?", output: "A Promise is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value.", category: "javascript_concepts"},
    {input: "How to handle multiple promises simultaneously?", output: "Use Promise.all([p1, p2, p3]) to wait for all promises to resolve, or Promise.race() for the first one to complete.", category: "javascript_concepts"},
    {input: "What are Node.js Streams?", output: "Streams are collections of data that might not be available all at once and don't have to fit in memory. They are used for reading/writing files or network communication efficiently.", category: "node_fundamentals"}
];

const lines = newItems.map(item => JSON.stringify(item)).join('\n') + '\n';

fs.appendFileSync(filePath, lines);
console.log('Successfully added 10 new training examples.');
