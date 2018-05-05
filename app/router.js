import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';

const Router = EmberRouter.extend({
  location: config.locationType,
  metrics: service(),
  rootURL: config.rootURL,

  didTransition() {
    this._super(...arguments);
    this._trackPage();
  },

  _trackPage() {
    scheduleOnce('afterRender', this, () => {
      const page = this.get('url');
      const title = this.getWithDefault('currentRouteName', 'unknown');
      this.get('metrics').trackPage({ page, title });
    });
  }
});

Router.map(function() {
  if (!config.strikers.onlyShowLanding) {
    this.authenticatedRoute('buy-packs');
    this.authenticatedRoute('my-album');
    this.route('marketplace');
    this.route('challenge');
    this.route('login');
    this.authenticatedRoute('profile');
    this.route('activity', function() {
      this.route('show', { path: '/:activity_id' });
    });
    this.route('sign-in');
  }
  this.route('404', { path: '/*path' });
  this.route('cards', { path: '/cards/:card_id' });
  this.route('sales', { path: '/sales/:sale_id' });
  this.route('kitty-sale');
  if (config.environment === 'development') {
    this.route('admin');
  }
  this.route('checklist', function() {
    this.route('show', { path: '/:checklist_item_id' });
  });
});

export default Router;
