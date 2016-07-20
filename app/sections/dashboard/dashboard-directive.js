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

        self.invoiceSummariesFromAllUsersTable = gkiosaPagination.createStaticNgTableParams(self.invoiceSummariesFromAllUsers);

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
        $element.find('.gks-stockChart-receipt-suppliers')
          .highcharts('StockChart', gkiosaCharts.getMultipleSeries(self.receiptHistorical['SUPPLIERS']));

        $element.find('.gks-stockChart-receipt-customers')
          .highcharts('StockChart', gkiosaCharts.getMultipleSeries(self.receiptHistorical['CUSTOMERS']));

        _.each(self.invoiceHistorical, (data, vector) =>
          self.invoiceHistorical[vector] = _.identity({
            data,
            name: 'τιμολόγια'
          })
        );

        $element.find('.gks-stockChart-invoice-suppliers')
          .highcharts('StockChart', gkiosaCharts.getMultipleSeries([self.invoiceHistorical['SUPPLIERS']]));

        $element.find('.gks-stockChart-invoice-customers')
          .highcharts('StockChart', gkiosaCharts.getMultipleSeries([self.invoiceHistorical['CUSTOMERS']]));
      });
  }
}

})();
