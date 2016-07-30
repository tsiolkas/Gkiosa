(function () {

'use strict';

angular.module('gkiosa.app.sections.dashboard')

.controller('DashboardController', DashboardController);

function DashboardController($element, gkiosaPagination, gkiosaApiUtilities, gkiosaCharts) {
  const self = this;

  const dto = (new Date).getTime();
  const dfrom = dto - (1000 * 60 * 60 * 24 * 30 * 3);
  const dateRange = [dfrom, dto];

  self.receiptSummariesDate = dateRange;
  self.invoiceSummariesDate = dateRange;
  self.invoiceSummariesFromAllUsersDate = dateRange;
  self.receiptSummariesFromAllUsersDate = dateRange;
  self.hasInitialized = false;

  self.activateChart = activateChart;

  init();

  function init() {
    self.receiptSummariesPrms = gkiosaApiUtilities.getStatistics()
      .then(statistics => {
        self.receiptSummaries = statistics.getReceiptSummaries(undefined, self.receiptSummariesDate);
        self.invoiceSummaries = statistics.getInvoiceSummaries(undefined, self.invoiceSummariesDate);
        self.customersFromAllUsers = statistics.getCustomersFromAllUsers(self.invoiceSummariesFromAllUsersDate);
        self.suppliersFromAllUsers = statistics.getSuppliersFromAllUsers(self.receiptSummariesFromAllUsersDate);
        self.invoiceHistorical = statistics.getInvoiceHistorical();
        self.receiptHistorical = statistics.getReceiptHistorical();

        self.customersFromAllUsersTable = gkiosaPagination.createStaticNgTableParams(self.customersFromAllUsers);
        self.suppliersFromAllUsersTable = gkiosaPagination.createStaticNgTableParams(self.suppliersFromAllUsers);

        const nameMaping = {
          bank: 'Τραπεζικά',
          cash: 'Μετρητά',
          check: 'Επιταγή'
        };
        _.each(self.receiptHistorical, (val, vector) =>
          self.receiptHistorical[vector] = _.map(self.receiptHistorical[vector], (data, kind) => _.identity({
            data,
            name: nameMaping[kind]
          })
        ));
        _.each(self.invoiceHistorical, (data, vector) =>
          self.invoiceHistorical[vector] = [_.identity({
            data,
            name: 'τιμολόγια'
          })]
        );
        self.hasInitialized = true;

        self.activateChart('gks-stockChart-receipt-suppliers');
        self.activateChart('gks-stockChart-invoice-suppliers');
      });
  }

  function activateChart(className) {
    if (!self.hasInitialized) {
      return;
    }
    _.defer(() => {
      switch(className) {
        case 'gks-stockChart-receipt-suppliers':
          $element.find('.gks-stockChart-receipt-suppliers')
            .highcharts('StockChart', gkiosaCharts.getMultipleSeries(self.receiptHistorical['SUPPLIERS']));
          break;
        case 'gks-stockChart-receipt-customers':
          $element.find('.gks-stockChart-receipt-customers')
            .highcharts('StockChart', gkiosaCharts.getMultipleSeries(self.receiptHistorical['CUSTOMERS']));
          break;
        case 'gks-stockChart-invoice-suppliers':
          $element.find('.gks-stockChart-invoice-suppliers')
            .highcharts('StockChart', gkiosaCharts.getMultipleSeries(self.invoiceHistorical['SUPPLIERS']));
          break;
        case 'gks-stockChart-invoice-customers':
          $element.find('.gks-stockChart-invoice-customers')
            .highcharts('StockChart', gkiosaCharts.getMultipleSeries(self.invoiceHistorical['CUSTOMERS']));
          break;
      }
    });
  }
}

})();
