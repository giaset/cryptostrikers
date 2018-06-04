import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | referrals', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:referrals');
    assert.ok(route);
  });
});
