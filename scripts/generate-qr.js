#!/usr/bin/env node
const QRCode = require('qrcode');
const fs = require('fs');

// Simple logger for Node.js script
const logger = {
    info: (message, context = '') => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] INFO: ${message}${context ? ' ' + JSON.stringify(context) : ''}`);
    },
    success: (message, context = '') => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] SUCCESS: ${message}${context ? ' ' + JSON.stringify(context) : ''}`);
    },
    error: (message, context = '') => {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] ERROR: ${message}${context ? ' ' + JSON.stringify(context) : ''}`);
    }
};

// Updated APK download URL from latest build
const apkUrl = 'https://expo.dev/artifacts/eas/iY7M9FrMP9mAsVXbv3YhCQ.apk';

async function generateQRCode() {
    try {
        logger.info('Generating QR Code for SpeakMate APK');
        logger.info('APK URL configured', { url: apkUrl });

        // Generate QR code options
        const options = {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            quality: 0.92,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            width: 512  // 512x512 pixels
        };

        // Generate QR code as PNG file
        await QRCode.toFile('./speakmate-apk-qr.png', apkUrl, options);
        logger.success('QR Code PNG generated', { file: 'speakmate-apk-qr.png', size: '512x512' });

        // Generate QR code as SVG file (scalable)
        const svgString = await QRCode.toString(apkUrl, { type: 'svg', width: 512 });
        fs.writeFileSync('./speakmate-apk-qr.svg', svgString);
        logger.success('QR Code SVG generated', { file: 'speakmate-apk-qr.svg', format: 'scalable' });

        // Generate QR code in terminal (for quick view)
        logger.info('QR Code preview (scan with phone)');
        const terminalQR = await QRCode.toString(apkUrl, { type: 'terminal', small: true });
        logger.info(terminalQR);

        logger.success('QR Code generation complete');
        logger.info('Usage instructions', {
            steps: [
                'Open speakmate-apk-qr.png or speakmate-apk-qr.svg',
                'Share the QR code image',
                'Users scan with phone camera',
                'Downloads SpeakMate APK directly'
            ]
        });

    } catch (error) {
        logger.error('Error generating QR code', {
            error: error.message,
            stack: error.stack?.split('\n')[0]
        });
    }
}

generateQRCode();