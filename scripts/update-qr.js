#!/usr/bin/env node
import { logger } from '../utils/logger';
const QRCode = require('qrcode');
const fs = require('fs');

// Function to get latest build URL from EAS
async function getLatestBuildUrl() {
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);

    try {
        logger.info('🔍 Fetching latest build information...');
        const { stdout } = await execPromise('npx eas build:list --limit 1 --non-interactive');

        // Extract APK URL from output
        const lines = stdout.split('\n');
        const urlLine = lines.find(line => line.includes('Application Archive URL'));

        if (urlLine && !urlLine.includes('null')) {
            const url = urlLine.split('Application Archive URL')[1].trim();
            logger.info('✅ Found APK URL:', url);
            return url;
        } else {
            logger.warn('❌ No APK URL found in latest build');
            return null;
        }
    } catch (error) {
        logger.error('❌ Error fetching build info:', {
            error: error.message
        });
        return null;
    }
}

async function generateQRCodeFromLatestBuild() {
    try {
        let apkUrl = await getLatestBuildUrl();

        if (!apkUrl) {
            logger.warn('⚠️ No valid APK URL found. Using fallback URL...');
            // Fallback to current known URL
            apkUrl = 'https://expo.dev/artifacts/eas/bwy2PiPnDs4k5DXkXkoFiH.apk';
        }

        logger.info('🎯 Generating QR Code for:', apkUrl);

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
            width: 512
        };

        // Generate QR code files
        await QRCode.toFile('./speakmate-apk-qr.png', apkUrl, options);
        logger.info('✅ QR Code updated: speakmate-apk-qr.png');

        const svgString = await QRCode.toString(apkUrl, { type: 'svg', width: 512 });
        fs.writeFileSync('./speakmate-apk-qr.svg', svgString);
        logger.info('✅ QR Code updated: speakmate-apk-qr.svg');

        // Update HTML file with new URL
        updateHtmlFile(apkUrl);

        logger.info('\n🎉 QR Code update complete!');
        logger.info('📋 Next steps:');
        logger.info('   1. Share speakmate-apk-qr.png');
        logger.info('   2. Or share download-speakmate.html');
        logger.info('   3. Users can scan QR code to download APK');

    } catch (error) {
        console.error('❌ Error generating QR code:', error);
    }
}

function updateHtmlFile(apkUrl) {
    try {
        const htmlFile = './download-speakmate.html';
        let htmlContent = fs.readFileSync(htmlFile, 'utf8');

        // Update the direct download link
        htmlContent = htmlContent.replace(
            /href="https:\/\/expo\.dev\/artifacts\/eas\/[^"]+"/g,
            `href="${apkUrl}"`
        );

        // Update the build date
        const today = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        htmlContent = htmlContent.replace(
            /Build: [^<]+/g,
            `Build: ${today}`
        );

        fs.writeFileSync(htmlFile, htmlContent);
        logger.info('✅ HTML file updated: download-speakmate.html');
    } catch (error) {
        logger.error('⚠️ Could not update HTML file:', {
            error: error.message
        });
    }
}

// Run the script
generateQRCodeFromLatestBuild();