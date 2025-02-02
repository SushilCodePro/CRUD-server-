import express from 'express';
import path from 'path';
import 'dotenv/config'

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Define the file path for the HTML file
const htmlFilePath = path.join(process.cwd(), 'index.html');

// Set up a route for the home page
app.get('/', (req, res) => {
    res.send('<h1>Hello, Express.js!</h1>');
});

// Serve the HTML file
app.get('/about', (req, res) => {
    res.sendFile(htmlFilePath);
});

// JSON API route
app.get('/api', (req, res) => {
    // res.json({ message: 'Welcome to the API!', version: '1.0.0' });
    res.status(200).send(myData);
});

// In-memory data store (Array)
let nextId = 1;
let myData = [];

// ✅ **POST Route (Add new item)**
app.post('/api/data', (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
    }
    const newItem = { id: nextId++, name, price };
    myData.push(newItem);
    res.status(201).json(newItem);
});

// ✅ **PUT Route (Update an item by ID)**
app.put('/api/data/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price } = req.body;
    
    const itemIndex = myData.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }

    // Update item
    myData[itemIndex] = { id, name: name || myData[itemIndex].name, price: price || myData[itemIndex].price };
    
    res.json({ message: 'Item updated successfully', updatedItem: myData[itemIndex] });
});

// ✅ **DELETE Route (Remove an item by ID)**
app.delete('/api/data/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const itemIndex = myData.findIndex(item => item.id === id);

    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }

    // Remove the item
    const deletedItem = myData.splice(itemIndex, 1);
    
    res.json({ message: 'Item deleted successfully', deletedItem: deletedItem[0] });
});

// Define the server port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
