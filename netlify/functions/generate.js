const fetch = require('node-fetch');
const FormData = require('form-data');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        console.log('Starting generation process...');
        
        // Parse form data
        const contentType = event.headers['content-type'] || '';
        
        if (!contentType.includes('multipart/form-data')) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid content type. Expected multipart/form-data' })
            };
        }

        // Get boundary from content-type
        const boundary = contentType.split('boundary=')[1];
        if (!boundary) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'No boundary found in content-type' })
            };
        }

        // Convert body to buffer
        const bodyBuffer = Buffer.from(
            event.body, 
            event.isBase64Encoded ? 'base64' : 'utf8'
        );
        
        console.log('Parsing multipart data...');
        const parts = parseMultipart(bodyBuffer, boundary);
        
        const name = parts.name;
        const comment = parts.comment;
        const imageBuffer = parts.image?.buffer;
        const imageName = parts.image?.filename || 'image.jpg';

        if (!name || !comment || !imageBuffer) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Missing required fields',
                    received: {
                        name: !!name,
                        comment: !!comment,
                        image: !!imageBuffer
                    }
                })
            };
        }

        console.log('Step 1: Uploading profile image to Catbox...');
        // Step 1: Upload profile image to Catbox
        const catboxFormData = new FormData();
        catboxFormData.append('reqtype', 'fileupload');
        catboxFormData.append('fileToUpload', imageBuffer, {
            filename: imageName,
            contentType: 'image/jpeg'
        });

        const catboxResponse = await fetch('https://catbox.moe/user/api.php', {
            method: 'POST',
            body: catboxFormData,
            headers: catboxFormData.getHeaders()
        });

        const imageUrlText = await catboxResponse.text();
        
        if (!imageUrlText.startsWith('http')) {
            console.error('Catbox error:', imageUrlText);
            throw new Error(`Failed to upload image: ${imageUrlText.substring(0, 100)}`);
        }
        
        const imageUrl = imageUrlText.trim();
        console.log('Profile image uploaded:', imageUrl);

        console.log('Step 2: Generating fake FB quote...');
        // Step 2: Generate fake FB quote using CORRECT endpoint
        const fakeFbUrl = `https://api.zenzxz.my.id/maker/fakefbcomment?name=${encodeURIComponent(name)}&comment=${encodeURIComponent(comment)}&url=${encodeURIComponent(imageUrl)}`;
        
        console.log('Calling fakefb API:', fakeFbUrl);
        
        const fakeFbResponse = await fetch(fakeFbUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        if (!fakeFbResponse.ok) {
            throw new Error(`FakeFB API returned status ${fakeFbResponse.status}`);
        }
        
        // Get HTML content from API
        const htmlContent = await fakeFbResponse.text();
        console.log('Received HTML content, length:', htmlContent.length);
        
        if (htmlContent.length < 100) {
            throw new Error('HTML content too short, API may be failing');
        }

        console.log('Step 3: Uploading result to Catbox...');
        // Step 3: Upload HTML result to Catbox
        const resultFormData = new FormData();
        resultFormData.append('reqtype', 'fileupload');
        resultFormData.append('fileToUpload', Buffer.from(htmlContent, 'utf-8'), {
            filename: 'fakefb-quote.html',
            contentType: 'text/html'
        });

        const resultCatboxResponse = await fetch('https://catbox.moe/user/api.php', {
            method: 'POST',
            body: resultFormData,
            headers: resultFormData.getHeaders()
        });

        const resultUrlText = await resultCatboxResponse.text();

        if (!resultUrlText.startsWith('http')) {
            console.error('Catbox upload error:', resultUrlText);
            throw new Error('Failed to upload result to Catbox');
        }
        
        const resultUrl = resultUrlText.trim();
        console.log('Result uploaded:', resultUrl);

        // Return success response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                imageUrl: resultUrl,
                success: true,
                isHtml: true
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: error.message || 'Internal server error',
                success: false,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            })
        };
    }
};

// Simple multipart parser
function parseMultipart(buffer, boundary) {
    const parts = {};
    const boundaryBuffer = Buffer.from(`--${boundary}`);
    const sections = [];
    
    let start = 0;
    while (true) {
        const index = buffer.indexOf(boundaryBuffer, start);
        if (index === -1) break;
        if (start !== 0) sections.push(buffer.slice(start, index));
        start = index + boundaryBuffer.length;
        
        // Check for end boundary
        const endCheck = buffer.indexOf(Buffer.from(`--${boundary}--`), start);
        if (endCheck === start - 2) break;
    }

    for (const section of sections) {
        const headerEnd = section.indexOf('\r\n\r\n');
        if (headerEnd === -1) continue;
        
        const header = section.slice(0, headerEnd).toString();
        const content = section.slice(headerEnd + 4, section.length);
        
        const nameMatch = header.match(/name="([^"]+)"/);
        if (!nameMatch) continue;
        
        const fieldName = nameMatch[1];
        
        if (fieldName === 'image') {
            const filenameMatch = header.match(/filename="([^"]+)"/);
            parts[fieldName] = {
                buffer: content,
                filename: filenameMatch ? filenameMatch[1] : 'image.jpg'
            };
        } else {
            parts[fieldName] = content.toString().trim();
        }
    }
    
    return parts;
}