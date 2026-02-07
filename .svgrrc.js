module.exports = {
  filenameCase: 'kebab',
  template: require('./svgr-template.js'),
  typescript: true,
  prettier: true,
  icon: true,

  prettierConfig: {
    arrowParens: 'always',
    bracketSameLine: false,
    bracketSpacing: true,
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 110,
  },

  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            inlineStyles: { onlyMatchedOnce: false },
            cleanupIds: false,
            removeDoctype: false,
            removeViewBox: false,
          },
        },
      },
    ],
  },

  replaceAttrValues: {
    white: '{color}',
    '#FFFFFF': '{color}',
    '#FFF': '{color}',
    '#fff': '{color}',
    black: '{color}',
    '#000': '{color}',
    '#000000': '{color}',
    '#1C212D': '{color}',
  },
};
