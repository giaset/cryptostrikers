import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.authenticatedRoute('crowdsale');
  this.authenticatedRoute('my-album');
  this.route('trade');
  this.route('duel');
  this.route('login');
  this.route('deposit');
  this.route('activity');
  this.route('sign-in');
});

export default Router;
