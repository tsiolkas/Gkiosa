angular.module('gkiosa.app.sections.invoices.invoice', [
  'ui.router'
])

.config($stateProvider => {
  $stateProvider.state('invoices.invoice', {
    url: '/:invoiceId?vector?name',
    templateUrl: 'sections/invoices/invoice/invoice.html',
    controller: 'InvoiceController',
    controllerAs: 'invoiceCtrl',
    reloadOnSearch: false,
    getBreadcrumbName: params => [
        {
          sref: `invoices.all({vector: '${params.vector}'})`,
          name: params.vector === 'SUPPLIERS' ? 'Τιμολόγια αγοράς' : 'Τιμολόγια πώλησης'
        },
        {
          name: params.invoiceId === 'new' ? 'Δημιουργία νέου' : params.name
        }
      ],
    getActiveMenuId: params => params.vector === 'SUPPLIERS' ? 'invoices.all.suppliers' : 'invoices.all.customers'
  });
});
