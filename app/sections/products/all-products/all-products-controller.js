(function () {

'use strict';

angular.module('gkiosa.app.sections.products')

.controller('AllProductsController', AllProductsController);

function AllProductsController(
  $state,
  $stateParams,
  gkiosaApiUtilities,
  gkiosaPagination
) {
  const self = this;

  self.vector = $stateParams.vector;
  self.productsTableParams = gkiosaPagination.createNgTableParams(self, 'Products', 'name');
  self.deleteProduct = deleteProduct;
  self.editProduct = editProduct;

  function deleteProduct(product) {
    self.promise = gkiosaApiUtilities.deleteProduct(product).then(() => _.defer(() => $state.reload()));
  }

  function editProduct(product) {
    $state.go('products.product', {productId: product._id, vector: self.vector, name: product.name });
  }
}

})();
