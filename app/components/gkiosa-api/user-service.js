(function () {

'use strict';

angular.module('gkiosa.app.components.gkiosaApi')

.factory('gkiosaUser', gkiosaUser);

function gkiosaUser($rootScope, gkiosaApi) {

  return {
    deleteUser: deleteUser
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
}

})();
