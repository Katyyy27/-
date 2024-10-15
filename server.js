const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
// Middleware to serve static files
app.use(express.static(path.join(__dirname))); 

const links = {};

// Create a new secure link
app.post('/create-link', async (req, res) => {
    const { url, description, password } = req.body;
    if (!url || !password || !description) {
        return res.status(400).json({ message: 'URL, description, and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const linkId = uuidv4();
    links[linkId] = { url, description, password: hashedPassword };

    res.status(200).json({ message: 'Link created', linkId });
});

// Access the secure link and description
app.post('/access-link/:id', async (req, res) => {
    const { password } = req.body;
    const linkId = req.params.id;
    const linkData = links[linkId];

    if (!linkData) {
        return res.status(404).json({ message: 'Link not found or expired' });
    }

    const isMatch = await bcrypt.compare(password, linkData.password);

    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    res.status(200).json({ url: linkData.url, description: linkData.description });
});


app.listen(3000, () => console.log('Сервер запущено за адресою http://localhost:3000'));

