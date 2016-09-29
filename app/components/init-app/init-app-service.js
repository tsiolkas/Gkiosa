(function () {

'use strict';

angular.module('gkiosa.app.components.initApp')

.factory('gkiosaInitApp', gkiosaInitApp);

function gkiosaInitApp(gkiosaApi) {

  return {
    init
  };

  function init() {
    gkiosaApi.findAppInfo()
      .then(initAppIfFirstTime);
  }

  function initAppIfFirstTime(appInfo) {
    if (!appInfo) {
      const initialAppInfo = createAppInfo();
      gkiosaApi.createAppInfo(initialAppInfo);
    }
  }

  function createAppInfo() {
    return {
      invoiceId: 1,
      receiptId: 1
    };
  }
}

})();
