# Set up Firebase

- install firebase

- install react-native-dotenv to use .env

# Set up navigation between pages

- Install navigation stack/tab

- Homepage

- Sign in

- Sign up 

# Learnings and Difficulties

- Nested navigation

- Firebase authentication

- Research and testing with react-native-voice. This requires a lot of setting up and customization, not suitable for beginner -> research to expo-speech

- Research, set up and testing with whisper, gg stt, gg tts. Difficult in testing if api gg stt/gg tts works, new env

- Prototype in both whisper and gg api for stt service => conclusion: choose whisper stt and gg api tts. reasons: comparisions (prices, speed, accuracy, support, easy to implement)

- Set up ai service (whisper stt), google response

- Set up Credentials for Expo (client id) Create OAuth 2.0 Client IDs for iOS and Android

- Continue with the ideas of having the english tutor. AI voices seems to be too "robotic"

- Need to figure out what is a good prompt


## Set up OpenAI Whisper/ Set up Google STT and TTS API

## Speech To Text
### Whisper AI openAI
- FileSystem next not support Expo Go - not possible to test
- Try FileSystem to upload audio record from phone to API (1)
URL: https://docs.expo.dev/versions/latest/sdk/filesystem/#uploadoptionsmultipart

### Audio File handling

- Handle local file in device (file record stored in phone, have difficulties to upload to openAi, handle uri)

- Handle uploading local audio record (expo av) to ai service (format and form, type m4a, wav, etc) (as in 1), FormData handling

### Multi platforms testing

- Prebuild and testing log in by google account with Iphone/samsung.

- Set up OAuth,  Accessed blocked denied etc

## Dependencies

- Firebase: NOTE_COLLECTION;

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

- sonner-native : display toast notifications within your mobile applications

- npx expo install expo-auth-session expo-google-auth-session


<!-- 
Consider free alternatives like: ✅ Google Gemini API (limited free access)
✅ Hugging Face Models (open-source LLMs)
✅ Local LLMs (like Llama 2, Whisper for STT) -->

## Resources

- https://github.com/Galaxies-dev/ai-voice-recorder

- https://docs.expo.dev/versions/latest/sdk/filesystem/#uploadoptionsmultipart

- Ytb: https://www.youtube.com/watch?v=86iUP4fwl8c

- OpenAI Whisper: https://platform.openai.com/docs/api-reference/realtime-server-events/response/done

- Material Design Icon : https://pictogrammers.github.io/@mdi/font/6.5.95/