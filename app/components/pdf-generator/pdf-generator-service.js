(function () {

'use strict';

angular.module('gkiosa.app.components.pdfGenerator')

.factory('gkiosaPdfGenerator', gkiosaPdfGenerator);

function gkiosaPdfGenerator() {
  return {
    generatePdfMethods
  };

  function generatePdfMethods(ddGenerator) {
    return {
      open: (data) => pdfMake.createPdf(ddGenerator(data)).open(),
      print: (data) => pdfMake.createPdf(ddGenerator(data)).print(),
      download: (data, filename) => pdfMake.createPdf(ddGenerator(data)).download(filename)
    };
  }
}

})();
