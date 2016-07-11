(function () {

'use strict';

angular.module('gkiosa.app.sections.invoices.invoice')

.controller('InvoiceController', InvoiceController);

function InvoiceController($rootScope, $scope, $state, $stateParams, toastr, gkiosaPagination, gkiosaApi, gkiosaApiUtilities) {
  const self = this;

  let editedProductId;
  _.assignIn(self, {
    vector: $stateParams.vector,
    isNew: $stateParams.invoiceId === 'new',
    invoiceId: $stateParams.invoiceId === 'new' ? undefined : $stateParams.invoiceId,
    newProduct: undefined,
    invoiceProductsTableParams: undefined,
    invoice: undefined,

    createInvoice,
    updateInvoice,
    deleteInvoice,
    deleteProduct,
    editProduct,
    isProductEdited,
    isItemInvalid,
    isProductInvalid
  });

  init();

  function init() {
    if (self.invoiceId) {
      findInvoice(self.invoiceId)
    } else {
      self.invoice = gkiosaApiUtilities.createEmptyInvoice();
      self.invoiceProductsTableParams = gkiosaPagination.createStaticNgTableParams(self.invoice.products);
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
    const clearedInvoice = getClearProductsHashkey(invoice);
    self.promiseOfinvoice = gkiosaApi.createInvoice(clearedInvoice).then(
      invoice => {
        $state.go('invoices.invoice', {invoiceId: invoice._id, vector: self.vector, name: invoice.name });
        toastr.success(`Η απόδειξη ${invoice.invoiceNum} δημιουργήθηκε`);
      }
    );
  }

  function updateInvoice(invoice) {
    const clearedInvoice = getClearProductsHashkey(invoice);
    self.promiseOfinvoice = gkiosaApi.updateInvoice(clearedInvoice._id, clearedInvoice)
      .then(() => {
        $state.go('invoices.invoice', {invoiceId: clearedInvoice._id, vector: self.vector, name: clearedInvoice.name });
        toastr.success(`Η απόδειξη ${clearedInvoice.invoiceNum} αποθηκεύτηκε`);
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

  function isProductInvalid(product) {
    return _.some(product, _.isNil);
  }

  function isItemInvalid() {
    return $scope.formItem.$invalid || _.some(self.invoice.products, isProductInvalid)
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

  // exclude angular's $$hashKey
  function getClearProductsHashkey(invoice) {
    const clearedInvoice = _.assignIn({}, invoice);
    clearedInvoice.products = _.each(clearedInvoice.products, product => {
      delete product.$$hashKey;
    });
    return clearedInvoice;
  }
}

})();
