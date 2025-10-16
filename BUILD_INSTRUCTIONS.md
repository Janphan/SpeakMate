# SpeakMate APK Build Instructions

## 🎉 **Build Status: SUCCESS**

**Last Successful Build**: October 16, 2025  
**APK Download**: https://expo.dev/artifacts/eas/acMwQsJ9WWfUDPP8pjaedn.apk  
**Build ID**: 4a877d41-be27-4c09-8738-352144349fc9

---

## 📋 **Quick Build Guide**

### Prerequisites
- Node.js 20.15.1+ (required for Metro and React Native)
- Expo CLI and EAS CLI
- Git for version control
- Internet connection for EAS Build

### Fast Build Command
```bash
# Navigate to project directory
cd SpeakMate

# Check project health
npx expo-doctor

# Build APK (managed workflow)
npx eas build --platform android --profile production-apk --clear-cache
```

---

## 🔧 **Detailed Setup Instructions**

### 1. Environment Setup

#### Install Required Tools
```bash
# Install Node.js (v20.15.1 or higher)
# Download from: https://nodejs.org/

# Install Expo CLI globally
npm install -g @expo/cli

# Install EAS CLI globally
npm install -g eas-cli

# Verify installations
node --version
npm --version
npx expo --version
npx eas --version
```

#### Clone and Install Dependencies
```bash
# Clone the repository
git clone https://github.com/Janphan/SpeakMate.git
cd SpeakMate

# Install dependencies
npm install

# Verify project health
npx expo-doctor
```

### 2. Environment Variables Configuration

#### Create Local Environment File
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your API keys
nano .env
```

#### Required Environment Variables
```env
# OpenAI Configuration (Required)
OPENAI_API_KEY=your_openai_api_key_here

# Firebase Configuration (Required)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your_project.firebasedatabase.app
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### Upload Environment Variables to EAS
```bash
# Upload all environment variables to EAS servers
npx eas env:push --environment production

# Verify environment variables
npx eas env:list --environment production
```

### 3. EAS Build Configuration

#### Initialize EAS Build
```bash
# Configure EAS Build (if not already done)
npx eas build:configure

# This creates/updates eas.json with build profiles
```

#### Verify eas.json Configuration
```json
{
  "cli": {
    "version": ">= 16.20.4",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "preview-apk": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    },
    "production-apk": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

---

## 🚀 **Building the APK**

### Option 1: Production APK (Recommended)
```bash
npx eas build --platform android --profile production-apk --clear-cache
```

### Option 2: Preview APK (For Testing)
```bash
npx eas build --platform android --profile preview-apk --clear-cache
```

### Build Monitoring
- Build logs: Check the URL provided in terminal output
- Typical build time: 10-15 minutes
- Download link will be provided upon successful completion

---

## 📱 **Installing on Android Device**

### QR Code Download (Recommended!)
📱 **Quick Download**: Scan the QR code with your phone camera
- **QR Code Image**: `speakmate-apk-qr.png` (in project root)
- **Download Page**: Open `download-speakmate.html` in browser
- **Generate QR**: Run `npm run qr` or `node generate-qr.js`

### Method 1: QR Code (Easiest)
1. **Open** `download-speakmate.html` in browser or share `speakmate-apk-qr.png`
2. **Scan QR code** with phone camera
3. **Download** APK automatically
4. **Install** when download completes

### Method 2: Direct Download
1. **Get APK URL** from successful build output
2. **Open browser** on Android device
3. **Navigate to APK URL**: https://expo.dev/artifacts/eas/acMwQsJ9WWfUDPP8pjaedn.apk
4. **Download and install** the APK
5. **Enable "Install from Unknown Sources"** if prompted

### Method 3: Via Expo Dashboard
1. **Visit**: https://expo.dev/accounts/janphan/projects/SpeakMate
2. **Go to Builds** tab
3. **Find latest successful build**
4. **Download APK** link

### Method 4: Send to Phone
1. **Copy APK URL** from build output
2. **Send to phone** via email/messaging
3. **Open link** on phone to download

---

## 🛠️ **Troubleshooting Guide**

### Common Issues and Solutions

#### Issue: Gradle Build Failed
**Solution**: Use managed workflow (remove android/ios folders)
```bash
# Remove native folders
rm -rf android ios

# Ensure .gitignore includes:
android/
ios/

# Rebuild with managed workflow
npx eas build --platform android --profile production-apk --clear-cache
```

#### Issue: Dependency Conflicts
**Solution**: Check and fix with expo-doctor
```bash
# Check for issues
npx expo-doctor

# Fix version mismatches
npx expo install --check

# Remove problematic dependencies if needed
npm uninstall react-native-reanimated react-native-worklets react-native-svg sonner-native
```

#### Issue: Environment Variables Not Loaded
**Solution**: Verify EAS environment configuration
```bash
# List current environment variables
npx eas env:list --environment production

# Re-upload if missing
npx eas env:push --environment production
```

#### Issue: Node.js Version Compatibility
**Symptoms**: Engine warnings during npm install
**Solution**: Update Node.js
```bash
# Check current version
node --version

# Should be 20.15.1 or higher
# Download latest from: https://nodejs.org/
```

#### Issue: App Configuration Conflicts
**Solution**: Clean app.json for managed workflow
```json
{
  "expo": {
    "name": "SpeakMate",
    "slug": "SpeakMate",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": false,
    "android": {
      "package": "com.janphan.SpeakMate"
    },
    "extra": {
      "eas": {
        "projectId": "7ded96a7-017a-4726-913e-3b56e2f5637d"
      }
    }
  }
}
```

### Build Optimization Tips

#### 1. Use Managed Workflow
- Remove android/ and ios/ folders
- Let EAS handle native code generation
- Reduces build complexity and errors

#### 2. Minimal Dependencies
- Keep only essential dependencies
- Remove complex animation libraries if not needed
- Use stable, well-maintained packages

#### 3. Environment Management
- Always use EAS environment variables for production
- Never commit API keys to git
- Verify environment variables before building

#### 4. Cache Management
- Use --clear-cache for problematic builds
- Clear local caches: `npx expo start --clear`
- Clean install: `rm -rf node_modules && npm install`

---

## 📊 **Project Structure**

### Key Files
```
SpeakMate/
├── app.json              # Expo configuration
├── eas.json              # EAS Build configuration
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables (local)
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── App.js                # Main application component
├── src/                  # Source code
│   ├── api/              # API services (OpenAI, Firebase)
│   ├── screens/          # App screens/components
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Utility functions
└── assets/               # App assets (icons, images)
```

### Critical Dependencies
```json
{
  "expo": "54.0.13",
  "react": "19.1.0",
  "react-native": "0.81.4",
  "firebase": "^11.9.0",
  "openai": "^4.91.1",
  "expo-audio": "~1.0.13",
  "@react-navigation/native": "^7.1.10"
}
```

---

## 🔐 **Security Notes**

### Environment Variables
- **Never commit .env files** to version control
- **Use EAS environment variables** for production builds
- **Rotate API keys** regularly
- **Use Firebase security rules** for database access

### API Key Security (CRITICAL)
⚠️ **OpenAI API Key Protection:**
- **Monitor usage**: Set up billing alerts in OpenAI dashboard
- **Set usage limits**: Hard limit $20/month, soft limit $15/month
- **Usage tracking**: Check https://platform.openai.com/usage
- **Rotate keys**: Monthly or if suspicious activity detected

**Cost Protection Measures:**
```bash
# Check current API usage
curl https://api.openai.com/v1/usage \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Build Security
- **APK is signed** with Expo-managed keystore
- **Environment variables** are injected securely during build
- **No sensitive data** stored in source code
- **API keys** stored securely on EAS servers (not in repository)

---

## 📞 **Support Information**

### Build Dashboard
- **Expo Dashboard**: https://expo.dev/accounts/janphan/projects/SpeakMate
- **Build Logs**: Available for each build attempt
- **Environment Variables**: Managed through EAS dashboard

### Documentation
- **Expo Documentation**: https://docs.expo.dev/
- **EAS Build Guide**: https://docs.expo.dev/build/introduction/
- **React Native Guide**: https://reactnative.dev/docs/getting-started

### Last Successful Build Details
- **Build ID**: 4a877d41-be27-4c09-8738-352144349fc9
- **Platform**: Android
- **Profile**: production-apk
- **SDK Version**: 54.0.0
- **App Version**: 1.0.0 (Version Code: 2)
- **Status**: ✅ SUCCESS
- **Build Time**: ~1h 40m
- **APK Size**: ~25MB

---

## ✅ **Build Success Checklist**

Before building, ensure:
- [ ] `npx expo-doctor` shows 17/17 checks passed
- [ ] Environment variables uploaded to EAS
- [ ] No android/ios folders in project root
- [ ] All dependencies installed (`npm install`)
- [ ] Git repository is clean (optional but recommended)
- [ ] Internet connection is stable

Build command:
```bash
npx eas build --platform android --profile production-apk --clear-cache
```

**Expected result**: APK download link provided after successful build completion.

---

## 📱 **QR Code Distribution**

### Generate QR Code for APK
```bash
# Generate QR code for current APK
npm run qr

# Or generate and update from latest build
npm run qr-update
```

### QR Code Files Created
- **speakmate-apk-qr.png** - High-quality PNG image (512x512)
- **speakmate-apk-qr.svg** - Scalable vector format
- **download-speakmate.html** - Professional download page with QR code

### Distribution Options
1. **Share PNG Image**: Send `speakmate-apk-qr.png` via messaging/email
2. **Host HTML Page**: Upload `download-speakmate.html` to web server
3. **Print QR Code**: Print PNG for physical distribution
4. **Social Media**: Post QR code image on social platforms

### QR Code Benefits
- ✅ **No typing** required - just scan and download
- ✅ **Works on any phone** with camera
- ✅ **Professional presentation** with branded download page
- ✅ **Automatic updates** when new builds are available
- ✅ **Easy sharing** via image or webpage

---

## 📚 **SSH and Git Configuration**

### Setting up SSH for GitHub (Optional but Recommended)

#### Generate SSH Key
```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Start SSH agent
eval "$(ssh-agent -s)"

# Add SSH key to agent
ssh-add ~/.ssh/id_ed25519
```

#### Add SSH Key to GitHub
```bash
# Copy public key to clipboard
cat ~/.ssh/id_ed25519.pub
# Copy the output and add to GitHub → Settings → SSH Keys
```

#### Test SSH Connection
```bash
ssh -T git@github.com
```

### Git Configuration
```bash
# Set global git configuration
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"

# Clone with SSH
git clone git@github.com:Janphan/SpeakMate.git

# Or change existing remote to SSH
git remote set-url origin git@github.com:Janphan/SpeakMate.git
```

---

## 🔄 **Build Automation and CI/CD**

### GitHub Actions Integration
Create `.github/workflows/build.yml`:
```yaml
name: EAS Build
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm install
      - run: npx expo-doctor
      - run: npx eas build --platform android --profile production-apk --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

### Environment Variables in CI
- **EXPO_TOKEN**: Generate from https://expo.dev/accounts/settings/access-tokens
- **Add to GitHub Secrets**: Repository → Settings → Secrets and variables → Actions

---

*Last updated: October 16, 2025*  
*Build system: EAS Build (Managed Workflow)*  
*Target: Android APK for distribution*