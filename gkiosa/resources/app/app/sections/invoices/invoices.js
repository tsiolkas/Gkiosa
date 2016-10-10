angular.module('gkiosa.app.sections.invoices', [
  'ui.router'
])

.config($stateProvider => {
  $stateProvider.state('invoices', {
    abstract: true,
    url: '/invoices',
    template: '<ui-view></ui-view>'
  });
});
