# SpeakMate

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)

SpeakMate is a mobile app designed for IELTS learners aiming to improve their speaking proficiency, especially targeting Band 5–6. Built with React Native and integrated with Firebase for authentication, data storage, and progress tracking, SpeakMate leverages OpenAI Whisper for real-time speech recognition and natural language processing. The app transcribes user responses, provides transcripts, confidence scores, and timestamps, and analyzes fluency (speech rate, pauses) and pronunciation (clarity, intonation) according to IELTS band descriptors. SpeakMate offers live feedback, user progress tracking, and realistic conversation scenarios to support effective self-study.

> **🎓 Academic Research:** This project was developed as a Bachelor's Thesis. Read the full paper: [**An AI-Driven Mobile App for IELTS Speaking**](https://www.theseus.fi/handle/10024/901588).

## 📚 Table of Contents

- [🎥 Demo Video](#-demo-video)
- [📱 Download APK](#-download-apk)
- [Core Features](#core-features)
- [📂 Project Structure](#-project-structure)
- [📊 Data Schema](#-data-schema)
- [Prerequisites](#prerequisites)
- [Project Status](#project-status)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Technology Stack](#technology-stack)
- [Usage Instructions](#usage-instructions)
- [Troubleshooting](#troubleshooting)
- [Environment Variables](#environment-variables-env)
- [License](#license)
- [Contributing](#contributing)

## 🎥 Demo Video

[![SpeakMate Demo](https://img.youtube.com/vi/J_tCY55MraA/maxresdefault.jpg)](https://www.youtube.com/watch?v=J_tCY55MraA)

**Watch the full demo:** [https://www.youtube.com/watch?v=J_tCY55MraA](https://www.youtube.com/watch?v=J_tCY55MraA)

## 📱 Download APK

Ready to try SpeakMate? Download the latest APK:

|                                                                          Download APK                                                                          |                              Scan to Install                              |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------: |
| [![Download APK](https://img.shields.io/badge/Download-APK-green?style=for-the-badge&logo=android)](https://expo.dev/artifacts/eas/iY7M9FrMP9mAsVXbv3YhCQ.apk) | <img src="speakmate-apk-qr.png" alt="Download SpeakMate APK" width="150"> |

_Scan with your phone camera to download directly_

**Latest Build:** October 19, 2025 - Includes streak calculation fixes and updated documentation

📋 **For detailed build instructions and APK generation, see [docs/BUILD_INSTRUCTIONS.md](docs/BUILD_INSTRUCTIONS.md)**

## Core Features:

✅ **IELTS Speaking Simulation (Part 1-2-3)** — Full test flow: Part 1 Q&A, Part 2 Cue Card with 60s preparation timer, Part 3 abstract discussion

✅ **Level-Aware Question Bank** — Questions organized by IELTS band (5-6, 6-7, 7-8) with increasing complexity and abstraction

✅ **Speech-to-Text & Text-to-Speech** — Powered by OpenAI Whisper for transcription; AI asks questions aloud via expo-speech

✅ **Live Feedback on Fluency & Pronunciation** — WPM, pause frequency, clarity score, and IELTS band mapping with personalized advice

✅ **Real-life Conversation Scenarios** — 9 topics covering Hometown, Technology, Health, Travel, Environment, Food, Family, Education, Media, Daily Routine, and Transportation

✅ **User Progress Tracking** — Session history, streak counting, detailed statistics per topic and band level

## 📂 Project Structure

<details>
<summary>Click to expand full file structure</summary>

```
SpeakMate/
├── 📱 App Core
│   ├── App.js                           # Main app entry point
│   ├── index.js                         # Root index file
│   └── app.json                         # Expo app configuration
│
├── 🎨 Source Code (src/)
│   ├── api/                             # Backend integrations
│   │   ├── AIService.js                 # Question fetching (level-aware, Part 1-2-3)
│   │   ├── initializeQuestions_ielts.js # IELTS question bank data (Part 1-2-3 structure)
│   │   ├── auth.js                      # Firebase authentication
│   │   ├── firebaseConfig.js            # Firebase configuration
│   │   ├── speechToText.js              # Speech recognition
│   │   └── whisperAI.js                 # Whisper AI integration
│   │
│   ├── components/                      # Reusable UI components
│   │   ├── layout/                      # Layout components
│   │   │   └── HeaderSection.jsx        # App header component
│   │   └── ui/                          # UI components (buttons, inputs, etc.)
│   │
│   ├── screens/                         # App screens organized by feature
│   │   ├── auth/                        # Authentication screens
│   │   │   ├── SignInScreen.jsx         # User login
│   │   │   ├── SignUpScreen.jsx         # User registration
│   │   │   ├── SignOutScreen.jsx        # User logout
│   │   │   └── ResetPasswordScreen.jsx  # Password recovery
│   │   ├── practice/                    # Practice & conversation screens
│   │   │   ├── DialogueScreen.jsx       # IELTS Part 1-2-3 conversation flow
│   │   │   ├── TopicList.jsx            # Topic selection
│   │   │   ├── VocabScreen.jsx          # Vocabulary practice
│   │   │   ├── CallsScreen.jsx          # Call history
│   │   │   ├── ConversationDetailsScreen.jsx # Conversation details
│   │   │   ├── Feedback.jsx             # AI feedback display
│   │   │   └── AIResponseDisplay.js     # AI response interface
│   │   ├── profile/                     # User profile & settings
│   │   │   ├── ProfileScreen.jsx        # User profile
│   │   │   ├── SettingsScreen.jsx       # App settings
│   │   │   └── StatisticsScreen.jsx     # Progress tracking
│   │   ├── legal/                       # Legal & policy screens
│   │   │   ├── PrivacyPolicyScreen.jsx  # Privacy policy
│   │   │   └── TermsOfServiceScreen.jsx # Terms of service
│   │   └── HomeScreen.jsx               # Main dashboard
│   │
│   ├── hooks/                           # Custom React hooks
│   │   └── useStatistics.js             # Statistics data hook
│   │
│   ├── theme/                           # Design system
│   │   ├── colors.js                    # Color palette
│   │   ├── typography.js                # Font styles
│   │   ├── spacing.js                   # Layout spacing
│   │   └── index.js                     # Theme exports
│   │
│   ├── utils/                           # Utility functions
│   │   ├── logger.js                    # Logging system
│   │   ├── responsive.js                # Responsive design helpers
│   │   ├── speechAnalysis.js            # Speech analysis algorithms
│   │   └── TabNavigator.jsx             # Navigation configuration
│   │
│   └── services/                        # Business logic services
│
├── 🔥 Firebase Configuration (firebase/)
│   ├── config/                          # Firebase settings
│   │   ├── firestore.indexes.json       # Database indexes
│   │   └── speakmate-*-adminsdk-*.json  # Service account key
│   ├── rules/                           # Security rules
│   │   └── firestore.rules              # Firestore access rules
│   ├── scripts/                         # Firebase utilities
│   │   ├── simple-rules-test.js         # Rules testing
│   │   ├── init_question_banks_admin.js # Question bank setup
│   │   ├── init_all_question_banks_admin.js # All questions setup
│   │   └── init_ielts_questions_admin.js # IELTS Part 1-2-3 question banks
│   └── README.md                        # Firebase documentation
│
├── 🧪 Testing (tests/)
│   └── basic.test.js                    # Basic Jest tests
│
├── 📜 Scripts (scripts/)
│   ├── generate-qr.js                   # QR code generation
│   └── update-qr.js                     # QR code updates
│
├── 🎯 Assets & Data
│   └── assets/                          # Static assets
│       └── words.json                   # Vocabulary data
│
├── ⚙️ Configuration Files
│   ├── config/                          # Configuration folder
│   │   ├── babel.config.js              # Babel configuration
│   │   ├── metro.config.js              # Metro bundler config
│   │   ├── eslint.config.js             # ESLint rules
│   │   ├── .eslintrc.json               # ESLint JSON config
│   │   └── .prettierrc                  # Prettier formatting
│   ├── firebase.json                    # Firebase project config
│   ├── eas.json                         # Expo Application Services
│   ├── package.json                     # Dependencies & scripts
│   └── .gitignore                       # Git ignore rules
│
└── 📋 Documentation (docs/)
    ├── README.md                        # Main project documentation
    ├── BUILD_INSTRUCTIONS.md            # Build & deployment guide
    ├── JAVA_SETUP_GUIDE.md             # Java environment setup
    ├── Process.md                       # Development process
    └── LICENSE                          # Project license
```

</details>

### 🏗️ Architecture Overview

- **Frontend:** React Native with Expo managed workflow
- **Backend Services:** Firebase (Auth, Firestore, Cloud Functions)
- **AI Integration:** OpenAI Whisper for speech recognition, GPT for conversations
- **State Management:** React hooks and context
- **Navigation:** React Navigation v7
- **Testing:** Jest for unit tests, Firebase emulators for integration tests
- **Deployment:** Expo Application Services (EAS) for mobile builds

## 📊 Data Schema

### Firebase Firestore Collections

<details>
<summary>Click to expand database schema</summary>

#### 🔐 Users Collection (`users`)

```javascript
{
  uid: "string",           // Firebase Auth UID
  email: "string",         // User email
  displayName: "string",   // User display name
  createdAt: "timestamp",  // Account creation time
  lastLoginAt: "timestamp",// Last login time
  settings: {
    notifications: "boolean",
    darkMode: "boolean",
    speechSpeed: "number"   // TTS speech speed
  }
}
```

#### 💬 Conversations Collection (`conversations`)

```javascript
{
  id: "string",            // Auto-generated conversation ID
  userId: "string",        // Reference to user UID
  topic: "string",         // Conversation topic (e.g., "Travel", "Job Interview")
  startTime: "timestamp",  // Conversation start time
  endTime: "timestamp",    // Conversation end time
  duration: "number",      // Duration in seconds
  status: "completed|ongoing|paused",
  totalWords: "number",    // Total words spoken by user
  averageBand: "number",   // Average IELTS band score
  exchanges: [             // Array of conversation exchanges
    {
      userText: "string",      // User's transcribed speech
      aiResponse: "string",    // AI's response
      timestamp: "timestamp",  // Exchange timestamp
      fluencyScore: "number",  // Fluency score (0-10)
      pronunciationScore: "number", // Pronunciation score (0-10)
      bandLevel: "string",     // IELTS band (e.g., "Band 5.5")
      wordCount: "number",     // Words in user response
      pauseCount: "number",    // Number of pauses detected
      speechRate: "number"     // Words per minute
    }
  ],
  feedback: {
    overallBand: "string",     // Overall IELTS band
    fluencyFeedback: "string", // Fluency improvement tips
    pronunciationFeedback: "string", // Pronunciation tips
    suggestions: ["string"]    // Array of improvement suggestions
  }
}
```

#### ❓ Questions Collection (`questions`)

Documents are keyed by `${topic}_${level}` (e.g., `Hometown_&_Accommodation_Band_6-7`).

```javascript
{
  topic: "string",         // Question category/topic
  level: "string",         // Target IELTS level (e.g., "Band 5-6")
  part1: ["string"],       // Part 1: Familiar topic questions (personal/factual)
  part2: [                 // Part 2: Cue cards with prompts
    {
      cueCard: "string",       // The main topic to speak about
      prompts: ["string"]      // Bullet points to guide the answer
    }
  ],
  part3: ["string"],       // Part 3: Abstract discussion questions
  createdAt: "timestamp"   // Creation timestamp
}
```

#### 📈 User Statistics Collection (`userStats`)

```javascript
{
  userId: "string",        // Reference to user UID
  totalSessions: "number", // Total conversation sessions
  totalTime: "number",     // Total practice time (seconds)
  streakDays: "number",    // Current daily streak
  lastPracticeDate: "timestamp", // Last practice session
  averageBand: "number",   // Overall average IELTS band
  totalWordsSpoken: "number", // Lifetime word count
  topicStats: {            // Performance by topic
    "Travel": {
      sessions: "number",
      averageBand: "number",
      totalTime: "number"
    },
    "Job Interview": {
      sessions: "number",
      averageBand: "number",
      totalTime: "number"
    }
    // ... other topics
  },
  monthlyProgress: [       // Monthly performance tracking
    {
      month: "string",       // Format: "2025-01"
      sessions: "number",
      averageBand: "number",
      totalTime: "number"
    }
  ]
}
```

#### 📝 Vocabulary Collection (`vocabulary`) - Static Data

```javascript
{
  id: "number",            // Word ID
  word: "string",          // The vocabulary word
  definition: "string",    // Word definition
  example: "string",       // Example sentence
  topic: "string",         // Category (e.g., "Academic", "Business")
  level: "string",         // IELTS band level (e.g., "Band 6")
  phonetic: "string",      // Phonetic pronunciation (optional)
  synonyms: ["string"],    // Array of synonyms (optional)
  partOfSpeech: "string"   // noun, verb, adjective, etc.
}
```

</details>

### Data Flow

1. **User Authentication** → Creates/updates `users` collection
2. **Practice Session** → Creates `conversations` document with real-time exchanges
3. **Session Completion** → Updates `userStats` with aggregated data
4. **Progress Tracking** → Queries `conversations` and `userStats` for analytics
5. **Question Selection** → Retrieves from `questions` collection by topic + level (combined document ID)
6. **IELTS Part Flow** → Part 1 (5 familiar questions) → Part 2 (cue card + 60s prep timer) → Part 3 (abstract discussion)

## Prerequisites

- Node.js >= 20.15.1
- npm >= 10.7.0
- Expo SDK 56
- **For physical device:** Expo Go app (latest version) on your mobile device
- **For Android emulator:** Android Studio with AVD Manager set up
- **For iOS simulator (macOS only):** Xcode 16+

## Project Status

🎯 **Current Version:** 1.0.0  
🚀 **Status:** Production Ready  
📱 **Platform:** Android (iOS compatible)  
🔧 **Architecture:** React Native + Expo Managed Workflow

## Getting Started

Follow these steps to clone the repository and run the app on a mobile device.

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Janphan/SpeakMate.git
   cd SpeakMate
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **🔥 Firebase Setup (Required):**
   ⚠️ **Important:** Set up Firebase before starting the app to avoid crashes.

   - **See [firebase/README.md](firebase/README.md)** for complete Firebase setup instructions
   - **Quick setup (basic questions):**
     ```bash
     # After setting up Firebase project and downloading service account key
     npm run init-questions /path/to/your/serviceAccountKey.json
     ```
   - **IELTS Part 1-2-3 question banks (recommended):**
     ```bash
     npm run init-questions:ielts /path/to/your/serviceAccountKey.json
     ```

   This ensures:

   - ✅ Questions are initialized with admin privileges
   - ✅ Level-aware questions (Band 5-6, 6-7, 7-8) with Part 1-2-3 structure
   - ✅ Proper Firebase security rules are in place
   - ✅ Users can access questions after authentication
   - ✅ No permission errors during app usage

4. **Start the development server:**

   ```bash
   npx expo start
   ```

5. **Open the App on an Emulator or Physical Device:**

   ### 📱 On a Physical Device (Expo Go)
   - Install the **Expo Go** app on your mobile device
   - Scan the QR code shown in your terminal or in the Expo DevTools in your browser with your mobile device's camera (iOS) or Expo Go app (Android)

   ### 🤖 On an Android Emulator
   - Open **Android Studio** → **Virtual Device Manager** and start an emulator
   - With the emulator running, press **`a`** in the Expo terminal (or run `npx expo start --android`)
   - The app will install and launch automatically on the emulator

   ### 🍎 On an iOS Simulator (macOS only)
   - Open **Xcode** → **Settings** → **Platforms** and ensure iOS simulator tools are installed
   - Press **`i`** in the Expo terminal (or run `npx expo start --ios`)
   - The app will install and launch automatically on the simulator

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run qr` - Generate QR code for APK download
- `npm run qr-update` - Update QR code with latest build
- `npm run check-usage` - Check OpenAI API usage
- `npm run init-questions` - Initialize basic Firebase question banks (requires service account key)
- `npm run init-questions:help` - Show help for question bank initialization
- `npm run init-questions:ielts` - Initialize IELTS Part 1-2-3 question banks across 9 topics × 3 levels
- `npm run init-questions:ielts:help` - Show help for IELTS bank initialization

## Technology Stack

### Frontend:

- React Native: Cross-platform mobile app development for iOS and Android
- React Navigation: Stack and tab navigation
- expo-speech: Text-to-speech functionality
- expo-av: Audio recording and playback
- expo-file-system: File management
- expo-auth-session: Authentication flows
- expo-image-picker: Image selection (if used)
- expo-status-bar, expo-web-browser: UI enhancements

### Backend:

- Firebase Authentication: User login and registration
- Firebase Firestore: Persistent data storage and progress tracking

### AI & Speech:

- OpenAI Whisper: Real-time speech-to-text and NLP

### UI and Icons:

- React Native Components and Styling
- Custom styles and icon libraries

## Usage Instructions

1. **Select IELTS Level** on the Home screen (Band 5-6, 6-7, or 7-8).
2. **Choose a topic** (Hometown, Technology, Health, Travel, etc.).
3. **Part 1 (4-5 min):** Answer 5 familiar questions about yourself. Tap the microphone to respond to each.
4. **Part 2 (3-4 min):** A cue card appears with a topic and bullet prompts. Use the 60-second timer to prepare, then speak for 1-2 minutes.
5. **Part 3 (4-5 min):** Discuss 4-5 abstract questions related to the topic in depth.
6. **View Feedback:** After completing all parts, review your WPM, clarity score, IELTS band, and personalized improvement tips.
7. **Track Progress:** Review your session history and statistics in the Calls and Progress tabs.

## Troubleshooting

- **Expo SDK Compatibility:** Ensure you are using Expo SDK 56 and the required Node.js version.
- **Microphone Permissions:** Grant microphone access when prompted. If speech recognition fails, check device permissions.
- **API Keys:** Make sure your OpenAI and Firebase credentials are set up in your environment files.
- **Audio Issues:** If audio recording or playback fails, update Expo Go and check device compatibility.

## Environment Variables (.env)

Create a `.env` file in your project root with the following variables:

```
OPENAI_API_KEY=your_openai_api_key
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
GOOGLE_API_KEY=your_google_api_key
EXPO_CLIENT_ID=your_expo_client_id
ANDROID_CLIENT_ID=your_android_client_id
IOS_CLIENT_ID=your_ios_client_id
WEB_CLIENT_ID=your_web_client_id
```

Replace each value with your actual credentials. These are required for OpenAI Whisper, Firebase, and Google authentication features to work correctly.

> ⚠️ **Security Warning:** Never commit your `.env` file to GitHub. Ensure it is listed in your `.gitignore` file to protect your API keys.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch for your feature or fix
3. Submit a pull request with a clear description of your changes
