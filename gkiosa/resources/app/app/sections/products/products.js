angular.module('gkiosa.app.sections.products', [
  'ui.router'
])

.config($stateProvider => {
  $stateProvider.state('products', {
    abstract: true,
    url: '/products',
    template: '<ui-view></ui-view>'
  });
});
