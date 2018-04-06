'use strict';

module.exports = function(environment) {
  const deployTarget = process.env.DEPLOY_TARGET;
  let ENV = {
    modulePrefix: 'cryptostrikers',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    firebase: {
      apiKey: 'AIzaSyA_T_2eOMBwC34Uj7CkVHxkUAWgjNsf4BA',
      authDomain: 'cryptostrikers-api.firebaseapp.com',
      databaseURL: 'https://cryptostrikers-api.firebaseio.com',
      projectId: 'cryptostrikers-api',
      storageBucket: 'cryptostrikers-api.appspot.com',
      messagingSenderId: '138250042052'
    },

    moment: {
      outputFormat: 'dddd, MMMM Do YYYY, h:mm:ss a'
    },

    strikers: {
      apiHost: 'https://us-central1-cryptostrikers-api.cloudfunctions.net',
      networkId: 5777, // localhost
      onlyShowLanding: false,
      saleContractAddress: '0x9414329bf6837db915b4d5e0e22ecc27a33129c5'
    },

    torii: {
      sessionServiceName: 'session'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  if (deployTarget === 'staging') {
    ENV.strikers.networkId = 4; // rinkeby
    ENV.strikers.saleContractAddress = '0x27cb4d119429c464c7138a57b6a8d36ab7b4e2ca';
  }

  if (deployTarget === 'production') {
    ENV.strikers.apiHost = 'https://us-central1-cryptostrikers-prod.cloudfunctions.net';
    ENV.strikers.networkId = 1; // mainnet
    ENV.strikers.onlyShowLanding = true;
    ENV.firebase = {
      apiKey: 'AIzaSyACrJK0KFti25MdwB400Rz-SuuTuzzG9r0',
      authDomain: 'cryptostrikers-prod.firebaseapp.com',
      databaseURL: 'https://cryptostrikers-prod.firebaseio.com',
      projectId: 'cryptostrikers-prod',
      storageBucket: 'cryptostrikers-prod.appspot.com',
      messagingSenderId: '381934574607'
    };
  }

  return ENV;
};
