angular.module('gkiosa.app', [
  'ui.bootstrap',
  'ui.router',
  'ngTable',
  'cgBusy',
  'gkiosa.app.sections.users',
  'gkiosa.app.sections.users.user',
  'gkiosa.app.sections.users.allUsers',
  'gkiosa.app.sections.products',
  'gkiosa.app.sections.products.product',
  'gkiosa.app.sections.products.allProducts',
  'gkiosa.app.components.alerts',
  'gkiosa.app.components.gkiosaApi',
  'gkiosa.app.components.pagination'
])

.value('cgBusyDefaults', {
  templateUrl: 'components/theming/cg-busy-template.html',
  minDuration: 200
})

.controller('AppController', AppController)

.config($urlRouterProvider => {
  $urlRouterProvider.otherwise('/users');
});

function AppController($rootScope, $scope, $state) {
  const self = this;

  self.sidebarMenu = [
    {
      sref: "users.all({vector: 'CUSTOMERS'})",
      name: 'Πελάτες',
      icon: 'fa-th-large',
      id: 'users.all.customers'
    },
    {
      sref: "users.all({vector: 'SUPPLIERS'})",
      name: 'Προμηθευτές',
      icon: 'fa-th-large',
      id: 'users.all.suppliers'
    },
    {
      sref: "invoices.all({vector: 'CUSTOMERS'})",
      name: 'Τιμολόγια πώλησης',
      icon: 'fa-th-large',
      id: 'invoices.all.customers'
    },
    {
      sref: "invoices.all({vector: 'SUPPLIERS'})",
      name: 'Τιμολόγια αγοράς',
      icon: 'fa-th-large',
      id: 'invoices.all.suppliers'
    },
    {
      sref: "receipts.all({vector: 'CUSTOMERS'})",
      name: 'Απόδειξη πώλησης',
      icon: 'fa-th-large',
      id: 'receipts.all.customers'
    },
    {
      sref: "receipts.all({vector: 'SUPPLIERS'})",
      name: 'Απόδειξη αγοράς',
      icon: 'fa-th-large',
      id: 'receipts.all.suppliers'
    },
    {
      sref: "products.all({vector: 'CUSTOMERS'})",
      name: 'Προιόντα πώλησης',
      icon: 'fa-th-large',
      id: 'products.all.customers'
    },
    {
      sref: "products.all({vector: 'SUPPLIERS'})",
      name: 'Προιόντα αγοράς',
      icon: 'fa-th-large',
      id: 'products.all.suppliers'
    }
  ];
  self.sidebarMenuClicked = sidebarMenuClicked;
  self.historyGoBack = historyGoBack;
  self.historyGoForward = historyGoForward;

  $rootScope.$on("$stateChangeStart", onStateChangeStart);

  function sidebarMenuClicked() {
    _.defer(() => $state.reload());
  }

  function onStateChangeStart(event, toState, toParams, fromState, fromParams) {
    self.breadcrumb = toState.getBreadcrumbName(toParams);
    self.activeSidebarMenuId = toState.getActiveMenuId(toParams);
  }

  function historyGoBack() {
    window.history.back();
    _.defer(() => $state.reload());
  }

  function historyGoForward() {
    window.history.forward();
    _.defer(() => $state.reload());
  }
};
