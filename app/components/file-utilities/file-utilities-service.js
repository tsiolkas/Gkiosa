(function () {

'use strict';

angular.module('gkiosa.app.components.fileUtilities')

.factory('gkiosaFileUtilities', gkiosaFileUtilities);

function gkiosaFileUtilities() {

  let a;

  init();

  return {
    saveSingleFile,
    readSingleFile
  };

  function init() {
    a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
  }

  function saveSingleFile(txt, fileName) {
    const blob = new Blob([txt], {type: 'octet/stream'});
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  function readSingleFile(el, onStartReadingCb, onReadFileCb) {
    el.change((e) => {
      var file = e.target.files[0];
      if (!file || !onStartReadingCb()) {
        return;
      }
      var reader = new FileReader();
      reader.onload = function(e) {
        var contents = e.target.result;
        onReadFileCb(contents);
      };
      reader.readAsText(file);
    });
  }
}

})();
