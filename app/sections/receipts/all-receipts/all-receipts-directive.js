(function () {

'use strict';

angular.module('gkiosa.app.sections.receipts')

.controller('AllReceiptsController', AllReceiptsController);

function AllReceiptsController(
  $scope,
  $state,
  $stateParams,
  gkiosaApi,
  gkiosaApiUtilities,
  gkiosaPagination
) {
  const self = this;

  self.vector = $stateParams.vector;
  self.receiptsTableParams = gkiosaPagination.createNgTableParams(self, 'Receipts', 'name');
  self.deleteReceipt = deleteReceipt;
  self.editReceipt = editReceipt;

  init();

  function init() {
    gkiosaApi.findAllUsers().then(resp => {
      return $scope.allUsers = resp.results;
    });
  }

  function deleteReceipt(receipt) {
    self.promise = gkiosaApiUtilities.deleteReceipt(receipt).then(() => _.defer(() => $state.reload()));
  }

  function editReceipt(receipt) {
    $state.go('receipts.receipt', {receiptId: receipt._id, vector: self.vector, name: receipt.receiptNum });
  }
}

})();
