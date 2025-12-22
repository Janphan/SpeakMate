# SpeakMate

SpeakMate is a mobile app designed for IELTS learners aiming to improve their speaking proficiency, especially targeting Band 5–6. Built with React Native and integrated with Firebase for authentication, data storage, and progress tracking, SpeakMate leverages OpenAI Whisper for real-time speech recognition and natural language processing. The app transcribes user responses, provides transcripts, confidence scores, and timestamps, and analyzes fluency (speech rate, pauses) and pronunciation (clarity, intonation) according to IELTS band descriptors. SpeakMate offers live feedback, user progress tracking, and realistic conversation scenarios to support effective self-study.

## 📖 Thesis

For more details about this project, refer to the thesis: [https://www.theseus.fi/handle/10024/901588](https://www.theseus.fi/handle/10024/901588)

## 🎥 Demo Video

[![SpeakMate Demo](https://img.youtube.com/vi/J_tCY55MraA/maxresdefault.jpg)](https://www.youtube.com/watch?v=J_tCY55MraA)

**Watch the full demo:** [https://www.youtube.com/watch?v=J_tCY55MraA](https://www.youtube.com/watch?v=J_tCY55MraA)

## 📱 Download APK

Ready to try SpeakMate? Download the latest APK:

[![Download APK](https://img.shields.io/badge/Download-APK-green?style=for-the-badge&logo=android)](https://expo.dev/artifacts/eas/iY7M9FrMP9mAsVXbv3YhCQ.apk)

**QR Code for mobile download:**

<img src="speakmate-apk-qr.png" alt="Download SpeakMate APK" width="200">

_Scan with your phone camera to download directly_

**Latest Build:** October 19, 2025 - Includes streak calculation fixes and updated documentation

📋 **For detailed build instructions and APK generation, see [docs/BUILD_INSTRUCTIONS.md](docs/BUILD_INSTRUCTIONS.md)**

## Core Features:

✅ Voice Call with OpenAI (Two-way conversation with real-time responses)

✅ Speech-to-Text & Text-to-Speech (User speaks, AI understands & responds)

✅ Live Feedback on Fluency & Pronunciation - After each response, SpeakMate analyzes your speech using metrics like words per minute (WPM) and pause frequency. - Feedback is mapped to IELTS bands (5, 5.5, 6) and includes personalized advice to help you improve your fluency and pronunciation. - You receive instant feedback on your speaking rate, hesitations, and clarity, with actionable tips for progress.

✅ Real-life Conversation Scenarios (Travel, Job Interview, Daily Chat, etc.)

✅ User Progress Tracking (Fluency score, streak counting, session statistics)

## 📂 Project Structure

```
SpeakMate/
├── 📱 App Core
│   ├── App.js                           # Main app entry point
│   ├── index.js                         # Root index file
│   └── app.json                         # Expo app configuration
│
├── 🎨 Source Code (src/)
│   ├── api/                             # Backend integrations
│   │   ├── AIService.js                 # OpenAI API integration
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
│   │   │   ├── DialogueScreen.jsx       # Conversation interface
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
│   │   └── init_all_question_banks_admin.js # All questions setup
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

### 🏗️ Architecture Overview

- **Frontend:** React Native with Expo managed workflow
- **Backend Services:** Firebase (Auth, Firestore, Cloud Functions)
- **AI Integration:** OpenAI Whisper for speech recognition, GPT for conversations
- **State Management:** React hooks and context
- **Navigation:** React Navigation v7
- **Testing:** Jest for unit tests, Firebase emulators for integration tests
- **Deployment:** Expo Application Services (EAS) for mobile builds

## Prerequisites

- Node.js >= 20.15.1
- npm >= 10.7.0
- Expo SDK 54
- Expo Go app (latest version) on your mobile device

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

3. **Start the development server:**

   ```bash
   npx expo start
   ```

4. **Install the Expo Go App** on your mobile device

5. **Open the App on Your Device:**
   - Scan the QR code shown in your terminal or in the Expo DevTools in your browser with your mobile device's camera (for iOS) or Expo Go app (for Android).
   - The app should open in Expo Go, allowing you to test the application on your mobile device.

### 🔥 Firebase Setup (Required)

⚠️ **Important:** Before running the app, you need to set up Firebase and initialize the question banks.

1. **Set up Firebase security rules** and **initialize question banks** using the admin script
2. **See [firebase/README.md](firebase/README.md)** for complete Firebase setup instructions

**Quick setup:**

```bash
# After setting up Firebase project and downloading service account key
npm run init-questions /path/to/your/serviceAccountKey.json
```

This setup ensures:

- ✅ Questions are securely initialized with admin privileges
- ✅ Proper Firebase security rules are in place
- ✅ Users can access questions after authentication
- ✅ No permission errors during app usage

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run qr` - Generate QR code for APK download
- `npm run qr-update` - Update QR code with latest build
- `npm run check-usage` - Check OpenAI API usage
- `npm run init-questions` - Initialize Firebase question banks (requires service account key)
- `npm run init-questions:help` - Show help for question bank initialization

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

1. Select a conversation scenario (e.g., Travel, Job Interview).
2. Tap the microphone to start speaking. Your speech is transcribed and analyzed in real time.
3. View instant feedback on your fluency and pronunciation after each response.
4. Review your conversation history and progress in the app. (Under development)
5. Use the feedback and tips to improve your speaking skills and aim for higher IELTS bands.

## Troubleshooting

- **Expo SDK Compatibility:** Ensure you are using Expo SDK 54 and the required Node.js version.
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

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch for your feature or fix
3. Submit a pull request with a clear description of your changes
