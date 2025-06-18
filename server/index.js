require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const AdminUser = require('./Models/AdminUser')
const Category = require('./Models/CategorySchema');
const SubCategory = require('./Models/SubCategory');
const Item = require('./Models/Items');
const User = require('./Models/User');
const connectDB = require('./connectDb');

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

app.post('/admin-register', async (req, res) => {
    const { fullName, phoneNo, username, password } = req.body;

    try {
        const existingUser = await AdminUser.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newAdmin = new AdminUser({ fullName, phoneNo, username, password });
        await newAdmin.save();

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /admin-login
app.post('/admin-login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await AdminUser.findOne({ username });
        if (!admin || admin.password !== password) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Create token WITHOUT expiry (do NOT set expiresIn)
        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            JWT_SECRET
            // no expiresIn here means token never expires (not recommended for production but as requested)
        );

        res.status(200).json({ message: 'Login successful', token, admin });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /admin-details-update
app.put('/admin-details-update', async (req, res) => {
    const { username, fullName, phoneNo, password } = req.body;

    try {
        const updatedAdmin = await AdminUser.findOneAndUpdate(
            { username },
            { $set: { fullName, phoneNo, password } },
            { new: true }
        );

        if (!updatedAdmin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json({ message: 'Admin updated successfully', admin: updatedAdmin });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});


// POST add-category
app.post('/add-category', async (req, res) => {
    try {
        const { sNo, name } = req.body;
        const category = new Category({ sNo, name });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update-category/:id
app.put('/update-category/:id', async (req, res) => {
    try {
        const { sNo, name } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { sNo, name },
            { new: true }
        );
        if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });
        res.json(updatedCategory);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE delete-category/:id
app.delete('/delete-category/:id', async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// --- SUBCATEGORY ROUTES ---

// POST add-subcategory
app.post('/add-subcategory', async (req, res) => {
    try {
        const { sNo, name, category } = req.body;
        const subCategory = new SubCategory({ sNo, name, category });
        await subCategory.save();
        res.status(201).json(subCategory);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update-subcategory/:id
app.put('/update-subcategory/:id', async (req, res) => {
    try {
        const { sNo, name, category } = req.body;
        const updatedSubCategory = await SubCategory.findByIdAndUpdate(
            req.params.id,
            { sNo, name, category },
            { new: true }
        );
        if (!updatedSubCategory) return res.status(404).json({ message: 'SubCategory not found' });
        res.json(updatedSubCategory);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE delete-subcategory/:id
app.delete('/delete-subcategory/:id', async (req, res) => {
    try {
        const deletedSubCategory = await SubCategory.findByIdAndDelete(req.params.id);
        if (!deletedSubCategory) return res.status(404).json({ message: 'SubCategory not found' });
        res.json({ message: 'SubCategory deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// --- ITEM ROUTES ---

// POST add-item
app.post('/add-item', async (req, res) => {
    try {
        const { name, iconUrl, link, document, category, subCategory } = req.body;
        const item = new Item({ name, iconUrl, link, document, category, subCategory });
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update-item/:id
app.put('/update-item/:id', async (req, res) => {
    try {
        const { name, iconUrl, link, document, category, subCategory } = req.body;
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            { name, iconUrl, link, document, category, subCategory },
            { new: true }
        );
        if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE delete-item/:id
app.delete('/delete-item/:id', async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// GET all categories
app.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all subcategories
app.get('/subcategories', async (req, res) => {
    try {
        // Optionally populate category details
        const subcategories = await SubCategory.find({})
        res.status(200).json(subcategories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all items
app.get('/items', async (req, res) => {
    try {
        // Optionally populate category and subCategory details
        const items = await Item.find({})
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- USER ROUTES ---

// POST /user-register
app.post('/user-register', async (req, res) => {
    try {
        const { username, password, category } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newUser = new User({ username, password, category });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /user-login
app.post('/user-login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET);
        res.status(200).json({ message: 'Login successful', token, user });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /user-update/:id
app.put('/user-update/:id', async (req, res) => {
    try {
        const { username, password, category } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { username, password, category },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /user-delete/:id
app.delete('/user-delete/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

































































const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log('Server Connected');
        });
    } catch (error) {
        console.log(error);
    }
};

start();

module.exports = app;