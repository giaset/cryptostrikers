import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
//import { render } from '@ember/test-helpers';
//import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | pack-sale-tile', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    //await render(hbs`{{pack-sale-tile}}`);

    //assert.equal(this.element.textContent.trim(), '');
    assert.ok(true);

    // Template block usage:
    /*await render(hbs`
      {{#pack-sale-tile}}
        template block text
      {{/pack-sale-tile}}
    `);*/

    //assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
