angular.module('gkiosa.app.sections.users', [
  'ui.router'
])

.config($stateProvider => {
  $stateProvider.state('users', {
    abstract: true,
    url: '/users',
    template: '<ui-view></ui-view>'
  });
});
