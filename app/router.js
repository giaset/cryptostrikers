import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  if (!config.strikers.onlyShowLanding) {
    this.authenticatedRoute('crowdsale');
    this.authenticatedRoute('my-album');
    this.route('trade');
    this.route('duel');
    this.route('login');
    this.route('deposit');
    this.route('activity', function() {
      this.route('show', { path: '/:activity_id' });
    });
    this.route('sign-in');
  }
  this.route('404', { path: '/*path' });
});

export default Router;
