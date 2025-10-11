#!/usr/bin/env node

const QRCode = require('qrcode');
const fs = require('fs');

// Your APK download URL
const APK_URL = 'https://expo.dev/artifacts/eas/bwy2PiPnDs4k5DXkXkoFiH.apk';

async function generateQRCode() {
    try {
        console.log('🎯 Generating QR Code for SpeakMate APK...');
        console.log('📱 APK URL:', APK_URL);

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
        await QRCode.toFile('./speakmate-apk-qr.png', APK_URL, options);
        console.log('✅ QR Code saved as: speakmate-apk-qr.png');

        // Generate QR code as SVG file (scalable)
        const svgString = await QRCode.toString(APK_URL, { type: 'svg', width: 512 });
        fs.writeFileSync('./speakmate-apk-qr.svg', svgString);
        console.log('✅ QR Code saved as: speakmate-apk-qr.svg');

        // Generate QR code in terminal (for quick view)
        console.log('\n📱 QR Code (scan with phone):');
        const terminalQR = await QRCode.toString(APK_URL, { type: 'terminal', small: true });
        console.log(terminalQR);

        console.log('\n🎉 QR Code generation complete!');
        console.log('📋 Instructions:');
        console.log('   1. Open speakmate-apk-qr.png or speakmate-apk-qr.svg');
        console.log('   2. Share the QR code image');
        console.log('   3. Users scan with phone camera');
        console.log('   4. Downloads SpeakMate APK directly');

    } catch (error) {
        console.error('❌ Error generating QR code:', error);
    }
}

generateQRCode();