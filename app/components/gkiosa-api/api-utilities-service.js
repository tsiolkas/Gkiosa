(function () {

'use strict';

angular.module('gkiosa.app.components.gkiosaApi')

.factory('gkiosaApiUtilities', gkiosaApiUtilities);

function gkiosaApiUtilities($rootScope, gkiosaApi) {

  return {
    deleteUser,
    deleteProduct
  };

  function deleteUser(user) {
    return gkiosaApi.getUserDependencies(user._id).then(dependencies => {
      let result = true;
      if (dependencies) {
        let msg = '';
        if (!_.isEmpty(dependencies.invoices)) {
          msg += 'Τα τιμολόγια ' + dependencies.invoices.map(inv => inv.invoiceNum).join(', ') + ', ';
        }
        if (!_.isEmpty(dependencies.receipts)) {
          msg += 'οι αποδείξεις ' + dependencies.receipts.map(inv => inv.receiptNum).join(', ') + ', ';
        }
        msg += `εξαρτώνται απο τον ${user.name}.\nΕιστε σίγουροι ότι θέλετε να τον διαγράψεται?`;
        result = confirm(msg);
      }
      if (result) {
        return gkiosaApi.deleteUser(user._id).then(() => {
          $rootScope.$emit('gkiosa.app.components.alerts', {
            type: 'success',
            msg: `Ο χρήστης ${user.name} διαγράφηκε`,
            timeout: 5000
          });
        });
      }
    });
  }

  function deleteProduct(product) {
    const result = confirm(`Θέλετε σίγουρα να διαγράψετε το προιόν ${product.name}?`);
    if (result) {
      return gkiosaApi.deleteProduct(product._id).then(() => {
        $rootScope.$emit('gkiosa.app.components.alerts', {
          type: 'success',
          msg: `Το προιόν ${product.name} διαγράφηκε`,
          timeout: 5000
        });
      });
    }
  }

}

})();
