angular.module('gkiosa.app.sections.backup', [
  'ui.router'
])

  .config($stateProvider => {
    $stateProvider.state('backup', {
      url: '/backup',
      templateUrl: 'sections/backup/backup.html',
      controller: 'BackupController',
      controllerAs: 'backupCtrl',
      reloadOnSearch: false,
      getBreadcrumbName: params => [{ name: 'Αντίγραφο ασφαλείας'}],
      getActiveMenuId: params => 'backup'
    });
  });
