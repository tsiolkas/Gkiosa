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

  function calculateStatistics(allUsers, allReceipts, allInvoices) {
    return {
      getReceiptSummaries,
      getInvoiceSummaries,
      getCustomersFromAllUsers: genVectorFromAllUsers('CUSTOMERS'),
      getSuppliersFromAllUsers: genVectorFromAllUsers('SUPPLIERS'),
      getInvoiceHistorical,
      getReceiptHistorical
    };

    function getInvoiceSummariesFromUser(userId, vector, dateRange) {
      const filteredInvoices = filterByDate(allInvoices, dateRange);
      const userInvoices = _.filter(filteredInvoices, invoice => invoice.userId === userId && (!vector || invoice.vector === vector));
      return _.isEmpty(userInvoices) ? undefined : getInvoiceSummaries(userInvoices, dateRange);
    }

    function getReceiptSummariesFromUser(userId, vector, dateRange) {
      const filteredReceipts = filterByDate(allReceipts, dateRange);
      const userReceipts = _.filter(filteredReceipts, receipt => receipt.userId === userId && (!vector || invoice.vector === vector));
      return  _.isEmpty(userReceipts) ? undefined : getReceiptSummaries(userReceipts, dateRange);
    }

    function getReceiptSummaries(receipts, dateRange) {
      const filteredReceipts = filterByDate(receipts || allReceipts, dateRange);
      const summaries = _.transform(
        filteredReceipts,
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
      summaries.BALANCE = {
        bank: summaries.SUPPLIERS.bank + summaries.CUSTOMERS.bank,
        cash: summaries.SUPPLIERS.cash + summaries.CUSTOMERS.cash,
        check: summaries.SUPPLIERS.check + summaries.CUSTOMERS.check
      }
      summaries.TOTAL = {
        SUPPLIERS: summaries.SUPPLIERS.bank + summaries.SUPPLIERS.cash + summaries.SUPPLIERS.check,
        CUSTOMERS: summaries.CUSTOMERS.bank + summaries.CUSTOMERS.cash + summaries.CUSTOMERS.check
      }
      return summaries;
    }

    function getInvoiceSummaries(invoices, dateRange) {
      const filteredInvoices = filterByDate(invoices || allInvoices, dateRange);
      const summaries = _.transform(
        filteredInvoices,
        (summaries, invoice) => summaries[invoice.vector] += getInvoiceProductsPrice(invoice),
        {
          SUPPLIERS: 0,
          CUSTOMERS: 0
        }
      );
      summaries.BALANCE = summaries.SUPPLIERS + SUPPLIERS.CUSTOMERS;
      return summaries;
    }

    function getInvoiceProductsPrice(invoice) {
      return _.reduce(
        invoice.products,
        (sum, product) => sum + ((product.price + (product.price * (product.vat/100))) * product.quantity),
        0
      );
    }

    function genVectorFromAllUsers(vector) {
      return (dateRange) => _.transform(
          allUsers,
          (summaries, user) => {
            const invoices = getInvoiceSummariesFromUser(user._id, vector, dateRange);
            const receipts = getReceiptSummariesFromUser(user._id, vector, dateRange);
            if(!_.isEmpty(invoices) || !_.isEmpty(receipts)) {
              const total = receipts.TOTAL[vector] + invoices[vector];
              summaries.push({ invoices, receipts, total, user });
            }
          },
          []
        );
    }

    function getInvoiceHistorical() {
      const historicals = _.transform(
        allInvoices,
        (summaries, invoice) => summaries[invoice.vector].push([invoice.date.getTime(), getInvoiceProductsPrice(invoice)]),
        {
          SUPPLIERS: [],
          CUSTOMERS: []
        }
      );
      _(historicals).each((vectorVal, vector) => historicals[vector] = _.sortBy(vectorVal, _.first));
      return historicals;
    }

    function getReceiptHistorical() {
      const historicals = _.transform(
        allReceipts,
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
      _(historicals).each((vectorVal, vector) =>
        _(vectorVal).each((kindVal, kind) => historicals[vector][kind] = _.sortBy(kindVal, _.first))
      );

      return historicals;
    }

    function filterByDate(items, dateRange) {
      return _.filter(items, item => {
        const itemDate = item.date.getTime();
        return itemDate >= dateRange[0] && itemDate <= dateRange[1];
      });
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
