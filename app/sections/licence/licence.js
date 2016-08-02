angular.module('gkiosa.app.sections.licence', [
  'ui.router'
])

  .config($stateProvider => {
    $stateProvider.state('licence', {
      url: '/licence',
      templateUrl: 'sections/licence/licence.html',
      controller: 'LicenceController',
      controllerAs: 'licenceCtrl',
      reloadOnSearch: false,
      getBreadcrumbName: params => [{ name: 'Δικαιώματα'}],
      getActiveMenuId: params => 'licence'
    });
  });
