angular.module('gkiosa.app.sections.users.allUsers', [
  'ui.router'
])

.config($stateProvider => {
  $stateProvider.state('users.all', {
    url: '?vector?table',
    templateUrl: 'sections/users/all-users/all-users.html',
    controller: 'AllUsersController',
    controllerAs: 'allUsersCtrl',
    reloadOnSearch: false,
    getBreadcrumbName: params => [{ name: params.vector === 'SUPPLIERS' ? 'Προμηθευτές' : 'Πελάτες'}],
    getActiveMenuId: params => params.vector === 'SUPPLIERS' ? 'users.all.suppliers' : 'users.all.customers'
  });
});
