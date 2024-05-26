/**
 @typedef Drepturi
 @type {Object}
 @property {Symbol} vizualizareUtilizatori Dreptul de a intra pe pagina cu tabelul de utilizatori.
 @property {Symbol} stergereUtilizatori Dreptul de a șterge un utilizator.
 @property {Symbol} cumparareProduse Dreptul de a cumpăra produse.
 @property {Symbol} vizualizareGrafice Dreptul de a vizualiza graficele de vânzări.
 @property {Symbol} stergereProduse Dreptul de a șterge produse.
 @property {Symbol} adaugareProduse Dreptul de a adăuga produse.
 @property {Symbol} modificareProdus Dreptul de a modifica un produs.
 */

/**
 * @name module.exports.Drepturi
 * @type Drepturi
 */

const Drepturi = {
    vizualizareUtilizatori: Symbol("vizualizareUtilizatori"),
    stergereUtilizatori: Symbol("stergereUtilizatori"),
    cumparareProduse: Symbol("cumparareProduse"),
    vizualizareGrafice: Symbol("vizualizareGrafice"),
    stergereProduse: Symbol("stergereProduse"),
    adaugareProduse: Symbol("adaugareProduse"),
    modificareProdus: Symbol("modificareProdus")
}

module.exports = Drepturi;
