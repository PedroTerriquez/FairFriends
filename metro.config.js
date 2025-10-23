const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const config = getDefaultConfig(__dirname, { isCSSEnabled: true })
config.resolver.sourceExts.push('cjs', 'mjs')

// Custom resolution function for tslib specifically
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === 'tslib' || moduleName.endsWith('/tslib')) return {
        filePath: path.resolve(__dirname, './node_modules/tslib/tslib.js'),
        type: 'sourceFile',
    };
    if (originalResolveRequest) return originalResolveRequest(context, moduleName, platform);
    return context.resolveRequest(context, moduleName, platform);
};

module.exports = wrapWithReanimatedMetroConfig(config);
