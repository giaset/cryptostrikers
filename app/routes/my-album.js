import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';

export default Route.extend(AuthenticatedRouteMixin, {
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
