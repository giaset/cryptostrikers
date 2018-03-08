import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return[
      {
        name: 'Lionel Messi'
      },
      {
        name: 'Neymar'
      },
      {
        name: 'Cristiano Ronaldo'
      },
      {
        name: 'Kylian Mbappe'
      },
      {
        name: 'Paul Pogba'
      },
      {
        name: 'Gianluigi Buffon'
      },
      {
        name: 'Alexis Sanchez'
      },
      {
        name: 'Zlatan Ibrahimovic'
      },
      {
        name: 'Harry Kane'
      },
      {
        name: 'Jozy Altidore'
      }
    ];
  }
});
