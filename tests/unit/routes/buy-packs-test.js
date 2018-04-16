import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | buy-packs', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:buy-packs');
    assert.ok(route);
  });
});
