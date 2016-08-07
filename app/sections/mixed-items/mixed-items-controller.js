(function () {

'use strict';

angular.module('gkiosa.app.sections.mixedItems')

.controller('MixedItemsController', MixedItemsController);

function MixedItemsController($scope, $state, $stateParams, gkiosaPdfGeneratorMixedItems, gkiosaApi, gkiosaPagination) {
  const self = this;

  const dto = (new Date).getTime();
  const dfrom = dto - (1000 * 60 * 60 * 24 * 30); // 1 month
  const dateRange = [dfrom, dto];

  self.promise = undefined;
  self.mixedItemsTable = undefined;
  self.allUsers = undefined;
  self.userId = undefined;
  self.date = dateRange;
  self.generatePdf = generatePdf;
  self.printPdf = printPdf;

  self.openItem = openItem;

  init();

  function init() {
    const updateMixedOnChange = (func) => $scope.$watch(func, updateMixed);
    updateMixedOnChange(() => self.userId);
    updateMixedOnChange(() => self.date);

    urlToParams();

    gkiosaApi.findAllUsers().then(resp => self.allUsers = resp.results);
  }

  function updateMixed() {
    if (!self.userId || !self.date) {
      return;
    }

    paramsToUrl();

    const dateQ = {
      $lte: new Date(self.date[1]),
      $gte: new Date(self.date[0])
    };
    self.promise = gkiosaApi.getMixedItems({
      'user._id': self.userId,
      'date': dateQ
    });
    self.promise.then(mixedItems => self.mixedItemsTable = gkiosaPagination.createStaticNgTableParams(mixedItems));
  }

  function generatePdf() {
    gkiosaPdfGeneratorMixedItems.open(self.mixedItemsTable.data);
  }

  function printPdf() {
    gkiosaPdfGeneratorMixedItems.print(self.mixedItemsTable.data);
  }

  function openItem(item) {
    if (item.type.id === 'invoice') {
      $state.go('invoices.invoice', {invoiceId: item.raw._id, vector: item.raw.vector, name: item.name });
    } else {
      $state.go('receipts.receipt', {receiptId: item.raw._id, vector: item.raw.vector, name: item.name });
    }
  }

  function urlToParams() {
    if ($stateParams.table) {
      const table = JSON.parse(decodeURI($stateParams.table)) || {};
      self.userId = table.userId;
      self.date = table.date;
    }
  }

  function paramsToUrl() {
    const params = {
      userId: self.userId,
      date: self.date
    };
    const urlParam = encodeURI(JSON.stringify(params));
    $stateParams.table = urlParam;
    $state.transitionTo($state.current, $stateParams);
  }
}

})();
