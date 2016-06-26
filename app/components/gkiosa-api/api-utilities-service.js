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
    const result = confirm(`Θέλετε σίγουρα να διαγράψετε τον ${user.name}?`);
    if (result) {
      return gkiosaApi.deleteUser(user._id).then(() => {
        $rootScope.$emit('gkiosa.app.components.alerts', {
          type: 'success',
          msg: `Ο χρήστης ${user.name} διαγράφηκε`,
          timeout: 5000
        });
      });
    }
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
