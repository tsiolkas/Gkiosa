(function () {

'use strict';

angular.module('gkiosa.app.sections.users')

.controller('AllUsersController', AllUsersController);

function AllUsersController(
  $state,
  $stateParams,
  gkiosaApiUtilities,
  gkiosaPagination
) {
  const self = this;

  self.vector = $stateParams.vector;
  self.usersTableParams = gkiosaPagination.createNgTableParams(self, 'Users', 'name');
  self.deleteUser = deleteUser;
  self.editUser = editUser;

  function deleteUser(user) {
    self.promise = gkiosaApiUtilities.deleteUser(user);
    self.promise && self.promise.then(() => _.defer(() => $state.reload()));
  }

  function editUser(user) {
    $state.go('users.user', {userId: user._id, vector: self.vector, name: user.name });
  }
}

})();
