import DS from 'ember-data';

export default DS.JSONSerializer.extend({
  keyForAttribute(key) {
    if (key === 'imageUrl') {
      return 'image_url';
    }

    return this._super(...arguments);
  }
});
