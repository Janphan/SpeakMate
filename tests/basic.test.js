// Simple test to verify Jest is working
describe('Basic Jest Test', () => {
    test('Jest is working correctly', () => {
        expect(2 + 2).toBe(4);
    });

    test('Firebase config exists', () => {
        const fs = require('fs');
        const path = require('path');

        // Check if firebase.json exists
        const firebaseConfigPath = path.join(__dirname, '..', 'firebase.json');
        expect(fs.existsSync(firebaseConfigPath)).toBe(true);
    });

    test('Firestore rules file exists', () => {
        const fs = require('fs');
        const path = require('path');

        // Check if firestore.rules exists
        const rulesPath = path.join(__dirname, '..', 'firebase', 'rules', 'firestore.rules');
        expect(fs.existsSync(rulesPath)).toBe(true);
    });
});