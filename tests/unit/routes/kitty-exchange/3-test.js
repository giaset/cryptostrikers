import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | kitty-exchange/3', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:kitty-exchange/3');
    assert.ok(route);
  });
});
