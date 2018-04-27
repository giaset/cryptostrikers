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

    metricsAdapters: [
      {
        name: 'GoogleAnalytics',
        environments: ['development', 'production'],
        config: {
          // TODO: different ID for production
          id: 'UA-117502203-1',
          debug: environment === 'development',
          trace: environment === 'development',
          sendHitTask: environment !== 'development'
        }
      }
    ],

    moment: {
      outputFormat: 'dddd, MMMM Do YYYY, h:mm:ss a'
    },

    strikers: {
      apiHost: 'https://us-central1-cryptostrikers-api.cloudfunctions.net',
      networkId: 5777, // localhost
      onlyShowLanding: false,
      kittiesContractAddress: '0x9414329bf6837db915b4d5e0e22ecc27a33129c5',
      mintingContractAddress: '0x9414329bf6837db915b4d5e0e22ecc27a33129c5',
      mintingContractJSON: 'StrikersMinting',
      saleContractAddress: '0xc273b9bf2c4d83b58b690c99e732f99439a9e097',
      saleContractJSON: 'StrikersPackSale'
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
    ENV.strikers.kittiesContractAddress = '0x16baf0de678e52367adc69fd067e5edd1d33e3bf';
    ENV.strikers.mintingContractAddress = '0xcfd0ebf5100fdc1b3d2f460f65681d9287da467c';
    ENV.strikers.mintingContractJSON = 'StrikersMintingStaging';
    ENV.strikers.saleContractAddress = '0xba2b00f8c2a82837d870de7e13023d8371bf98c0';
    ENV.strikers.saleContractJSON = 'StrikersPackSaleStaging';
    ENV.strikers.openSeaApi = `https://etherbay-api-1.herokuapp.com/assets/?asset_contract_address=${ENV.strikers.mintingContractAddress}`;
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
