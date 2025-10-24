# Firebase Configuration

This folder contains all Firebase-related configuration, rules, and scripts for the SpeakMate project.

## 📁 Folder Structure

```
firebase/
├── config/
│   ├── firestore.indexes.json           # Firestore database indexes
│   └── speakmate-*-firebase-adminsdk-*.json  # Service account key (gitignored)
├── rules/
│   └── firestore.rules                  # Firestore security rules
└── scripts/
    ├── simple-rules-test.js             # Firebase rules testing script
    ├── init_question_banks_admin.js     # Initialize question banks
    └── init_all_question_banks_admin.js # Initialize all question banks
```

## 🚀 Quick Commands

### Testing Firebase Rules
```bash
# Start Firebase emulators
npm run emulators:start

# Test Firebase security rules
npm run test:rules
```

### Initialize Question Banks
```bash
# Add question banks to Firestore
npm run init-questions /path/to/serviceAccountKey.json
```

### Deploy Rules to Production
```bash
# Deploy security rules
firebase deploy --only firestore:rules

# Deploy indexes
firebase deploy --only firestore:indexes
```

## 📋 Configuration Files

- **`firestore.rules`** - Security rules defining access control for Firestore collections
- **`firestore.indexes.json`** - Database indexes for query optimization
- **Service Account Key** - Admin credentials for initializing data (keep secure!)

## 🧪 Testing

The `simple-rules-test.js` script tests:
- ✅ Unauthenticated access is blocked
- ✅ Authenticated users can read questions
- ✅ Users can only access their own conversation data
- ✅ Security rules work as expected

## 🔒 Security

- Service account keys are automatically gitignored
- Rules ensure users can only access their own data
- Questions are read-only for app users
- Admin scripts require service account authentication