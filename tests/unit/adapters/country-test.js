import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Adapter | country', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let adapter = this.owner.lookup('adapter:country');
    assert.ok(adapter);
  });
});
