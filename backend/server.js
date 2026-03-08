const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Basic Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Logger
app.use((req, res, next) => {
    console.log(`${new Date().toLocaleTimeString()} - [${req.method}] ${req.url}`);
    next();
});

// 3. DB Connect
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern_project')
    .then(() => console.log('✅ DB Connected'))
    .catch(err => console.error('❌ DB Error:', err));

// 4. Model
const Customer = mongoose.model('Customer', new mongoose.Schema({
    customerName: String,
    phoneNumber: String,
    modelName: String,
    problemDescription: String,
    devicePassword: String,
    approximateAmount: Number,
    attenderName: String,
    entryDate: String,
    status: { type: String, default: 'Pending', enum: ['Pending', 'Completed', 'Delivery'] }
}, { timestamps: true }));

// 5. API Router
const apiRouter = express.Router();

// Health
apiRouter.get('/ping', (req, res) => res.json({ status: 'ok' }));

// Auth
apiRouter.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin@123') {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

// Customers Collection
apiRouter.get('/customers', async (req, res) => {
    try {
        const data = await Customer.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

apiRouter.post('/customers', async (req, res) => {
    try {
        const item = new Customer(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Individual Customer (The problematic ones)
apiRouter.route('/customers/:id')
    .get(async (req, res) => {
        try {
            const item = await Customer.findById(req.params.id);
            if (!item) return res.status(404).json({ message: 'Not found' });
            res.json(item);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    })
    .patch(async (req, res) => {
        try {
            console.log(`[API] PATCH request for ID: ${req.params.id}`);
            const updateData = { ...req.body };
            delete updateData._id;
            
            const updated = await Customer.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
            
            if (!updated) {
                console.warn(`[API] Document ${req.params.id} not found`);
                return res.status(404).json({ message: 'Customer record not found for update.' });
            }
            
            console.log(`[API] Successfully updated ${req.params.id}`);
            res.json(updated);
        } catch (err) {
            console.error('[API] Patch Error:', err);
            res.status(500).json({ error: err.message });
        }
    })
    .delete(async (req, res) => {
        try {
            const deleted = await Customer.findByIdAndDelete(req.params.id);
            if (!deleted) return res.status(404).json({ message: 'Not found' });
            res.json({ message: 'Deleted' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

// Mount Router
app.use('/api', apiRouter);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404
app.use((req, res) => {
    console.log(`404: ${req.method} ${req.url}`);
    res.status(404).send(`Cannot ${req.method} ${req.url}`);
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server on ${PORT} (Accessible via Network)`));
}

module.exports = app;
