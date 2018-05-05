import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Adapter | checklist item', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let adapter = this.owner.lookup('adapter:checklist-item');
    assert.ok(adapter);
  });
});
