angular.module('gkiosa.app.sections.users.user', [
  'ui.router'
])

.config($stateProvider => {
  $stateProvider.state('users.user', {
    url: '/:userId?vector?name',
    templateUrl: 'sections/users/user/user.html',
    controller: 'UserController',
    controllerAs: 'userCtrl',
    reloadOnSearch: false,
    getBreadcrumbName: params => [
        {
          sref: `users.all({vector: '${params.vector}'})`,
          name: params.vector === 'SUPPLIERS' ? 'Προμηθευτές' : 'Πελάτες'
        },
        {
          name: params.userId === 'new' ? 'Δημιουργία νέου' : params.name
        }
      ],
    getActiveMenuId: params => params.vector === 'SUPPLIERS' ? 'users.all.suppliers' : 'users.all.customers'
  });
});
