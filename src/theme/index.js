// Import theme modules
import { colors } from './colors';
import { spacing, borderRadius } from './spacing';
import { typography } from './typography';

export { colors } from './colors';
export { spacing, borderRadius } from './spacing';
export { typography } from './typography';

// Safe area utilities
export const createHeaderStyle = (insets, backgroundColor = colors.primary) => ({
  backgroundColor,
  paddingTop: insets.top + 20,
  paddingBottom: 30,
  paddingHorizontal: 20,
  borderBottomLeftRadius: 25,
  borderBottomRightRadius: 25,
  elevation: 8,
  shadowColor: colors.shadow.color,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
});

export const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  createHeaderStyle,
};

export default theme;
