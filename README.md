# SpeakMate

SpeakMate is a mobile app designed for IELTS learners aiming to improve their speaking proficiency, especially targeting Band 5–6. Built with React Native and integrated with Firebase for authentication, data storage, and progress tracking, SpeakMate leverages OpenAI Whisper for real-time speech recognition and natural language processing. The app transcribes user responses, provides transcripts, confidence scores, and timestamps, and analyzes fluency (speech rate, pauses) and pronunciation (clarity, intonation) according to IELTS band descriptors. SpeakMate offers live feedback, user progress tracking, and realistic conversation scenarios to support effective self-study.

## 🎥 Demo Video

[![SpeakMate Demo](https://img.youtube.com/vi/J_tCY55MraA/maxresdefault.jpg)](https://www.youtube.com/watch?v=J_tCY55MraA)

**Watch the full demo:** [https://www.youtube.com/watch?v=J_tCY55MraA](https://www.youtube.com/watch?v=J_tCY55MraA)

## 📱 Download APK

Ready to try SpeakMate? Download the latest APK:

[![Download APK](https://img.shields.io/badge/Download-APK-green?style=for-the-badge&logo=android)](https://expo.dev/artifacts/eas/acMwQsJ9WWfUDPP8pjaedn.apk)

**QR Code for mobile download:**

<img src="speakmate-apk-qr.png" alt="Download SpeakMate APK" width="200">

*Scan with your phone camera to download directly*

**Latest Build:** October 16, 2025 - Includes critical bug fixes and UI improvements

## Core Features:

✅ Voice Call with OpenAI (Two-way conversation with real-time responses)

✅ Speech-to-Text & Text-to-Speech (User speaks, AI understands & responds)

✅ Live Feedback on Fluency & Pronunciation
	- After each response, SpeakMate analyzes your speech using metrics like words per minute (WPM) and pause frequency.
	- Feedback is mapped to IELTS bands (5, 5.5, 6) and includes personalized advice to help you improve your fluency and pronunciation.
	- You receive instant feedback on your speaking rate, hesitations, and clarity, with actionable tips for progress.

## Prerequisites

- Node.js >= 20.19.4
- npm >= 10.7.0
- Expo SDK 54
- Expo Go app (latest version) on your mobile device

✅ Real-life Conversation Scenarios (Travel, Job Interview, Daily Chat, etc.)

✅ User Progress Tracking (Fluency score, mistake tracking)

## Getting Started

Follow these steps to clone the repository and run the app on a mobile device.

- git clone https://github.com/Janphan/SpeakMate.git
- cd SpeakMate
- npm install
- npx expo start
- Install the Expo Go App on your mobile device
- Open the App on Your Device:
- Scan the QR code shown in your terminal or in the Expo DevTools in your browser with your mobile device's camera (for iOS) or Expo Go app (for Android).
- The app should open in Expo Go, allowing you to test the application on your mobile device.

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