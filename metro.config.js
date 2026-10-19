const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// inlineRem: 16 makes rem-based classes (h-11, px-4…) the same size on native as on web.
// NativeWind's native default is 14, which would shrink them by ~12%.
module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });
