/* eslint-env node */
'use strict';

module.exports = function(deployTarget) {
  let ENV = {
    build: {
      outputPath: 'dist'
    }
    // include other plugin configuration that applies to all deploy targets here
  };

  ENV.bugsnag = { apiKey: '41f92a3b854d3fb8f1fc326ee853c20f', distDir: 'dist' };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
    // configure other plugins for development deploy target here
  }

  if (deployTarget === 'staging') {
    ENV.bugsnag.publicUrl = 'https://staging.cryptostrikers.com';
    ENV.build.environment = 'production';
  }

  if (deployTarget === 'production') {
    ENV.bugsnag.publicUrl = 'https://www.cryptostrikers.com';
    ENV.build.environment = 'production';
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
