(function () {

'use strict';

angular.module('gkiosa.app.components.pdfGenerator')

.factory('gkiosaPdfGeneratorInvoice', gkiosaPdfGeneratorInvoice);

function gkiosaPdfGeneratorInvoice($filter, gkiosaPdfGenerator) {
  const gksDate = $filter('gksDate');
  const gksEuro = $filter('gksEuro');

  return gkiosaPdfGenerator.generatePdfMethods(generateDD);

  function generateDD() {

    const header = createHeader();
    const userInfo = createUserInfo();
    const content = createContent();

    const dd = {
      content: [
        header,
        userInfo//,
        // content
      ]
    };

    return dd;
  }

  function createHeader() {
    return {
      columns: [
        {
          text: 'ΤΙΜΟΛΟΓΙΟ - ΔΕΛΤΙΟ ΑΠΟΣΤΟΛΗΣ',
          width: 200
        },
        {
          text: '169    11/23/2012',
          width: 200
        }
      ]
    };
  }

  function createUserInfo() {
    return {
      table: {
        widths: ['*', '*', '*', '*'],
        body: [
          [ 'Μαυροπουλος', 'EYROCATERING AE', 'ΕΜΠΟΡΙΟ', 'Δ50'],
          [ 'ΡΕΝΤΗΣ', '2102447583', '099004349', 'ΜΟΣΧΑΤΟΥ']
        ]
      },
      layout: 'noBorders'
    };
  }

  function createContent() {

  }

}

})();


// playground requires you to assign document definition to a variable called dd

// var dd = {
//   content: [
//     {
//         table: {
//         body: [
//             [
//               { text: 'Κωδικός', style: 'tableHeader'},
//               { text: 'Όνομα', style: 'tableHeader'},
//               { text: 'Ποσότητα', style: 'tableHeader'},
//               { text: 'Τιμή', style: 'tableHeader'},
//               { text: 'Σύνολο', style: 'tableHeader'},
//               { text: 'Φ.Π.Α.', style: 'tableHeader'},
//               { text: 'Σύνολο Φ.Π.Α', style: 'tableHeader'}
//             ],
//             [
//               'Π21212',
//               'ROSSO ΚΛΟΥΒΑ ΣΑΚΟΥΛΑ Χ12',
//               '240',
//               '0.3',
//               '72',
//               '13%',
//               '9.36'
//             ]
//         ]},
//           layout: {
//             hLineWidth: function(i, node) {
//               return (i === 0 || i === 1 || i === node.table.body.length) ? 2 : 1;
//             },
//             vLineWidth: function(i, node) {
//               return (i === 0 || i === node.table.widths.length) ? 2 : 1;
//             },
//             hLineColor: function(i, node) {
//               return (i === 0 || i === 1 || i === node.table.body.length) ? 'black' : 'gray';
//             },
//             vLineColor: function(i, node) {
//               return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
//             }
//         }
//     }
//   ]
// }
