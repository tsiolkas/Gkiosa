(function () {

'use strict';

angular.module('gkiosa.app.sections.invoices')

.controller('AllInvoicesController', AllInvoicesController);

function AllInvoicesController(
  $element,
  $state,
  $stateParams,
  gkiosaApiUtilities,
  gkiosaPagination
) {
  const self = this;

  self.vector = $stateParams.vector;
  self.invoicesTableParams = gkiosaPagination.createNgTableParams(self, 'Invoices', 'name');
  self.deleteInvoice = deleteInvoice;
  self.editInvoice = editInvoice;
  self.expandInvoice = expandInvoice;
  self.getInvoiceProductKeys = getInvoiceProductKeys;

  function deleteInvoice(invoice) {
    self.promise = gkiosaApiUtilities.deleteInvoice(invoice).then(() => _.defer(() => $state.reload()));
  }

  function editInvoice(invoice) {
    $state.go('invoices.invoice', {invoiceId: invoice._id, vector: self.vector, name: ''+invoice.invoiceNum });
  }

  function getInvoiceProductKeys(products) {
    return _.chain(products).first().keys().reject(v => !_.isString(v) || v.indexOf('$$hashKey') !== -1).value();
  }

  function expandInvoice($event, invoice) {
    const rowEl = $($event.target).closest('tr');
    const expandedInvoiceEl = $element.find('.gks-expanded-invoice');
    if (self.expandedInvoice && self.expandedInvoice._id === invoice._id) {
      expandedInvoiceEl.toggle();
    } else {
      expandedInvoiceEl.show();
    }
    self.expandedInvoice = invoice;
    expandedInvoiceEl.insertAfter(rowEl);

    self.invoiceProductsTableParams = gkiosaPagination.createStaticNgTableParams(invoice.products);
  }
}

})();
