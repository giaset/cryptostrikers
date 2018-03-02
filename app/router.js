import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('crowdsale');
  this.route('album');
  this.route('trade');
  this.route('duel');
});

export default Router;
