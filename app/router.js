import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  if (!config.strikers.onlyShowLanding) {
    this.authenticatedRoute('buy-packs');
    this.authenticatedRoute('my-album');
    this.route('marketplace');
    this.route('login');
    this.authenticatedRoute('profile');
    this.route('activity', function() {
      this.route('show', { path: '/:activity_id' });
    });
    this.route('sign-in');
  }
  this.route('404', { path: '/*path' });
  this.route('checklist', { path: '/checklist/:checklist_item_id' });
  this.route('sales', { path: '/sales/:sale_id' });
  this.route('kitty-sale');
  if (config.environment === 'development') {
    this.route('admin');
  }
  this.route('create-trade');
  this.route('trades', { path: '/trades/:trade_id' });
  this.route('dashboard', function() {
    this.route('checklist');
    this.route('core');
    this.route('pack-factory');
  });
  this.authenticatedRoute('referrals');
  this.route('invite', { path: '/invite/:referral_code_id' });
});

export default Router;
