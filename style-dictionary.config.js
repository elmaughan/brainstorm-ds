const StyleDictionary = require('style-dictionary');

StyleDictionary.registerTransform({
  name: 'size/remFromPx',
  type: 'value',
  matcher: (token) => typeof token.value === 'string' && token.value.endsWith('px'),
  transformer: (token) => {
    const px = parseFloat(token.value);
    return `${(px / 16).toFixed(4).replace(/\.?0+$/, '')}rem`;
  },
});

StyleDictionary.registerFormat({
  name: 'css/bsn-variables',
  formatter: function({ dictionary, options }) {
    const selector = (options && options.selector) || ':root';
    const tokens = dictionary.allProperties
      .map(token => `  --${token.name}: ${token.value};`)
      .join('\n');
    return `/**\n * Do not edit directly\n * Generated on ${new Date().toUTCString()}\n */\n\n${selector} {\n${tokens}\n}\n`;
  }
});

module.exports = StyleDictionary.extend({
  source: ['tokens/src/**/*.json'],
  platforms: {
    css: {
      transforms: [
        'attribute/cti',
        'name/cti/kebab',
        'color/css',
        'size/remFromPx',
      ],
      prefix: 'bsn',
      files: [
        {
          destination: 'tokens/dist/tokens.css',
          format: 'css/bsn-variables',
          options: { selector: ':root' },
        },
      ],
    },
    js: {
      transforms: [
        'attribute/cti',
        'name/cti/camel',
        'color/css',
        'size/remFromPx',
      ],
      files: [
        {
          destination: 'tokens/dist/tokens.js',
          format: 'javascript/es6',
        },
      ],
    },
  },
}).buildAllPlatforms();
