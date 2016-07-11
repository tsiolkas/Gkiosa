(function () {

'use strict';

angular.module('gkiosa.app.components.gkiosaApi')

.factory('gkiosaApiUtilities', gkiosaApiUtilities);

function gkiosaApiUtilities($rootScope, $q, toastr, gkiosaApi) {

  return {
    getStatistics,

    createEmptyInvoice,
    createEmptyReceipt,
    createEmptyProduct,
    createEmptyUser,

    deleteUser,
    deleteProduct,
    deleteInvoice,
    deleteReceipt
  };

  function getStatistics() {
    return $q.all([
      gkiosaApi.findAllUsers(),
      gkiosaApi.findAllReceipts(),
      gkiosaApi.findAllInvoices()
    ]).then(prmsResults => calculateStatistics(
      prmsResults[0].results,
      prmsResults[1].results,
      prmsResults[2].results
    ));
  }

  function calculateStatistics(users, receipts, invoices) {
    const receiptSummaries = getReceiptSummaries(receipts);
    const invoiceSummaries = getInvoiceSummaries(invoices);
    const invoiceSummariesFromAllUsers = getInvoiceSummariesFromAllUsers();
    const receiptSummariesFromAllUsers = getReceiptSummariesFromAllUsers();
    const invoiceHistorical = getInvoiceHistorical();
    const receiptHistorical = getReceiptHistorical();

    return {
      receiptSummaries,
      invoiceSummaries,
      invoiceSummariesFromAllUsers,
      receiptSummariesFromAllUsers,
      invoiceHistorical,
      receiptHistorical
    };

    function getInvoiceSummariesFromUser(userId) {
      const userInvoices = _.filter(invoices, invoice => invoice.userId === userId);
      return getInvoiceSummaries(userInvoices);
    }

    function getReceiptSummariesFromUser(userId) {
      const userReceipts = _.filter(receipts, receipt => receipt.userId === userId);
      return getReceiptSummaries(userReceipts);
    }

    function getReceiptSummaries(receipts) {
      return _.transform(
        receipts,
        (summaries, receipt) => {
          summaries[receipt.vector].bank += receipt.bank;
          summaries[receipt.vector].cash += receipt.cash;
          summaries[receipt.vector].check += receipt.check;
        },
        {
          SUPPLIERS: {
            bank: 0,
            cash: 0,
            check: 0
          },
          CUSTOMERS: {
            bank: 0,
            cash: 0,
            check: 0
          }
        }
      );
    }

    function getInvoiceSummaries(invoices) {
      return _.transform(
        invoices,
        (summaries, invoice) => summaries[invoice.vector] += getInvoiceProductsPrice(invoice),
        {
          SUPPLIERS: 0,
          CUSTOMERS: 0
        }
      );
    }

    function getInvoiceProductsPrice(invoice) {
      return _.reduce(
        invoice.products,
        (sum, product) => sum + ((product.price + (product.price * (product.vat/100))) * product.quantity),
        0
      );
    }

    function getInvoiceSummariesFromAllUsers() {
      return _.map(users, user => _.identity({
        user,
        summaries: getInvoiceSummariesFromUser(user._id)
      }));
    }

    function getReceiptSummariesFromAllUsers() {
      return _.map(users, user => _.identity({
        user,
        summaries: getReceiptSummariesFromUser(user._id)
      }));
    }

    function getInvoiceHistorical() {
      const historicals = _.transform(
        invoices,
        (summaries, invoice) => summaries[invoice.vector].push([invoice.date.getTime(), getInvoiceProductsPrice(invoice)]),
        {
          SUPPLIERS: [],
          CUSTOMERS: []
        }
      );
      _(_.keys(historicals)).each(vector =>
        historicals[vector] = _.sortBy(historicals[vector], invoice => invoice[0]));
      return historicals;
    }

    function getReceiptHistorical() {
      const historicals = _.transform(
        receipts,
        (summaries, receipt) => {
          summaries[receipt.vector].bank.push([receipt.date.getTime(), receipt.bank]);
          summaries[receipt.vector].cash.push([receipt.date.getTime(), receipt.cash]);
          summaries[receipt.vector].check.push([receipt.date.getTime(), receipt.check]);
        },
        {
          SUPPLIERS: {
            bank: [],
            cash: [],
            check: []
          },
          CUSTOMERS: {
            bank: [],
            cash: [],
            check: []
          }
        }
      );
      _(_.keys(historicals)).each(vector =>
        _(_.keys(historicals[vector])).each(kind =>
          historicals[vector][kind] = _.sortBy(historicals[vector][kind], item => item[0]))
      );
      return historicals;
    }
  }

  function createEmptyInvoice() {
    return {
      products: [],
      date: new Date(),
      credit: false,
      userId: undefined,
      user: undefined,
      invoiceNum: undefined,
      credit: false
    };
  }

  function createEmptyReceipt() {
    return {
      userId: undefined,
      user: undefined,
      date: new Date(),
      receiptNum: undefined,
      bank: 0,
      cash: 0,
      check: 0,
      commend: undefined
    };
  }

  function createEmptyProduct() {
    return {
      name: undefined,
      productId: undefined,
      vat: 0
    };
  }

  function createEmptyUser() {
    return {
      name: undefined,
      code: undefined,
      debt: 0,
      vat: undefined,
      taxAuthority: undefined,
      address: undefined,
      profession: undefined
    }
  }

  function deleteUser(user) {
    return gkiosaApi.getUserDependencies(user._id).then(dependencies => {
      let result = true;
      if (dependencies) {
        let msg = '';
        if (!_.isEmpty(dependencies.invoices)) {
          msg += 'Τα τιμολόγια ' + dependencies.invoices.map(inv => inv.invoiceNum).join(', ') + ', ';
        }
        if (!_.isEmpty(dependencies.receipts)) {
          msg += 'οι αποδείξεις ' + dependencies.receipts.map(inv => inv.receiptNum).join(', ') + ', ';
        }
        msg += `εξαρτώνται απο τον ${user.name}.\nΕιστε σίγουροι ότι θέλετε να τον διαγράψεται?`;
        result = confirm(msg);
      }
      if (result) {
        return gkiosaApi.deleteUser(user._id).then(() => toastr.success(`Ο χρήστης ${user.name} διαγράφηκε`));
      }
    });
  }

  function deleteProduct(product) {
    const result = confirm(`Θέλετε σίγουρα να διαγράψετε το προιόν ${product.name}?`);
    if (result) {
      return gkiosaApi.deleteProduct(product._id).then(() => toastr.success(`Το προιόν ${product.name} διαγράφηκε`));
    }
  }

  function deleteInvoice(invoice) {
    const result = confirm(`Θέλετε σίγουρα να διαγράψετε το τιμολόγιο ${invoice.invoiceNum}?`);
    if (result) {
      return gkiosaApi.deleteInvoice(invoice._id).then(() => toastr.success(`Το τιμολόγιο ${invoice.invoiceNum} διαγράφηκε`));
    }
  }

  function deleteReceipt(receipt) {
    const result = confirm(`Θέλετε σίγουρα να διαγράψετε την απόδειξη ${receipt.receiptNum}?`);
    if (result) {
      return gkiosaApi.deleteReceipt(receipt._id).then(() => toastr.success(`Η απόδειξη ${receipt.receiptNum} διαγράφηκε`));
    }
  }

}

})();
