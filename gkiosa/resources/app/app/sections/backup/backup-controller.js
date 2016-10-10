(function () {

  'use strict';

  angular.module('gkiosa.app.sections.backup')

    .controller('BackupController', BackupController);

  function BackupController($element, $q, $ngBootbox, toastr, gkiosaApi, gkiosaFileUtilities) {
    const self = this;

    self.promise = undefined;

    init();

    return {
      createBackup,
      deleteAppData
    };

    function init() {
      registerRestoreData()
    }

    function createBackup() {
      self.promise = gkiosaApi.getAllData();
      self.promise.then(data => {
        const txt = angular.toJson(data);
        const date = new Date().toISOString().slice(0, 19).replace(':', '-').replace('T', '_');
        const filename = `gkiosa_${date}.gks`;
        gkiosaFileUtilities.saveSingleFile(txt, filename);
        toastr.success(
          `Το αντίγράφο ασφαλείας δημιουργήθηκε επιτυχώς`
        );
      });
    }

    function registerRestoreData() {
      const fileEl = $element.find('.btn-file input');
      let deferred;
      const onReadFile = text => {
        deferred.resolve(true);
        try {
          const data = angular.fromJson(text);
          self.promise = gkiosaApi.restoreAllData(data);
          self.promise.then(() => toastr.success(
            `Η επαναφορά τον δεδομένων ολοκληρώθηκε επιτυχώς`, undefined, {timeOut: 10000}
          ));
        } catch (e) {
          const msg = `Το αρχείο δεν είναι συμβατό με την εφαρμογή`;
          toastr.error(msg);
        }
      }
      const onStartReading = () => {
        deferred = $q.defer();
        self.promise = deferred.promise;
        return true;
      }
      gkiosaFileUtilities.readSingleFile(fileEl, onStartReading, onReadFile);
    }

    function deleteAppData() {
      const msg = `
        <h2 class="text-danger">Προσοχή!</h2>
        <h3>Με την εκτέλεση της επαναφοράς θα διαγραφούν όλα τα δεδομένα από την εφαρμογή.</h3>
        <p class="lead">Είστε σίγουροι?</p>
      `;
      $ngBootbox.confirm(msg)
        .then(() => {
          self.promise = gkiosaApi.deleteAllData();
          self.promise.then(() => toastr.success(
            `Η εφαρμογή επανήλθε στις εργοστασιακές ρυθμισεις`, undefined, {timeOut: 10000}
          ));
        });
    }
  }

})();
