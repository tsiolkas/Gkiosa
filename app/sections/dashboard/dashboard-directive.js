(function () {

'use strict';

angular.module('gkiosa.app.sections.dashboard')

.controller('DashboardController', DashboardController);

function DashboardController($element, gkiosaPagination, gkiosaApiUtilities, gkiosaCharts) {
  const self = this;

  init();

  function init() {
    self.receiptSummariesPrms = gkiosaApiUtilities.getStatistics()
      .then(statistics => {
        self.receiptSummaries = statistics.receiptSummaries;
        self.invoiceSummaries = statistics.invoiceSummaries;
        self.invoiceSummariesFromAllUsers = statistics.invoiceSummariesFromAllUsers;
        self.receiptSummariesFromAllUsers = statistics.receiptSummariesFromAllUsers;
        self.invoiceHistorical = statistics.invoiceHistorical;
        self.receiptHistorical = statistics.receiptHistorical;

        self.invoiceSummariesFromAllUsersTable = gkiosaPagination.createStaticNgTableParams(statistics.invoiceSummariesFromAllUsers);

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
