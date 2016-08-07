(function () {

'use strict';

angular.module('gkiosa.app.components.pdfGenerator')

.factory('gkiosaPdfGeneratorMixedItems', gkiosaPdfGeneratorMixedItems);

function gkiosaPdfGeneratorMixedItems(gkiosaPdfGenerator) {
  return gkiosaPdfGenerator.generatePdfMethods(generateDD);

  function generateDD(midexItems) {
    const userNames = _.map(midexItems, m => `Όνομα ${m.name}, Σύνολο ${m.getTotalPrice()}`);
    const dd = {
      content: userNames
    };
    return dd;
  }
}

})();
