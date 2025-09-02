const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('./module/Users');

const Port = 3001;
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/CRUD');

// Secret key for JWT
const JWT_SECRET = "mysecretkey";

// ---------------- Register ----------------
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // check if user exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await UserModel.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({ 
            message: "User registered successfully", 
            user: { id: newUser._id, name: newUser.name, email: newUser.email } 
        });
    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err });
    }
});

// ---------------- Login ----------------
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ 
            token, 
            user: { id: user._id, name: user.name, email: user.email } 
        });
    } catch (err) {
        res.status(500).json({ message: "Login error", error: err });
    }
});

// ---------------- Middleware to verify token ----------------
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

    if (!token) return res.status(403).json({ message: "Token required" });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = decoded;
        next();
    });
};

// Example protected route
app.get('/profile', verifyToken, (req, res) => {
    res.json({ message: "Profile accessed", user: req.user });
});

// ---------------- Other CRUD routes ----------------
app.get('/', (req, res) => {
    UserModel.find({})
    .then(users => res.json(users))
    .catch(err => res.json(err))
});

app.get('/getUser/:id', (req, res) => {
    const id = req.params.id;
    UserModel.findById({ _id: id })
    .then(user => res.json(user))
    .catch(err => res.json(err))
});

app.put('/updateUser/:id', (req, res) => {
    const id = req.params.id;
    UserModel.findByIdAndUpdate(
        { _id: id },
        { name: req.body.name, email: req.body.email, age: req.body.age },
        { new: true }
    )
    .then(user => res.json(user))
    .catch(err => res.json(err))
});

app.delete('/deleteUser/:id', (req, res) => {
    const id = req.params.id;
    UserModel.findByIdAndDelete({ _id: id })
    .then(result => res.json(result))
    .catch(err => res.json(err))
});

app.post('/createUser', (req, res) => {
    UserModel.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.json(err))
});

app.listen(Port, () => {
    console.log('listening on port', Port);
});
