const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
app.use(express.json()); // To parse JSON data
app.use(express.urlencoded({ extended: true })); // To parse form data

const SECRET_KEY = 'nero_secret_key';

// In-memory user storage (replace with database later)
let users = [];

// Default route (homepage)
app.get('/', (req, res) => {
    res.send('Welcome to NERO IPTV!');
});

// Serve Login Page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve Sign-Up Page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Sign-Up Route
app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    // Check if username already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(409).json({ message: 'Username already taken' });
    }

    // Add new user
    const newUser = { username, password };
    users.push(newUser);
    res.json({ message: 'Account created successfully!', user: newUser });
});

// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Account Management (View All Users - Admin Only)
app.get('/manage-accounts', (req, res) => {
    res.json(users);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
