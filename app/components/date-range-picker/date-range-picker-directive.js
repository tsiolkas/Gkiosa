(function () {

'use strict';

angular.module('gkiosa.app.components.dateRangePicker')

.directive('gksDateRangePicker', dateRangePicker);

function dateRangePicker() {
  return {
    restrict: 'E',
    template: `
      <div class="pull-right reportrange" style="background: #fff; cursor: pointer; padding: 5px 10px; border: 1px solid #ccc; width: 100%">
          <i class="glyphicon glyphicon-calendar fa fa-calendar"></i>&nbsp;
          <span></span> <b class="caret"></b>
      </div>
    `,
    scope: {
      range: '='
    },
    bindToController: true,
    controller: DateRangePickerController,
    controllerAs: 'dateRangePickerCtrl'
  };
}

function DateRangePickerController($scope, $element) {
  const self = this;
  const dateEl = $element.find('.reportrange');

  init();

  function init() {
    const start = moment().subtract(29, 'days');
    const end = moment();

    dateEl.daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
           'τελευταίες 7 μέρες': [moment().subtract(6, 'days'), moment()],
           'τελευταίες 30 μέρες': [moment().subtract(29, 'days'), moment()],
           'τρέχων μήνας': [moment().startOf('month'), moment().endOf('month')],
           'τελευταίος μήνας': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, dateSelected);

    dateSelected(start, end);

    renameDateNames();

    $scope.$watch(
      () => self.range,
      (range) => {
        if (range) {
          dateEl.data('daterangepicker').setStartDate(new Date(range[0]));
          dateEl.data('daterangepicker').setEndDate(new Date(range[1]));
          updateDateSpan(moment(range[0]), moment(range[1]));
        }
      }
    );
  }

  function updateDateSpan(start, end) {
    $element.find('.reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
  }

  function dateSelected(start, end) {
    updateDateSpan(start, end);
    self.range = [start.toDate().getTime(), end.toDate().getTime()];
    if (!$scope.$parent.$$phase) {
      $scope.$parent.$digest();
    }
  }

  function renameDateNames() {
    _.defer(() => {
      $('.daterangepicker [data-range-key="Custom Range"]').text('Άλλη');
      $('.daterangepicker .applyBtn').text('Εφαρμογή');
      $('.daterangepicker .cancelBtn').text('Ακύρωση');
    });
  }
}

})();
