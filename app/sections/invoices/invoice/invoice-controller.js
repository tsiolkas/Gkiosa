(function () {

'use strict';

angular.module('gkiosa.app.sections.invoices.invoice')

.controller('InvoiceController', InvoiceController);

function InvoiceController($rootScope, $scope, $state, $stateParams, gkiosaPagination, gkiosaApi, gkiosaApiUtilities) {
  const self = this;

  let editedProductId;
  self.vector = $stateParams.vector;
  self.isNew = $stateParams.invoiceId === 'new';
  self.invoiceId = self.isNew ? undefined : $stateParams.invoiceId;
  self.newProduct = undefined;
  self.invoiceProductsTableParams = undefined;

  self.createInvoice = createInvoice;
  self.updateInvoice = updateInvoice;
  self.deleteInvoice = deleteInvoice;
  self.deleteProduct = deleteProduct;
  self.editProduct = editProduct;
  self.isProductEdited = isProductEdited;

  init();

  function init() {
    if (self.invoiceId) {
      findInvoice(self.invoiceId)
    }
    gkiosaApi.findAllUsers().then(resp => {
      return self.users = resp.results;
    });
    gkiosaApi.findAllProducts().then(resp => self.products = resp.results);

    $scope.$watch(
      () => self.newProduct,
      (product) => product && addNewProduct(product)
    );
  }

  function findInvoice(id) {
    return self.promiseOfinvoice = gkiosaApi.findInvoice(id)
      .then(invoice => {
        self.invoice = invoice;
        self.invoiceProductsTableParams = gkiosaPagination.createStaticNgTableParams(invoice.products);
      });
  }

  function createInvoice(invoice) {
    invoice.vector = self.vector;
    self.promiseOfinvoice = gkiosaApi.createInvoice(invoice).then(
      invoice => {
        $state.go('invoices.invoice', {invoiceId: invoice._id, vector: self.vector, name: invoice.name });
        $rootScope.$emit('gkiosa.app.components.alerts', {
          type: 'success',
          msg: `Η απόδειξη ${invoice.invoiceNum} δημιουργήθηκε`,
          timeout: 5000
        });
      }
    );
  }

  function updateInvoice(invoice) {
    // exclude angular's $$hashKey
    const clearedInvoice = angular.fromJson(angular.toJson(invoice));
    self.promiseOfinvoice = gkiosaApi.updateInvoice(clearedInvoice._id, clearedInvoice)
      .then(() => {
        $state.go('invoices.invoice', {invoiceId: clearedInvoice._id, vector: self.vector, name: clearedInvoice.name });
        $rootScope.$emit('gkiosa.app.components.alerts', {
          type: 'success',
          msg: `Η απόδειξη ${clearedInvoice.invoiceNum} αποθηκεύτηκε`,
          timeout: 5000
        });
      });
  }

  function deleteInvoice(invoice) {
    self.promise = gkiosaApiUtilities.deleteInvoice(invoice)
    if (self.promise) {
      self.promise.then(
        () => $state.go('invoices.all', {vector: self.vector})
      );
    }
  }

  function deleteProduct(product) {
    const idx = self.invoice.products.indexOf(product);
    if (idx === -1) {
      throw new Error('unexpected error, delete product that does not exist');
    }
    self.invoice.products.splice(idx, 1);
    self.invoiceProductsTableParams.reload();
  }

  function editProduct(product) {
    editedProductId = isProductEdited(product) ? undefined : product._id;
  }

  function isProductEdited(product) {
    return editedProductId === product._id;
  }

  function addNewProduct(product) {
    const products = self.invoice.products || [];
    const newProduct = {
      quantity: 0,
      price: 0
    };
    _.assignIn(newProduct, product);
    products.unshift(newProduct);
    self.invoice.products = products;
    self.invoiceProductsTableParams.reload();
    _.defer(() => editProduct(newProduct));
  }
}

})();
