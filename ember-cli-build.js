'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    fingerprint: {
      exclude: ['/cards/', 'standard-pack.png', 'premium-pack.png', '/flags/']
    },
    sassOptions: {
      includePaths: [
        'vendor/bootstrap/scss'
      ]
    },
    sourcemaps: {
      enabled: true,
      extensions: ['js']
    }
  });

  app.import('vendor/lightwallet.min.js');
  app.import('vendor/web3.min.js');

  return app.toTree();
};
