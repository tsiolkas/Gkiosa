(function () {

'use strict';

angular.module('gkiosa.app.components.alerts')

.directive('gkiosaAlerts', gkiosaAlerts);

/* @ngInject */
function gkiosaAlerts() {
  return {
    restrict: 'E',
    templateUrl: 'components/alerts/alerts.html',
    scope: {},
    bindToController: true,
    controller: AlertsController,
    controllerAs: 'alertsCtrl'
  };
}

function AlertsController($rootScope, $timeout) {
  const self = this;

  self.alerts = [];
  self.closeAlert = closeAlert;

  function closeAlert(id) {
    _.remove(self.alerts, alert => alert.id === id);
  }

  function addAlert(alert) {
    const id = _.uniqueId('alert_');
    alert.id = id;
    self.alerts.push(alert);
    if (alert.timeout) {
      $timeout(() => closeAlert(id), alert.timeout);
    }
  }

  $rootScope.$on('gkiosa.app.components.alerts', (evt, alert) => {
    addAlert(alert);
  });
}

})();
