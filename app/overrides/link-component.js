import LinkComponent from '@ember/routing/link-component';

export default LinkComponent.reopen({
  attributeBindings: ['data-toggle', 'data-target']
});
