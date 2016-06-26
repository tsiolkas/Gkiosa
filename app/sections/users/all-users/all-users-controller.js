(function () {

'use strict';

angular.module('gkiosa.app.sections.users')

.controller('AllUsersController', AllUsersController);

function AllUsersController($rootScope, $state, $stateParams, NgTableParams, gkiosaApi, gkiosaUser) {
  const self = this;

  self.vector = $stateParams.vector;
  self.usersTableParams = createUsersNgTableParams();
  self.deleteUser = deleteUser;
  self.editUser = editUser;

  function deleteUser(user) {
    self.promise = gkiosaUser.deleteUser(user);
  }

  function editUser(user) {
    $state.go('users.user', {userId: user._id, vector: self.vector, name: user.name });
  }

  function createUsersNgTableParams() {
    const tableParams = urlToTableParams();
    const tableSettings = {
      filterDelay: 300,
      getData: params => {
        addTableParamsToUrl(params.parameters());
        const find = {};
        _.transform(params.filter(), (result, value, key) => {
          if (!_.isNil(value)) {
            result[key] = _.isString(value) ? new RegExp(value) : value
          }
        }, find);
        const pagination = {
          count: params.count(),
          page: params.page()
        };
        const sorting = _.mapValues(params.sorting(), sort => sort === 'asc' ? 1 : -1);
        const promiseOfUsers = gkiosaApi.findAllUsers(find, pagination, sorting).then(resp => {
          params.total(resp.total);
          const users = resp.results;
          self.users = users;
          return users;
        });
        self.promise = promiseOfUsers;
        return promiseOfUsers;
      }
    };
    return new NgTableParams(tableParams, tableSettings);
  }

  function urlToTableParams() {
    const params = $stateParams.table && JSON.parse(decodeURI($stateParams.table)) || {};
    const defaultParams = {
      page: 1, // show first page
      count: 10, // count per page
      sorting: { name: "asc" }
    };
    return _.defaults(params, defaultParams);
  }

  function addTableParamsToUrl(tableParams) {
    const urlParam = encodeURI(JSON.stringify(tableParams));
    $stateParams.table = urlParam;
    $state.transitionTo($state.current, $stateParams);
  }
}

})();
