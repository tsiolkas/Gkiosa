(function () {

'use strict';

angular.module('gkiosa.app.components.pdfGenerator')

.factory('gkiosaPdfGeneratorInvoice', gkiosaPdfGeneratorInvoice);

function gkiosaPdfGeneratorInvoice($filter, gkiosaPdfGenerator) {
  const gksDate = $filter('gksDate');
  const gksEuro = $filter('gksEuro');

  return gkiosaPdfGenerator.generatePdfMethods(generateDD);

  function generateDD(data) {

    const header = createHeader(data.invoice);
    const userInfo = createUserInfo(data.user);
    const content = createContent(data.invoice);
    const styles = getStyles();

    const dd = {
      content: [
        header,
        userInfo,
        content
      ],
      styles
    };

    return dd;
  }

  function createHeader(invoice) {
    const now = gksDate(new Date());
    return {
      columns: [
        {
          text: invoice.invoiceNum,
          width: 400
        },
        {
          text: `${invoice.uniqId}     ${now}`,
          width: 200
        }
      ]
    };
  }

  function createUserInfo(user) {
    const info = _.transform([
      ['Επωνημία', user.name],
      ['Κωδικός', user.code],
      ['Επάγγελμα', user.profession],
      ['Διεύθυνση', user.address],
      ['Α.Φ.Μ.', user.vat],
      ['Δ.Ο.Υ', user.taxAuthority],
      ['Τηλέφωνο', user.phone || '-'],
      ['', ''],
      ['', '']
    ], (body, info, idx) => {
      if (idx % 3 === 0) {
        body.push([]);
      }
      const lastBody = _.last(body);
      lastBody.push(info[0]);
      lastBody.push({ text: _.toString(info[1]), style: 'useDetail'});
    }, []);

    return {
      table: {
        headerRows: 1,
        widths: ['*', 'auto', '*', '*', '*', '*'],
        body: info
      },
      margin: [0, 15],
      layout: createUserInfoLayout()
    };
  }

  function createContent(invoice) {
    const header = [
        'Κωδικός',
        'Όνομα',
        'Ποσότητα',
        'Τιμή',
        'Σύνολο',
        'Φ.Π.Α.',
        'Σύνολο Φ.Π.Α'
      ];
    const ddProducts = _.map(invoice.products, p => {
      return _.map([
        p.productId,
        p.name,
        p.quantity,
        p.price,
        p.getPrice(),
        `${p.vat}%`,
        p.getVatPrice()
      ], _.toString);
    });
    const sum = [
      invoice.getTotalPrice(),
      invoice.getTotalVat(),
      invoice.getTotalVatPrice()
    ];
    const body = [header].concat(ddProducts);
    return {
      table: {
        body
      },
      widths: ['*', '*', '*', '*', '*', '*', '*'],
      layout: createContentLayout()
    };
  }

  function createUserInfoLayout() {
    return {
      hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0,
      vLineWidth: (i, node) => (i === 0 || i === node.table.widths.length) ? 1 : 0
     };
  }

  function createContentLayout() {
    return {
      hLineWidth: (i, node) => (i === 0 || i === 1 || i === node.table.body.length) ? 1 : 0,
      vLineWidth: (i, node) => (i === 0 || i === node.table.widths.length) ? 1 : 0
     };
  }

  function getStyles() {
    return {
      useDetail: {
        bold: true
      }
    };
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
