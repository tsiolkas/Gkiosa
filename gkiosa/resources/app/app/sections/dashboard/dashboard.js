angular.module('gkiosa.app.sections.dashboard', [
  'ui.router'
])

.config($stateProvider => {
  $stateProvider.state('dashboard', {
    url: '/',
    templateUrl: 'sections/dashboard/dashboard.html',
    controller: 'DashboardController',
    controllerAs: 'dashboardCtrl',
    reloadOnSearch: false,
    getBreadcrumbName: params => [{ name: 'Πίνακας ελέγχου'}],
    getActiveMenuId: params => 'dashboard'
  });
});
