(function () {

'use strict';

angular.module('gkiosa.app.components.gkiosaApi')

.factory('gkiosaApi', gkiosaApi);

function gkiosaApi($q) {

  const Datastore = getDBDriver();
  const db = createDbs();
  var dbNames = ['users']; // createDbs does not bind the variable

  // insertFakeUsers();

  return {
    findUser,
    findAllUsers,
    createUser,
    updateUser,
    deleteUser
  };

  function getDBDriver() {
    if (typeof require !== 'undefined') {
      return require('nedb');
    } else if (typeof Nedb !== 'undefined') {
      return Nedb;
    } else {
      throw new Error('Cannot find database');
    }
  }

  function createDbs() {
    const db = {};
    _.forEach(['users'], dbName => db[dbName] = new Datastore({ filename: `db/${dbName}.db`, autoload: true }));
    return db;
  }

  function deferredJob(job) {
    const deferred = $q.defer();
    job(deferred);
    return deferred.promise;
  }

  function respHandle(deferred, successCb) {
    return (err, resp) => err ? deferred.reject(err) : deferred.resolve(successCb ? successCb(resp) : resp);
  }

  function findUser(id) {
    return deferredJob(deferred => db.users.find({ _id: id }, respHandle(deferred, users => _.first(users))));
  }

  function findAllUsers(find, pagination, sort) {
    return $q.all([
      deferredJob(countDeferred => db.users.count({}, respHandle(countDeferred))),
      deferredJob(findDeferred => {
        const cursor = db.users.find(find || {});
        if (_.isObject(sort)) {
          cursor.sort(sort);
        }
        if (_.isObject(pagination)) {
          cursor.skip((pagination.page - 1) * pagination.count);
          cursor.limit(pagination.count);
        }
        cursor.exec(respHandle(findDeferred));
      })
    ])
    .then(results => {
        return {
          total: results[0],
          results: results[1]
        };
    });
  }

  function createUser(user) {
    return deferredJob(deferred => db.users.insert(user, respHandle(deferred, user => user)));
  }

  function updateUser(id, user) {
    return deferredJob(deferred => db.users.update({ _id: id }, user, {}, respHandle(deferred, user => user)));
  }

  function deleteUser(id) {
    return deferredJob(deferred => db.users.remove({ _id: id }, {}, respHandle(deferred, numRemoved => numRemoved)));
  }

  function insertFakeUsers() {
    const users = _.range(100).map(idx => {
      return {
        name: `name${idx}`,
        code: `code${idx}`,
        debt: 100*idx,
        vat: `vat${idx}`,
        taxAuthority: `taxAuthority${idx}`,
        address: `address${idx}`,
        profession: `profession${idx}`
      };
    });

    createUser(users);
  }
}

})();
