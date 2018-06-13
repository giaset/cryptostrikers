import DS from 'ember-data';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

const BG_COLORS = {
  coral: '#c5eefa',
  babyblue: '#dcebfc',
  topaz: '#d1eeeb',
  mintgreen: '#cdf5d4',
  limegreen: '#d9f5cb',
  babypuke: '#eff1e0',
  chestnut: '#efe1da',
  strawberry: '#fcdede',
  pumpkin: '#fae1ca',
  gold: '#faf4cf',
  sizzurp: '#dfdffa',
  bubblegum: '#fadff4',
  violet: '#ede2f5',
  thundergrey: '#eee9e8'
};

export default DS.Model.extend({
  color: DS.attr('string'),
  imageUrl: DS.attr('string'),
  name: DS.attr('string'),

  bgStyle: computed('color', function() {
    const color = BG_COLORS[this.get('color')];
    if (!color) { return; }

    return htmlSafe(`background-color: ${color}`);
  })
});
