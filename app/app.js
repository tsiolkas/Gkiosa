angular.module('gkiosa.app', [
  'ngAnimate',
  'toastr',
  'ngSanitize',
  'ui.select',
  'ui.bootstrap',
  'ui.router',
  'ngTable',
  'cgBusy',
  'gkiosa.app.sections.dashboard',
  'gkiosa.app.sections.users',
  'gkiosa.app.sections.users.user',
  'gkiosa.app.sections.users.allUsers',
  'gkiosa.app.sections.products',
  'gkiosa.app.sections.products.product',
  'gkiosa.app.sections.products.allProducts',
  'gkiosa.app.sections.receipts',
  'gkiosa.app.sections.receipts.receipt',
  'gkiosa.app.sections.receipts.allReceipts',
  'gkiosa.app.sections.invoices',
  'gkiosa.app.sections.invoices.invoice',
  'gkiosa.app.sections.invoices.allInvoices',
  'gkiosa.app.sections.mixedItems',
  'gkiosa.app.components.filters',
  'gkiosa.app.components.gkiosaApi',
  'gkiosa.app.components.pagination',
  'gkiosa.app.components.charts',
  'gkiosa.app.components.dateRangePicker'
])

.value('cgBusyDefaults', {
  templateUrl: 'components/theming/cg-busy-template.html',
  minDuration: 200
})

.controller('AppController', AppController)

.config($urlRouterProvider => {
  $urlRouterProvider.otherwise('/');
})

.config(toastrConfig => {
  toastrConfig.autoDismiss = false;
  toastrConfig.closeButton = true;
  toastrConfig.closeHtml = "<button>&times;</button>";
  toastrConfig.customTemplate = false;
  toastrConfig.extendedTimeOut = "5000";
  toastrConfig.html = true;
  toastrConfig.allowHtml = true;
  toastrConfig.maxOpened = 0;
  toastrConfig.newestOnTop = true;
  toastrConfig.position = "toast-top-right";
  toastrConfig.preventDuplicates = false;
  toastrConfig.preventOpenDuplicates = false;
  toastrConfig.progressBar = true;
  toastrConfig.tapToDismiss = true;
  toastrConfig.timeOut = "5000";
})

.run(NgTableParams => {
  NgTableParams.prototype.customFilters = {
    boolean: (filters, key) => {
      const val = filters[key];
      filters[key] = val === undefined ? true : undefined;
    }
  };
})

.value('gkiosaConfig', {
  technicalContact: 'john.apostolidi@gmail.com',
  technicalName: 'Γιάννης Αποστολίδης'
});

function AppController($rootScope, $scope, $state) {
  const self = this;

  self.sidebarMenu = [
    {
      sref: "dashboard",
      name: 'Πίνακας ελέγχου',
      icon: 'fa-th-large',
      id: 'dashboard'
    },
    {
      sref: "mixedItems",
      name: 'Μικτά',
      icon: 'fa-th-large',
      id: 'mixedItems'
    },
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
      name: 'Αποδείξεις πώλησης',
      icon: 'fa-th-large',
      id: 'receipts.all.customers'
    },
    {
      sref: "receipts.all({vector: 'SUPPLIERS'})",
      name: 'Αποδείξεις αγοράς',
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
    _.delay(() => $state.reload(), 200);
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
