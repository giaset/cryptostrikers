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

    bugsnag: {
      apiKey: '41f92a3b854d3fb8f1fc326ee853c20f',
      notifyReleaseStages: ['staging', 'production'],
      releaseStage: deployTarget ? deployTarget : 'development'
    },

    emberGtm: { deployTarget },

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
      baseUrl: 'http://localhost:4200/',
      networkId: 5777, // localhost
      contractJsonPrefix: '',
      checklistContractAddress: '0x9414329bf6837db915b4d5e0e22ecc27a33129c5',
      coreContractAddress: '0xd115fa87b4b98073f6754c5bbed1c9afd2ecabe7',
      etherscanUrl: 'https://rinkeby.etherscan.io/',
      kittiesContractAddress: '0xd115fa87b4b98073f6754c5bbed1c9afd2ecabe7',
      saleContractAddress: '0xa32d4da69c2cc405f98acc58481f9e0dd038f2fa'
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
    ENV.strikers.baseUrl = 'https://staging.cryptostrikers.com/',
    ENV.strikers.contractJsonPrefix = 'Staging/';
    ENV.strikers.checklistContractAddress = '0x77fd1480eb40cb1386aaf7dca0bed41d705256af';
    ENV.strikers.coreContractAddress = '0x453659562695ee39bd3bd9e2afd3db1bd9901db3';
    ENV.strikers.kittiesContractAddress = '0x16baf0de678e52367adc69fd067e5edd1d33e3bf';
    ENV.strikers.saleContractAddress = '0x882df83cc4ae454fbe0ef0e6b4f7e270a21bad90';
    ENV.strikers.openSeaApi = `https://etherbay-api-1.herokuapp.com/assets/?asset_contract_address=${ENV.strikers.coreContractAddress}`;
  }

  if (deployTarget === 'production' || environment === 'development') {
    ENV.strikers.checklistContractAddress = '0xDBc260a05F81629FfA062Df3d1668A43133AbbA4';
    ENV.strikers.coreContractAddress = '0xdCAad9Fd9a74144d226DbF94ce6162ca9f09ED7e';
    ENV.strikers.saleContractAddress = '0xEB5405E21d07fa5e3B6644d0aE7f391B47F17E27';
    ENV.strikers.kittiesContractAddress = '0x06012c8cf97bead5deae237070f9587f8e7a266d';

    ENV.strikers.apiHost = 'https://us-central1-cryptostrikers-prod.cloudfunctions.net';
    ENV.strikers.networkId = 1; // mainnet
    ENV.strikers.baseUrl = 'https://www.cryptostrikers.com/',
    ENV.strikers.contractJsonPrefix = 'Production/';
    ENV.strikers.etherscanUrl = 'https://etherscan.io/';
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
