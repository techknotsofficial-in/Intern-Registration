import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// ────────────────────────────────
// CONFIGURATION
// ────────────────────────────────

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

// Google Sheets Authentication
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});

const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID, serviceAccountAuth);

// ────────────────────────────────
// HELPER FUNCTIONS
// ────────────────────────────────

// Generate a sequential Registration Number
async function generateRegistrationNumber(sheet) {
  const year = new Date().getFullYear();
  // Get all rows to find the last registration number
  const rows = await sheet.getRows();
  let counter = 1;
  
  if (rows.length > 0) {
    // Find the highest TK-YYYY-XXXX number
    const regNumbers = rows.map(row => {
      const regNo = row.get('Registration Number');
      if (regNo && regNo.startsWith(`TK-${year}-`)) {
        return parseInt(regNo.split('-')[2], 10);
      }
      return 0;
    }).filter(n => !isNaN(n));
    
    if (regNumbers.length > 0) {
      counter = Math.max(...regNumbers) + 1;
    }
  }
  
  const num = String(counter).padStart(4, '0');
  return `TK-${year}-${num}`;
}

// ────────────────────────────────
// API ROUTES
// ────────────────────────────────

// POST /api/create-order — Create a secure Razorpay order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, error: 'Amount is required' });
    }

    const options = {
      amount: amount, // Amount is in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, error: 'Failed to create payment order' });
  }
});

// POST /api/verify-payment — Verify signature and save to Google Sheets
app.post('/api/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      studentData
    } = req.body;

    // 1. Verify Razorpay Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ success: false, error: 'Invalid payment signature' });
    }

    // 2. Load Google Sheet
    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = doc.sheetsByIndex[0]; // assumes the first sheet is the one we want

    // 3. Duplicate Prevention
    const rows = await sheet.getRows();
    const isDuplicate = rows.some(row => 
      row.get('Email') === studentData.email || 
      row.get('Phone') === studentData.phone
    );

    if (isDuplicate) {
      // Payment was successful, but they are already registered
      return res.status(400).json({ 
        success: false, 
        error: 'A registration with this email or phone already exists.',
        paymentId: razorpay_payment_id 
      });
    }

    // 4. Generate Registration Number & Date
    const registrationNumber = await generateRegistrationNumber(sheet);
    const registrationDate = new Date().toISOString();

    // 5. Append Row to Google Sheet
    const newRow = {
      'Registration Number': registrationNumber,
      'Full Name': studentData.fullName,
      'Email': studentData.email,
      'Phone': studentData.phone,
      'College': studentData.college,
      'Department': studentData.department,
      'Year': studentData.year,
      'Program': studentData.program,
      'Mode': studentData.mode,
      'Message': studentData.message || '',
      'Amount Paid': studentData.amountPaid,
      'Payment ID': razorpay_payment_id,
      'Order ID': razorpay_order_id,
      'Payment Status': 'Success',
      'Registration Date': registrationDate
    };

    await sheet.addRow(newRow);

    console.log(`✅ Verified & Saved: ${registrationNumber} - ${studentData.fullName}`);

    res.status(200).json({
      success: true,
      registration: {
        registrationNumber,
        ...studentData,
        paymentId: razorpay_payment_id
      }
    });

  } catch (error) {
    console.error('Verification/Save error:', error);
    res.status(500).json({ success: false, error: 'Internal server error during verification' });
  }
});

// ────────────────────────────────
// START SERVER
// ────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 TechKnots Server running on port ${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api\n`);
});
