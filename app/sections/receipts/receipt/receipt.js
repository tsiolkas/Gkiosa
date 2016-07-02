angular.module('gkiosa.app.sections.receipts.receipt', [
  'ui.router'
])

.config($stateProvider => {
  $stateProvider.state('receipts.receipt', {
    url: '/:receiptId?vector?name',
    templateUrl: 'sections/receipts/receipt/receipt.html',
    controller: 'ReceiptController',
    controllerAs: 'receiptCtrl',
    reloadOnSearch: false,
    getBreadcrumbName: params => [
        {
          sref: `receipts.all({vector: '${params.vector}'})`,
          name: params.vector === 'SUPPLIERS' ? 'Απόδείξης αγοράς' : 'Απόδείξης πώλησης'
        },
        {
          name: params.receiptId === 'new' ? 'Δημιουργία νέας' : params.name
        }
      ],
    getActiveMenuId: params => params.vector === 'SUPPLIERS' ? 'receipts.all.suppliers' : 'receipts.all.customers'
  });
});
