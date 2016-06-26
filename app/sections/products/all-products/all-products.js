angular.module('gkiosa.app.sections.products.allProducts', [
  'ui.router'
])

.config($stateProvider => {
  $stateProvider.state('products.all', {
    url: '?vector?table',
    templateUrl: 'sections/products/all-products/all-products.html',
    controller: 'AllProductsController',
    controllerAs: 'allProductsCtrl',
    reloadOnSearch: false,
    getBreadcrumbName: params => [{ name: params.vector === 'SUPPLIERS' ? 'Προιόντα αγοράς' : 'Προιόντα πώλησης'}],
    getActiveMenuId: params => params.vector === 'SUPPLIERS' ? 'products.all.suppliers' : 'products.all.customers'
  });
});
