(function () {

'use strict';

angular.module('gkiosa.app.components.filters')

.filter('gksEuro', function($filter) {
  const currencyFilter = $filter('currency');
  return amount => currencyFilter(amount, '', 2);
});

})();
