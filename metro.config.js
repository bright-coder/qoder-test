const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Ensure our babel config is preserved
module.exports = withNativeWind(config, { 
  input: './global.css',
});
