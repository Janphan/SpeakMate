#!/usr/bin/env node

const QRCode = require('qrcode');
const fs = require('fs');

// Function to get latest build URL from EAS
async function getLatestBuildUrl() {
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);

    try {
        console.log('🔍 Fetching latest build information...');
        const { stdout } = await execPromise('npx eas build:list --limit 1 --non-interactive');

        // Extract APK URL from output
        const lines = stdout.split('\n');
        const urlLine = lines.find(line => line.includes('Application Archive URL'));

        if (urlLine && !urlLine.includes('null')) {
            const url = urlLine.split('Application Archive URL')[1].trim();
            console.log('✅ Found APK URL:', url);
            return url;
        } else {
            console.log('❌ No APK URL found in latest build');
            return null;
        }
    } catch (error) {
        console.error('❌ Error fetching build info:', error.message);
        return null;
    }
}

async function generateQRCodeFromLatestBuild() {
    try {
        const apkUrl = await getLatestBuildUrl();

        if (!apkUrl) {
            console.log('⚠️ No valid APK URL found. Using fallback URL...');
            // Fallback to current known URL
            apkUrl = 'https://expo.dev/artifacts/eas/bwy2PiPnDs4k5DXkXkoFiH.apk';
        }

        console.log('🎯 Generating QR Code for:', apkUrl);

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
        console.log('✅ QR Code updated: speakmate-apk-qr.png');

        const svgString = await QRCode.toString(apkUrl, { type: 'svg', width: 512 });
        fs.writeFileSync('./speakmate-apk-qr.svg', svgString);
        console.log('✅ QR Code updated: speakmate-apk-qr.svg');

        // Update HTML file with new URL
        updateHtmlFile(apkUrl);

        console.log('\n🎉 QR Code update complete!');
        console.log('📋 Next steps:');
        console.log('   1. Share speakmate-apk-qr.png');
        console.log('   2. Or share download-speakmate.html');
        console.log('   3. Users can scan QR code to download APK');

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
        console.log('✅ HTML file updated: download-speakmate.html');
    } catch (error) {
        console.log('⚠️ Could not update HTML file:', error.message);
    }
}

// Run the script
generateQRCodeFromLatestBuild();