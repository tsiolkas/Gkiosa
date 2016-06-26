(function () {

'use strict';

angular.module('gkiosa.app.sections.users')

.controller('UserController', UserController);

function UserController($rootScope, $state, $stateParams, gkiosaApi, gkiosaApiUtilities) {
  const self = this;

  self.vector = $stateParams.vector;
  self.isNew = $stateParams.userId === 'new';
  self.userId = self.isNew ? undefined : $stateParams.userId;

  self.createUser = createUser;
  self.updateUser = updateUser;
  self.deleteUser = deleteUser;

  init();

  function init() {
    if (self.userId) {
      findUser(self.userId);
    }
  }

  function findUser(id) {
    self.promiseOfUser = gkiosaApi.findUser(id).then(user => self.user = user);
  }

  function createUser(user) {
    user.vector = self.vector;
    self.promiseOfUser = gkiosaApi.createUser(user).then(
      user => {
        $state.go('users.user', {userId: user._id, vector: self.vector, name: user.name });
        $rootScope.$emit('gkiosa.app.components.alerts', {
          type: 'success',
          msg: `Ο χρήστης ${user.name} δημιουργήθηκε`,
          timeout: 5000
        });
      }
    );
  }

  function updateUser(user) {
    self.promiseOfUser = gkiosaApi.updateUser(user._id, user).then(
      () => {
        $state.go('users.user', {userId: user._id, vector: self.vector, name: user.name });
        $rootScope.$emit('gkiosa.app.components.alerts', {
          type: 'success',
          msg: `Ο χρήστης ${user.name} αποθηκεύτηκε`,
          timeout: 5000
        });
      }
    );
  }

  function deleteUser(user) {
    self.promise = gkiosaApiUtilities.deleteUser(user)
    if (self.promise) {
      self.promise.then(
        () => $state.go('users.all', {vector: self.vector})
      );
    }
  }
}

})();
