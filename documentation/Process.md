# Set up Firebase

- install firebase

- install react-native-dotenv to use .env

# Set up navigation between pages

- Install navigation stack/tab

- Homepage

- Sign in

- Sign up 

# Learnings

- Nested navigation

- Firebase authentication

## Set up OpenAI Whisper/ Set up Google STT and TTS API

## Speech To Text
### Whisper AI openAI
- FileSystem next not support Expo Go - not possible to test
- Try FileSystem to upload audio record from phone to API
URL: https://docs.expo.dev/versions/latest/sdk/filesystem/#uploadoptionsmultipart

### Audio File handling


## Dependencies

- Firebase

- react-native-paper

- react-native-navigation

- Google Speech-to-Text (STT) → Convert user speech to text

- Google Text-to-Speech (TTS) → Convert AI response to speech

- OpenAI API → Generate a response based on the user’s speech

- expo-speech: Google Text-to-Speech (Phone is not in silent mode)

- expo-av : Required for microphone/audio permissions

- @react-native-async-storage/async-storage 

- openai

- axios (to send the recorded audio to Google Cloud)

- expo-av (to record audio)

- react-native-dotenv

<!-- 
Consider free alternatives like: ✅ Google Gemini API (limited free access)
✅ Hugging Face Models (open-source LLMs)
✅ Local LLMs (like Llama 2, Whisper for STT) -->

## Resources

- https://github.com/Galaxies-dev/ai-voice-recorder