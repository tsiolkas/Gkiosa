(function () {

'use strict';

angular.module('gkiosa.app.components.context')

.factory('gkiosaContext', gkiosaContext);

function gkiosaContext() {
  let runningContext;

  init();

  return {
    isBrowser,
    isDesktop,
    getRunningContext
  };

  function init() {
    if (typeof require !== 'undefined') {
      runningContext = 'desktop';
    } else if (typeof Nedb !== 'undefined') {
      runningContext = 'browser';
    } else {
      throw new Error('Cannot identify the running context');
    }
  }

  function isBrowser() {
    return getRunningContext() === 'browser';
  }

  function isDesktop() {
    return getRunningContext() === 'desktop';
  }

  function getRunningContext() {
    return runningContext;
  }

}

})();
