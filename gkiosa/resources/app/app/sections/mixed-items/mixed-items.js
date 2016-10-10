angular.module('gkiosa.app.sections.mixedItems', [
  'ui.router'
])

.config($stateProvider => {
  $stateProvider.state('mixedItems', {
    url: '/mixedItems?table',
    templateUrl: 'sections/mixed-items/mixed-items.html',
    controller: 'MixedItemsController',
    controllerAs: 'mixedItemsCtrl',
    reloadOnSearch: false,
    getBreadcrumbName: params => [{name: 'Αναζήτηση'}],
    getActiveMenuId: params => 'mixedItems'
  });
});
