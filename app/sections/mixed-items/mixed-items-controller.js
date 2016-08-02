(function () {

'use strict';

angular.module('gkiosa.app.sections.mixedItems')

.controller('MixedItemsController', MixedItemsController);

function MixedItemsController($scope, $state, $stateParams, gkiosaApi, gkiosaPagination) {
  const self = this;

  self.promise = undefined;
  self.mixedItemsTable = undefined;
  self.allUsers = undefined;
  self.userId = undefined;
  self.date = undefined;

  self.openItem = openItem;

  init();

  function init() {
    const updateMixedOnChange = (func) => $scope.$watch(func, updateMixed);
    updateMixedOnChange(() => self.userId);
    updateMixedOnChange(() => self.date);

    urlToParams();

    gkiosaApi.findAllUsers().then(resp => {
      return self.allUsers = resp.results;
    });
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
    self.promise.then(mixedItems => {
      self.mixedItemsTable = gkiosaPagination.createStaticNgTableParams(mixedItems);
    });
  }

  function openItem(item) {
    if (item.type.id === 'invoice') {
      $state.go('invoices.invoice', {invoiceId: item.raw._id, vector: item.raw.vector, name: item.name });
    } else {
      $state.go('receipts.receipt', {receiptId: item.raw._id, vector: item.raw.vector, name: item.name });
    }
  }

  function urlToParams() {
    const table = $stateParams.table && JSON.parse(decodeURI($stateParams.table)) || {};
    self.userId = table.userId;
    self.date = table.date;
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