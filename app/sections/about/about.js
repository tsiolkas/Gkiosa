angular.module('gkiosa.app.sections.about', [
  'ui.router'
])

  .config($stateProvider => {
    $stateProvider.state('about', {
      url: '/about',
      templateUrl: 'sections/about/about.html',
      controller: 'AboutController',
      controllerAs: 'aboutCtrl',
      reloadOnSearch: false,
      getBreadcrumbName: params => [{ name: 'Πληροφορίες'}],
      getActiveMenuId: params => 'about'
    });
  });
