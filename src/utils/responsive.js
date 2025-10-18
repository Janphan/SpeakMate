import { Dimensions, PixelRatio } from 'react-native';

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Calculate responsive dimensions
export const responsive = {
    // Screen dimensions
    screenWidth,
    screenHeight,

    // Responsive width based on percentage
    width: (percentage) => (screenWidth * percentage) / 100,

    // Responsive height based on percentage
    height: (percentage) => (screenHeight * percentage) / 100,

    // Responsive padding
    padding: {
        horizontal: Math.max(16, screenWidth * 0.04),
        vertical: Math.max(12, screenHeight * 0.015),
        small: Math.max(8, screenWidth * 0.02),
        medium: Math.max(16, screenWidth * 0.04),
        large: Math.max(24, screenWidth * 0.06),
    },

    // Responsive font sizes
    fontSize: {
        small: Math.max(12, screenWidth * 0.03),
        medium: Math.max(14, screenWidth * 0.035),
        large: Math.max(16, screenWidth * 0.04),
        title: Math.max(18, screenWidth * 0.045),
        header: Math.max(20, screenWidth * 0.05),
    },

    // Safe area bottom padding (for bottom navigation)
    safeBottom: 100,

    // Check if screen is small (for conditional styling)
    isSmallScreen: screenWidth < 350,
    isMediumScreen: screenWidth >= 350 && screenWidth < 400,
    isLargeScreen: screenWidth >= 400,

    // Responsive margins
    margin: {
        small: Math.max(8, screenWidth * 0.02),
        medium: Math.max(12, screenWidth * 0.03),
        large: Math.max(16, screenWidth * 0.04),
    }
};

// Normalize size for different screen densities
export const normalize = (size) => {
    const scale = screenWidth / 375; // Base width (iPhone X)
    const newSize = size * scale;

    if (PixelRatio.get() >= 3 && PixelRatio.get() < 3.5) {
        // Extra high density
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    }

    if (PixelRatio.get() >= 2 && PixelRatio.get() < 3) {
        // High density
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    }

    // Standard density
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) + 1;
};

export default responsive;