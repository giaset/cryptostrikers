import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | my-album', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:my-album');
    assert.ok(route);
  });
});
