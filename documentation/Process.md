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

- Styling:
+ Icon usage
+ Handling tabs and slack at the same time
+ Use some new props: headerShown, headerRight, headerTitle to adjust to show/not to show tab names etc to control the visibility of tab names or titles within a header

- Add Scenarios: Create predefined prompts for different conversation scenarios.

- Set up Firebase Database

## Expo update version leading to new challenge in fixing bug
In React Native projects, the Metro bundler is responsible for resolving and bundling JavaScript modules. However, with the introduction of the exports field in package.json by modern JavaScript libraries, compatibility issues can arise. Specifically, some libraries or configurations may not fully support Metro's handling of the exports field, leading to runtime errors such as: 
[runtime not ready]: Error: Component auth has not been registered yet, js engine: hermes
to address this issue, a workaround involves disabling package.json:exports in the Metro configuration:
config.resolver.unstable_enablePackageExports = false;
Relevance to Thesis
This challenge underscores the evolving complexity of JavaScript module resolution in cross-platform frameworks like React Native. It highlights the need for:

Improved compatibility between Metro and modern JavaScript standards.
Better documentation and tooling to help developers debug and resolve such issues.
Awareness of trade-offs when applying workarounds in real-world projects.
By addressing this challenge in your thesis, you can emphasize the importance of balancing modern JavaScript practices with the constraints of existing tools and frameworks.

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

- Signin with Google: Set up OAuth,  Accessed blocked denied etc. The "Access blocked" error when using Google Sign-In typically occurs due to misconfiguration in your Google API credentials or the OAuth consent screen
 + Platform-Specific Configurations: iOS and Android require additional setup (e.g., google-services.json for Android, GoogleService-Info.plist for iOS).

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

- react-navigation/bottom-tabs

- npm install expo-image-picker


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

- Expo Build : https://docs.expo.dev/build/introduction/

- Expo update https://github.com/expo/expo/discussions/36551 fix bug sollution