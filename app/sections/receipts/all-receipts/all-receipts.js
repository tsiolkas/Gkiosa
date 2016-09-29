angular.module('gkiosa.app.sections.receipts.allReceipts', [
  'ui.router'
])

.config($stateProvider => {
  $stateProvider.state('receipts.all', {
    url: '?vector?table',
    templateUrl: 'sections/receipts/all-receipts/all-receipts.html',
    controller: 'AllReceiptsController',
    controllerAs: 'allReceiptsCtrl',
    reloadOnSearch: false,
    getBreadcrumbName: params => [{ name: params.vector === 'SUPPLIERS' ? 'Αποδείξεις πληρωμής' : 'Αποδείξεις είσπραξης'}],
    getActiveMenuId: params => params.vector === 'SUPPLIERS' ? 'receipts.all.suppliers' : 'receipts.all.customers'
  });
});
