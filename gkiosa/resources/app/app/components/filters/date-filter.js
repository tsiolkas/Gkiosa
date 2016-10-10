(function () {

'use strict';

angular.module('gkiosa.app.components.filters')

.filter('gksDate', function($filter) {
  const dateFilter = $filter('date');
  return function(date, showTime) {
    const time = _.isNumber(date) ? new Date(date) : date;
    return dateFilter(time, 'd/M/yyyy' + (showTime ? ' HH:mm:ss' : ''));
  };
});

})();
