angular.module('gkiosa.app.sections.invoices.allInvoices', [
  'ui.router'
])

.config($stateProvider => {
  $stateProvider.state('invoices.all', {
    url: '?vector?table',
    templateUrl: 'sections/invoices/all-invoices/all-invoices.html',
    controller: 'AllInvoicesController',
    controllerAs: 'allInvoicesCtrl',
    reloadOnSearch: false,
    getBreadcrumbName: params => [{ name: params.vector === 'SUPPLIERS' ? 'Τιμολόγια αγοράς' : 'Τιμολόγια πώλησης'}],
    getActiveMenuId: params => params.vector === 'SUPPLIERS' ? 'invoices.all.suppliers' : 'invoices.all.customers'
  });
});
