(function () {

'use strict';

angular.module('gkiosa.app.sections.invoices.invoice')

.controller('InvoiceController', InvoiceController);

function InvoiceController(
  $rootScope,
  $scope,
  $state,
  $stateParams,
  toastr,
  gkiosaPagination,
  gkiosaApi,
  gkiosaApiUtilities,
  gkiosaContext,
  gkiosaPdfGeneratorInvoice
) {
  let editedProductId;

  const self = this;
  self.vector = $stateParams.vector,
  self.isNew = $stateParams.invoiceId === 'new';
  self.invoiceId = $stateParams.invoiceId === 'new' ? undefined : $stateParams.invoiceId;
  self.newProduct = undefined;
  self.invoiceProductsTableParams = undefined;
  self.invoice = undefined;
  self.appInfo = undefined;
  self.ctx = gkiosaContext;

  _.assignIn(self, {
    createInvoice,
    updateInvoice,
    deleteInvoice,
    deleteProduct,
    editProduct,
    isProductEdited,
    isItemInvalid,
    isProductInvalid,
    generatePdf,
    printPdf,
    downloadPdf
  });

  init();

  function init() {
    if (self.invoiceId) {
      findInvoice(self.invoiceId);
    } else {
      gkiosaApi.findAppInfo()
        .then(appInfo => {
          self.appInfo = appInfo;
          self.invoice = gkiosaApiUtilities.createEmptyInvoice(appInfo.invoiceId);
          self.invoiceProductsTableParams = gkiosaPagination.createStaticNgTableParams(self.invoice.products);
        });
    }
    gkiosaApi.findAllUsers().then(resp => self.users = resp.results);
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
    if (!warningIfProductEdit()) {
      return;
    }
    invoice.vector = self.vector;
    self.promiseOfinvoice = gkiosaApi.createInvoice(invoice).then(
      invoice => {
        self.appInfo.increaseInvoice();
        $state.go('invoices.invoice', {invoiceId: invoice._id, vector: self.vector, name: invoice.name });
        toastr.success(`Η απόδειξη ${invoice.invoiceNum} δημιουργήθηκε`);
      }
    );
  }

  function updateInvoice(invoice) {
    if (!warningIfProductEdit()) {
      return;
    }
    self.promiseOfinvoice = gkiosaApi.updateInvoice(invoice._id, invoice)
      .then(() => {
        $state.go('invoices.invoice', {invoiceId: invoice._id, vector: self.vector, name: invoice.name });
        toastr.success(`Η απόδειξη ${invoice.invoiceNum} αποθηκεύτηκε`);
      });
  }

  function warningIfProductEdit() {
    if (editedProductId) {
      return confirm('Επεξεργάζεστε ένα προιόν, αν δεν το αποθηκέυσετε οι αλλαγές σας θα χαθούν.\nΘέλετε να συνεχίσετε?');
    }
    return true;
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

  function generatePdf() {
    gkiosaPdfGeneratorInvoice.open();
  }

  function printPdf() {
    gkiosaPdfGeneratorInvoice.print();
  }

  function downloadPdf() {
    gkiosaPdfGeneratorInvoice.download('timologio.pdf');
  }

}

})();
