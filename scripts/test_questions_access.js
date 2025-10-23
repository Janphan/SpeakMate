/*
Test script to verify that questions are properly accessible from the client side
after running the admin initialization.

This script simulates how the client app would access questions.
Run this after setting up the Firebase security rules and running the admin initialization.

Usage:
  node scripts/test_questions_access.js
*/

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, connectFirestoreEmulator } = require('firebase/firestore');

// You'll need to replace these with your actual Firebase config values
const firebaseConfig = {
    // Add your Firebase config here for testing
    // Note: This is just for testing - in production, these come from environment variables
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

async function testQuestionsAccess() {
    try {
        console.log('🔬 Testing Firebase questions access...');

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // Uncomment the line below if testing with Firebase emulator
        // connectFirestoreEmulator(db, 'localhost', 8080);

        console.log('📡 Attempting to fetch questions collection...');

        // Try to get questions (this should work with proper security rules)
        const questionsRef = collection(db, 'questions');
        const snapshot = await getDocs(questionsRef);

        if (snapshot.empty) {
            console.log('⚠️  Questions collection is empty. Make sure you ran the admin initialization script.');
            return;
        }

        console.log(`✅ Successfully accessed questions collection!`);
        console.log(`📊 Found ${snapshot.size} question banks`);

        // Display summary of what was found
        const topics = new Set();
        const levels = new Set();
        let totalQuestions = 0;

        snapshot.forEach(doc => {
            const data = doc.data();
            topics.add(data.topic);
            levels.add(data.level);
            totalQuestions += data.questions?.length || 0;
            console.log(`   📝 ${doc.id}: ${data.questions?.length || 0} questions`);
        });

        console.log(`\n📈 Summary:`);
        console.log(`   Topics: ${topics.size}`);
        console.log(`   Levels: ${levels.size}`);
        console.log(`   Total Questions: ${totalQuestions}`);
        console.log(`\n🎉 Test completed successfully!`);

    } catch (error) {
        console.error('❌ Test failed:', error.message);

        if (error.code === 'permission-denied') {
            console.log('\n🔧 Troubleshooting tips:');
            console.log('1. Make sure you updated your Firebase security rules');
            console.log('2. Ensure you have a valid authentication token (this test runs without auth)');
            console.log('3. Verify the admin script ran successfully');
        }
    }
}

// Only run if this file is executed directly
if (require.main === module) {
    console.log('⚠️  Note: This test runs without authentication.');
    console.log('   If your security rules require authentication, this test will fail.');
    console.log('   This is expected behavior for properly secured rules.\n');

    testQuestionsAccess();
}

module.exports = { testQuestionsAccess };