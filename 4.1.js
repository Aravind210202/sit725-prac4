const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Connects to MongoDB
mongoose.connect('mongodb://localhost:27017/SIT725', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Defines schema for form data
const formDataSchema = new mongoose.Schema({
    unit: String
});

const CourseSelection = mongoose.model('CourseSelection', formDataSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route to handle form submission
app.post('/submit', async (req, res) => {
    const { unit } = req.body;

    try {
        // Creates a new document in MongoDB
        const formData = new CourseSelection({ unit });
        await formData.save();
        res.send('Form submitted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error submitting form');
    }
});

// Starts server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

