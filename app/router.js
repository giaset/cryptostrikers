import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.authenticatedRoute('buy-packs');
  this.authenticatedRoute('my-album');
  this.route('marketplace');
  this.route('login');
  this.route('activity', function() {
    this.route('show', { path: '/:activity_id' });
  });
  this.route('sign-in');
  this.route('404', { path: '/*path' });
  this.authenticatedRoute('checklist', { path: '/checklist/:checklist_item_id' });
  this.route('sales', { path: '/sales/:sale_id' });
  if (config.environment === 'development') {
    this.route('admin');
  }
  this.route('dashboard', function() {
    this.route('checklist');
    this.route('core');
    this.route('pack-factory');
    this.route('pack-sale');
    this.route('whitelist');
    this.route('video-tester');
    this.route('key-metrics');
    this.route('trading');
  });
  this.authenticatedRoute('create-trade');
  this.authenticatedRoute('trades', { path: '/trades/:trade_id' });
  this.authenticatedRoute('referrals');
  this.route('invite', { path: '/invite/:referral_code_id' });
  this.route('profile', { path: '/profile/:user_metadata_id' });

  this.authenticatedRoute('kitty-exchange', function() {
    this.authenticatedRoute('1');
    this.authenticatedRoute('2');
    this.authenticatedRoute('3');
  });
});

export default Router;
