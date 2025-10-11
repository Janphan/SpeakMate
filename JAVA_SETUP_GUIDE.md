# 🚀 Java Environment Setup Guide for Windows

## Step 1: Download Java JDK 17
1. Visit: https://adoptium.net/temurin/releases/
2. Select:
   - Version: **OpenJDK 17 (LTS)**
   - OS: **Windows**
   - Architecture: **x64**
   - Package Type: **JDK**
   - File Type: **.msi**
3. Download the .msi installer (~180-200MB)

## Step 2: Install Java
1. Run the downloaded .msi file as administrator
2. Follow installation wizard with default settings
3. Note the installation path (usually: `C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot\`)

## Step 3: Set Environment Variables

### Method A: Using System Properties (GUI)
1. **Open System Properties**:
   - Press `Windows Key + R`
   - Type: `sysdm.cpl`
   - Press Enter

2. **Access Environment Variables**:
   - Click "Advanced" tab
   - Click "Environment Variables..." button

3. **Set JAVA_HOME**:
   - In "System Variables" section, click "New..."
   - Variable name: `JAVA_HOME`
   - Variable value: `C:\Users\tuyet\AppData\Local\Programs\Eclipse Adoptium\jdk-17.0.16.8-hotspot`
   - Click OK

4. **Update PATH**:
   - Find "Path" in System Variables, select it, click "Edit..."
   - Click "New"
   - Add: `%JAVA_HOME%\bin`
   - Click OK

### Method B: Using Command Line (PowerShell as Admin)
```powershell
# Set JAVA_HOME (your actual path)
setx JAVA_HOME "C:\Users\tuyet\AppData\Local\Programs\Eclipse Adoptium\jdk-17.0.16.8-hotspot" /M

# Add to PATH
setx PATH "%PATH%;%JAVA_HOME%\bin" /M
```

### Method C: For Current Terminal Session (Bash)
```bash
# Set for current session
export JAVA_HOME="/c/Users/tuyet/AppData/Local/Programs/Eclipse Adoptium/jdk-17.0.16.8-hotspot"
export PATH="$JAVA_HOME/bin:$PATH"
```

## Step 4: Verify Installation
Open **new** Command Prompt or PowerShell and run:
```bash
java -version
javac -version
echo %JAVA_HOME%
```

Expected output:
```
openjdk version "17.0.x" 2024-xx-xx
OpenJDK Runtime Environment Temurin-17.0.x+x (build 17.0.x+x)
OpenJDK 64-Bit Server VM Temurin-17.0.x+x (build 17.0.x+x, mixed mode, sharing)
```

## Step 5: For Android Development
After Java is set up, you can proceed with:
1. Android Studio installation
2. Android SDK setup
3. Local APK building with Gradle

## Troubleshooting
- **"java command not found"**: Restart terminal/IDE after setting environment variables
- **Wrong version**: Make sure JAVA_HOME points to JDK 17, not older versions
- **Permission issues**: Run as administrator when setting system environment variables

## Quick Test Commands
```bash
# Check Java installation
java -version

# Check JAVA_HOME
echo $JAVA_HOME     # Linux/Mac
echo %JAVA_HOME%    # Windows

# Test compilation
javac -version
```