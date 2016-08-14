(function () {

'use strict';

angular.module('gkiosa.app.sections.invoices')

.controller('AllInvoicesController', AllInvoicesController);

function AllInvoicesController(
  $scope,
  $element,
  $state,
  $stateParams,
  gkiosaApi,
  gkiosaApiUtilities,
  gkiosaPagination
) {
  const self = this;

  self.vector = $stateParams.vector;
  self.expandedinvoices = {};
  self.invoicesTableParams = gkiosaPagination.createNgTableParams(self, 'Invoices', 'name');

  self.deleteInvoice = deleteInvoice;
  self.editInvoice = editInvoice;
  self.expandInvoice = expandInvoice;
  self.getInvoiceProductKeys = getInvoiceProductKeys;
  self.getInvoiceTable = getInvoiceTable;

  init();

  function init() {
    gkiosaApi.findAllUsers().then(resp => $scope.allUsers = resp.results);
  }

  function deleteInvoice(invoice) {
    self.promise = gkiosaApiUtilities.deleteInvoice(invoice);
    self.promise && self.promise.then(() => _.defer(() => $state.reload()));
  }

  function editInvoice(invoice) {
    $state.go('invoices.invoice', {invoiceId: invoice._id, vector: self.vector, name: invoice.invoiceNum });
  }

  function getInvoiceProductKeys(products) {
    return _.chain(products).first().keys().reject(v => !_.isString(v) || v.indexOf('$$hashKey') !== -1).value();
  }

  function expandInvoice(idx, invoice) {
    if (self.expandedinvoices[idx]) {
      self.expandedinvoices[idx] = undefined;
    } else {
      self.expandedinvoices[idx] = gkiosaPagination.createStaticNgTableParams(invoice.products);
    }
  }

  function getInvoiceTable(idx) {
    return self.expandedinvoices[idx];
  }
}

})();
