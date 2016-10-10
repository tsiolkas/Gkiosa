angular.module('gkiosa.app.sections.receipts', [
  'ui.router'
])

.config($stateProvider => {
  $stateProvider.state('receipts', {
    abstract: true,
    url: '/receipts',
    template: '<ui-view></ui-view>'
  });
});
