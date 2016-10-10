angular.module('gkiosa.app.sections.products.product', [
  'ui.router'
])

.config($stateProvider => {
  $stateProvider.state('products.product', {
    url: '/:productId?vector?name',
    templateUrl: 'sections/products/product/product.html',
    controller: 'ProductController',
    controllerAs: 'productCtrl',
    reloadOnSearch: false,
    getBreadcrumbName: params => [
        {
          sref: `products.all({vector: '${params.vector}'})`,
          name: params.vector === 'SUPPLIERS' ? 'Προιόντα αγοράς' : 'Προιόντα πώλησης'
        },
        {
          name: params.productId === 'new' ? 'Δημιουργία νέου' : params.name
        }
      ],
    getActiveMenuId: params => params.vector === 'SUPPLIERS' ? 'products.all.suppliers' : 'products.all.customers'
  });
});
