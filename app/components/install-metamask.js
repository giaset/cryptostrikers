import Component from '@ember/component';

export default Component.extend({
  classNames: ['install-metamask', 'row'],
  actions: {
    forceRefresh() {
      window.location.reload();
    }
  }
});
