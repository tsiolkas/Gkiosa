(function () {

'use strict';

angular.module('gkiosa.app.sections.receipts.receipt')

.controller('ReceiptController', ReceiptController);

function ReceiptController($rootScope, $state, $stateParams, toastr, gkiosaApi, gkiosaApiUtilities, gkiosaPagination) {
  const self = this;

  self.vector = $stateParams.vector;
  self.isNew = $stateParams.receiptId === 'new';
  self.receiptId = self.isNew ? undefined : $stateParams.receiptId;
  self.appInfo = undefined;

  self.createReceipt = createReceipt;
  self.updateReceipt = updateReceipt;
  self.deleteReceipt = deleteReceipt;

  init();

  function init() {
    if (self.receiptId) {
      findReceipt(self.receiptId);
    } else {
      gkiosaApi.findAppInfo()
        .then(appInfo => {
          self.appInfo = appInfo;
          self.receipt = gkiosaApiUtilities.createEmptyReceipt(appInfo.receiptId);
        });
    }
    gkiosaApi.findAllUsers().then(resp => self.users = resp.results);
  }

  function findReceipt(id) {
    self.promiseOfreceipt = gkiosaApi.findReceipt(id).then(receipt => self.receipt = receipt);
  }

  function createReceipt(receipt) {
    receipt.vector = self.vector;
    self.promiseOfreceipt = gkiosaApi.createReceipt(receipt).then(
      receipt => {
        self.appInfo.increaseReceipt();
        $state.go('receipts.receipt', {receiptId: receipt._id, vector: self.vector, name: receipt.name });
        toastr.success(`Η απόδειξη ${receipt.receiptNum} δημιουργήθηκε`);
      }
    );
  }

  function updateReceipt(receipt) {
    self.promiseOfreceipt = gkiosaApi.updateReceipt(receipt._id, receipt).then(
      () => {
        $state.go('receipts.receipt', {receiptId: receipt._id, vector: self.vector, name: receipt.name });
        toastr.success(`Η απόδειξη ${receipt.receiptNum} αποθηκεύτηκε`);
      }
    );
  }

  function deleteReceipt(receipt) {
    self.promise = gkiosaApiUtilities.deleteReceipt(receipt);
    if (self.promise) {
      self.promise.then(
        () => $state.go('receipts.all', {vector: self.vector})
      );
    }
  }
}

})();
