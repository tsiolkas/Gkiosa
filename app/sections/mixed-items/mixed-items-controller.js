(function () {

'use strict';

angular.module('gkiosa.app.sections.mixedItems')

.controller('MixedItemsController', MixedItemsController);

function MixedItemsController($scope, gkiosaApi, gkiosaPagination) {
  const self = this;

  self.promise = undefined;
  self.mixedItemsTable = undefined;
  self.allUsers = undefined;
  self.userId = undefined;
  self.date = undefined;

  init();

  function init() {
    const updateMixedOnChange = (func) => $scope.$watch(func, updateMixed);
    updateMixedOnChange(() => self.userId);
    updateMixedOnChange(() => self.date);

    gkiosaApi.findAllUsers().then(resp => {
      return self.allUsers = resp.results;
    });
  }

  function updateMixed() {
    if (!self.userId || !self.date) {
      return;
    }
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
}

})();
