const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SECRET_KEY = 'nero_secret_key';
let users = [];

// Homepage
app.get('/', (req, res) => {
    res.send('Welcome to NERO IPTV!');
});

// Login Page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Sign-Up Page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Sign-Up Route
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const existingUser = users.find(user => user.username === username);
    
    if (existingUser) {
        return res.status(409).json({ message: 'Username already taken' });
    }

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

// View All Accounts
app.get('/manage-accounts', (req, res) => {
    res.json(users);
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
