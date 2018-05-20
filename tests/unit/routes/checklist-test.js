import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | checklist', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:checklist');
    assert.ok(route);
  });
});
