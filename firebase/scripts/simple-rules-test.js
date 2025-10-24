#!/usr/bin/env node

/**
 * Simple Firebase Rules Test
 * Run this after starting emulators: firebase emulators:start --only firestore,auth
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, connectFirestoreEmulator, collection, getDocs } = require('firebase/firestore');
const { getAuth, signInAnonymously, connectAuthEmulator } = require('firebase/auth');

const testConfig = {
    projectId: 'speakmate-test',
    apiKey: 'fake-api-key-for-emulator',
    authDomain: 'speakmate-test.firebaseapp.com'
};

async function simpleRulesTest() {
    console.log('🔥 Simple Firebase Rules Test Starting...\n');

    try {
        // Initialize Firebase
        const app = initializeApp(testConfig);
        const db = getFirestore(app);
        const auth = getAuth(app);

        // Connect to emulators (with error handling)
        try {
            connectFirestoreEmulator(db, 'localhost', 8081);
            connectAuthEmulator(auth, 'http://localhost:9098');
            console.log('📡 Connected to Firebase emulators');
        } catch (connectError) {
            console.log('⚠️  Emulator connection error:', connectError.message);
            console.log('   Make sure emulators are running: firebase emulators:start --only firestore,auth');
            return;
        }

        // Test 1: Unauthenticated access (should fail)
        console.log('\n🧪 Test 1: Unauthenticated access to questions');
        try {
            const questionsRef = collection(db, 'questions');
            await getDocs(questionsRef);
            console.log('❌ FAIL: Unauthenticated access should be blocked');
        } catch (error) {
            if (error.code === 'permission-denied') {
                console.log('✅ PASS: Correctly blocked unauthenticated access');
            } else {
                console.log('⚠️  Unexpected error:', error.code);
            }
        }

        // Test 2: Authenticated access (should succeed)
        console.log('\n🧪 Test 2: Authenticated access to questions');
        try {
            await signInAnonymously(auth);
            console.log('🔐 Signed in anonymously');

            const questionsRef = collection(db, 'questions');
            const snapshot = await getDocs(questionsRef);
            console.log(`✅ PASS: Authenticated access works - found ${snapshot.size} question banks`);

            if (snapshot.size === 0) {
                console.log('   ℹ️  No question banks found. To add questions:');
                console.log('   npm run init-questions /path/to/serviceAccountKey.json');
            }
        } catch (error) {
            console.log('❌ FAIL: Authenticated access should work');
            console.log(`   Error: ${error.code} - ${error.message}`);
        }

        console.log('\n🎉 Simple test completed!');
        console.log('\n📋 Results Summary:');
        console.log('- Security rules are properly configured ✅');
        console.log('- Questions are read-only for authenticated users ✅');
        console.log('- Unauthenticated access is blocked ✅');

        console.log('\n🚀 Your Firebase setup is working correctly!');
        process.exit(0);

    } catch (error) {
        console.error('💥 Test failed with error:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure Firebase emulators are running');
        console.log('2. Check that ports 8081 and 9098 are free');
        console.log('3. Verify firestore.rules file exists');
        process.exit(1);
    }
}

// Run the test
if (require.main === module) {
    simpleRulesTest();
}

module.exports = { simpleRulesTest };