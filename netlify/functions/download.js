const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { imageUrl } = JSON.parse(event.body);

        if (!imageUrl) {
            return {
                statusCode: 400,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Image URL is required' })
            };
        }

        console.log('Downloading image from:', imageUrl);

        // Fetch the image
        const response = await fetch(imageUrl);
        
        if (!response.ok) {
            throw new Error('Failed to fetch image');
        }

        const buffer = await response.buffer();
        const base64 = buffer.toString('base64');

        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Content-Type': 'image/jpeg',
                'Content-Disposition': `attachment; filename="fake-fb-quote-${Date.now()}.jpg"`
            },
            body: base64,
            isBase64Encoded: true
        };

    } catch (error) {
        console.error('Download error:', error);
        return {
            statusCode: 500,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                error: error.message || 'Failed to download image' 
            })
        };
    }
};
