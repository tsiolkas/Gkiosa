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
  self.deleteInvoices = deleteInvoices;
  self.editInvoices = editInvoices;
  self.expandInvoice = expandInvoice;
  self.getInvoiceProductKeys = getInvoiceProductKeys;

  function deleteInvoices(invoice) {
    self.promise = gkiosaApiUtilities.deleteInvoices(invoice).then(() => _.defer(() => $state.reload()));
  }

  function editInvoices(invoice) {
    $state.go('invoices.invoice', {invoicesId: invoice._id, vector: self.vector, name: invoice.name });
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
  }
}

})();
