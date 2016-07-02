(function () {

'use strict';

angular.module('gkiosa.app.sections.receipts.receipt')

.controller('ReceiptController', ReceiptController);

function ReceiptController($rootScope, $state, $stateParams, gkiosaApi, gkiosaApiUtilities) {
  const self = this;

  self.vector = $stateParams.vector;
  self.isNew = $stateParams.receiptId === 'new';
  self.receiptId = self.isNew ? undefined : $stateParams.receiptId;

  self.createReceipt = createReceipt;
  self.updateReceipt = updateReceipt;
  self.deleteReceipt = deleteReceipt;

  init();

  function init() {
    if (self.receiptId) {
      findReceipt(self.receiptId);
    }
    gkiosaApi.findAllUsers()
      .then(resp => {
        self.users = resp.results;
      });
  }

  function findReceipt(id) {
    self.promiseOfreceipt = gkiosaApi.findReceipt(id).then(receipt => self.receipt = receipt);
  }

  function createReceipt(receipt) {
    receipt.vector = self.vector;
    self.promiseOfreceipt = gkiosaApi.createReceipt(receipt).then(
      receipt => {
        $state.go('receipts.receipt', {receiptId: receipt._id, vector: self.vector, name: receipt.name });
        $rootScope.$emit('gkiosa.app.components.alerts', {
          type: 'success',
          msg: `Η απόδειξη ${receipt.receiptNum} δημιουργήθηκε`,
          timeout: 5000
        });
      }
    );
  }

  function updateReceipt(receipt) {
    self.promiseOfreceipt = gkiosaApi.updateReceipt(receipt._id, receipt).then(
      () => {
        $state.go('receipts.receipt', {receiptId: receipt._id, vector: self.vector, name: receipt.name });
        $rootScope.$emit('gkiosa.app.components.alerts', {
          type: 'success',
          msg: `Η απόδειξη ${receipt.receiptNum} αποθηκεύτηκε`,
          timeout: 5000
        });
      }
    );
  }

  function deleteReceipt(receipt) {
    self.promise = gkiosaApiUtilities.deleteReceipt(receipt)
    if (self.promise) {
      self.promise.then(
        () => $state.go('receipts.all', {vector: self.vector})
      );
    }
  }
}

})();
