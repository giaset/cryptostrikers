import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | gas-modal', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{gas-modal}}`);

    //assert.equal(this.element.textContent.trim(), '');
    assert.ok(true);

    // Template block usage:
    await render(hbs`
      {{#gas-modal}}
        template block text
      {{/gas-modal}}
    `);

    //assert.equal(this.element.textContent.trim(), 'template block text');
    assert.ok(true);
  });
});
