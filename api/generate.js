/**
 * API Handler untuk generate mockup
 * File ini digunakan sebagai backend proxy jika diperlukan
 * Dapat dijalankan dengan Node.js + Express atau sebagai API route di Vercel/Netlify
 */

// Untuk penggunaan dengan Express.js
/*
const express = require('express');
const router = express.Router();

router.post('/generate', async (req, res) => {
    const { endpoint, params } = req.body;
    
    if (!endpoint) {
        return res.status(400).json({ error: 'Endpoint tidak ditemukan' });
    }
    
    const targetUrl = `https://api.zenzxz.my.id${endpoint}?${new URLSearchParams(params).toString()}`;
    
    try {
        const response = await fetch(targetUrl);
        
        if (!response.ok) {
            return res.status(response.status).json({ error: `API Error: ${response.statusText}` });
        }
        
        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type');
        
        res.setHeader('Content-Type', contentType || 'image/png');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(Buffer.from(buffer));
        
    } catch (err) {
        console.error('Proxy error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
*/

// Untuk penggunaan sebagai Vercel Serverless Function
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Hanya menerima POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { endpoint, params } = req.body;
    
    if (!endpoint) {
        return res.status(400).json({ error: 'Endpoint tidak ditemukan' });
    }
    
    // Buat URL target
    let targetUrl = `https://api.zenzxz.my.id${endpoint}`;
    
    if (params && Object.keys(params).length > 0) {
        targetUrl += `?${new URLSearchParams(params).toString()}`;
    }
    
    try {
        const response = await fetch(targetUrl);
        
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: `API Error: ${response.statusText}`,
                status: response.status
            });
        }
        
        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/png';
        
        res.setHeader('Content-Type', contentType);
        res.send(Buffer.from(buffer));
        
    } catch (err) {
        console.error('Proxy error:', err);
        res.status(500).json({ error: err.message });
    }
}