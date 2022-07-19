const { NodeModulesPolyfillPlugin } = require('@esbuild-plugins/node-modules-polyfill');

// eslint-disable-next-line import/no-extraneous-dependencies
const rollupNodePolyFill = require('rollup-plugin-node-polyfills');

module.exports = {
  core: {
    builder: {
      name: '@storybook/builder-vite',
			options: {
				eagerImportStories: true
			}
    }
  },
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)',
    '../prototypes/**/*.stories.@(js|jsx|ts|tsx|svelte)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-svelte-csf',
    'storybook-addon-themes',
    '@storybook/addon-jest',
  ],
  framework: '@storybook/svelte',
  svelteOptions: {
    preprocess: require('svelte-preprocess')()
  },

  async viteFinal(config, { configType }) {
    if (configType === 'DEVELOPMENT') {
      /*
        Node Polyfills Config
        ---------------------
        `path` needs to be polyfilled for Jest, which is required to allow
        @storybook/addon-jest to work with Vite
        (because Vite does not run on Node.js and Jest always assume its environment to be Node.js).
        Polyfill source: https://medium.com/@ftaioli/using-node-js-builtin-modules-with-vite-6194737c2cd2
      */
      config.resolve = {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          path: 'rollup-plugin-node-polyfills/polyfills/path',
        },
      };

      config.optimizeDeps = {
        ...config.optimizeDeps,
        // customize the Vite config here
        include: [
          '@storybook/svelte',
          '@storybook/addon-svelte-csf',
          '@storybook/addon-jest',
          '@storybook/addon-docs/dist/esm/frameworks/common/config.js',
          '@storybook/addon-docs/dist/esm/frameworks/svelte/config.js',
          '@storybook/svelte/dist/esm/client/preview/config',
          '@storybook/addon-links/dist/esm/preset/addDecorator.js',
          '@storybook/addon-actions/dist/esm/preset/addDecorator.js',
          '@storybook/addon-actions/dist/esm/preset/addArgs.js',
          '@storybook/addon-backgrounds/dist/esm/preset/addDecorator.js',
          '@storybook/addon-backgrounds/dist/esm/preset/addParameter.js',
          '@storybook/addon-measure/dist/esm/preset/addDecorator.js',
          '@storybook/addon-outline/dist/esm/preset/addDecorator.js',
          'fetch-mock',
          'chart.js',
          'body-scroll-lock',
          'tippy.js',
          ...config.optimizeDeps.include,
        ],
        esbuildOptions: {
          plugins: [ NodeModulesPolyfillPlugin() ]
        }
      };
    }

    config.build = {
      ...config.build,
      rollupOptions: {
        plugins: [
          // Enable rollup polyfills plugin
          // used during production bundling
          rollupNodePolyFill(),
        ],
      },
    };

    // return the customized config
    return config;
  }
};
