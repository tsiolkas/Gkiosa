(function () {

'use strict';

angular.module('gkiosa.app.sections.products.product')

.controller('ProductController', ProductController);

function ProductController($rootScope, $state, $stateParams, toastr, gkiosaApi, gkiosaApiUtilities) {
  const self = this;

  self.vector = $stateParams.vector;
  self.isNew = $stateParams.productId === 'new';
  self.productId = self.isNew ? undefined : $stateParams.productId;

  self.createProduct = createProduct;
  self.updateProduct = updateProduct;
  self.deleteProduct = deleteProduct;

  init();

  function init() {
    if (self.productId) {
      findProduct(self.productId);
    } else {
      self.product = gkiosaApiUtilities.createEmptyProduct();
    }
  }

  function findProduct(id) {
    self.promiseOfproduct = gkiosaApi.findProduct(id).then(product => self.product = product);
  }

  function createProduct(product) {
    product.vector = self.vector;
    self.promiseOfproduct = gkiosaApi.createProduct(product).then(
      product => {
        $state.go('products.product', {productId: product._id, vector: self.vector, name: product.name });
        toastr.success(`Το προιόν ${product.name} δημιουργήθηκε`);
      }
    );
  }

  function updateProduct(product) {
    self.promiseOfproduct = gkiosaApi.updateProduct(product._id, product).then(
      () => {
        $state.go('products.product', {productId: product._id, vector: self.vector, name: product.name });
        toastr.success(`Το προιόν ${product.name} αποθηκεύτηκε`);
      }
    );
  }

  function deleteProduct(product) {
    self.promise = gkiosaApiUtilities.deleteProduct(product)
    if (self.promise) {
      self.promise.then(
        () => $state.go('products.all', {vector: self.vector})
      );
    }
  }
}

})();
