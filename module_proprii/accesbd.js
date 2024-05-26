const { Client, Pool } = require("pg");

// Aceasta clasă este un singleton, asigurând o singură instanță.
class AccesBD {
  static #instanta = null;
  static #initializat = false;

  constructor() {
    if (AccesBD.#instanta) {
      throw new Error("Deja a fost instantiat");
    } else if (!AccesBD.#initializat) {
      throw new Error("Trebuie apelat doar din getInstanta; fara sa fi aruncat vreo eroare");
    }
  }

  /**
   * Inițializează conexiunea locală la baza de date.
   */
  initLocal() {
    this.client = new Client({
      database: "cti_2024",
      user: "raluca",
      password: "Raluca2003",
      host: "localhost",
      port: 5432
    });
    this.client2 = new Pool({
      database: "cti_2024",
      user: "raluca",
      password: "Raluca2003",
      host: "localhost",
      port: 5432
    });

    this.client.connect();
  }

  /**
   * Returnează instanța clientului.
   * 
   * @returns {Client} Instanța clientului.
   * @throws Va arunca o eroare dacă clasa nu este instanțiată.
   */
  getClient() {
    if (!AccesBD.#instanta) {
      throw new Error("Nu a fost instantiata clasa");
    }
    return this.client;
  }

  /**
   * Returnează instanța unică a clasei
   *
   * @param {Object} init - Un obiect cu datele de inițializare.
   * @param {string} init.init - Tipul de conexiune ("local").
   * @returns {AccesBD} Instanța singleton a clasei AccesBD.
   */
  static getInstanta({ init = "local" } = {}) {
    if (!this.#instanta) {
      this.#initializat = true;
      this.#instanta = new AccesBD();

      try {
        switch (init) {
          case "local":
            this.#instanta.initLocal();
        }
      } catch (e) {
        console.error("Eroare la initializarea bazei de date!");
      }
    }
    return this.#instanta;
  }

  /**
   * @typedef {object} ObiectQuerySelect - Obiect primit de funcțiile care realizează un query.
   * @property {string} tabel - Numele tabelului.
   * @property {string[]} campuri - O listă de stringuri cu numele coloanelor afectate de query; poate cuprinde și elementul "*".
   * @property {string[]} conditiiAnd - Lista de stringuri cu condiții pentru clauza where.
   */

  /**
   * Selectează înregistrări din baza de date.
   *
   * @param {ObiectQuerySelect} obj - Un obiect cu datele pentru query.
   * @param {function} callback - O funcție callback cu 2 parametri: eroare și rezultatul query-ului.
   * @param {Array} parametriQuery - Array de parametri pentru query.
   */
  select({ tabel = "", campuri = [], conditiiAnd = [] } = {}, callback, parametriQuery = []) {
    let conditieWhere = "";
    if (conditiiAnd.length > 0)
      conditieWhere = `where ${conditiiAnd.join(" and ")}`;
    let comanda = `select ${campuri.join(",")} from ${tabel} ${conditieWhere}`;
    console.error(comanda);
    this.client.query(comanda, parametriQuery, callback);
  }

  /**
   * Selectează înregistrări din baza de date asincron.
   *
   * @param {ObiectQuerySelect} obj - Un obiect cu datele pentru query.
   * @returns {Promise<Object>} Rezultatul query-ului.
   */
  async selectAsync({ tabel = "", campuri = [], conditiiAnd = [] } = {}) {
    let conditieWhere = "";
    if (conditiiAnd.length > 0)
      conditieWhere = `where ${conditiiAnd.join(" and ")}`;
    
    let comanda = `select ${campuri.join(",")} from ${tabel} ${conditieWhere}`;
    console.error("selectAsync:", comanda);
    try {
      let rez = await this.client.query(comanda);
      console.log("selectasync: ", rez);
      return rez;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  /**
   * Inserează înregistrări în baza de date.
   *
   * @param {Object} obj - Un obiect cu datele pentru query.
   * @param {string} obj.tabel - Numele tabelului.
   * @param {Object} obj.campuri - Un obiect cu perechi de valori pentru coloanele tabelului.
   * @param {function} callback - O funcție callback cu 2 parametri: eroare și rezultatul query-ului.
   */
  insert({ tabel = "", campuri = {} } = {}, callback) {
    console.log("-------------------------------------------");
    console.log(Object.keys(campuri).join(","));
    console.log(Object.values(campuri).join(","));
    let comanda = `insert into ${tabel}(${Object.keys(campuri).join(",")}) values ( ${Object.values(campuri).map((x) => `'${x}'`).join(",")})`;
    console.log(comanda);
    this.client.query(comanda, callback);
  }

  /**
   * @typedef {object} ObiectQueryUpdate - Obiect primit de funcțiile care realizează un query.
   * @property {string} tabel - Numele tabelului.
   * @property {string[]} campuri - O listă de stringuri cu numele coloanelor afectate de query.
   * @property {string[]} conditiiAnd - Lista de stringuri cu condiții pentru clauza where.
   */

  /**
   * Actualizează înregistrări din baza de date.
   *
   * @param {ObiectQueryUpdate} obj - Un obiect cu datele pentru query.
   * @param {function} callback - O funcție callback cu 2 parametri: eroare și rezultatul query-ului.
   * @param {Array} parametriQuery - Array de parametri pentru query.
   */
  update({ tabel = "", campuri = {}, conditiiAnd = [] } = {}, callback, parametriQuery) {
    let campuriActualizate = [];
    for (let prop in campuri)
      campuriActualizate.push(`${prop}='${campuri[prop]}'`);
    let conditieWhere = "";
    if (conditiiAnd.length > 0)
      conditieWhere = `where ${conditiiAnd.join(" and ")}`;
    let comanda = `update ${tabel} set ${campuriActualizate.join(", ")} ${conditieWhere}`;
    console.log(comanda);
    this.client.query(comanda, callback);
  }

  /**
   * Actualizează înregistrări din baza de date folosind parametri.
   *
   * @param {ObiectQueryUpdate} obj - Un obiect cu datele pentru query.
   * @param {function} callback - O funcție callback cu 2 parametri: eroare și rezultatul query-ului.
   * @param {Array} parametriQuery - Array de parametri pentru query.
   */
  updateParametrizat({ tabel = "", campuri = [], valori = [], conditiiAnd = [] } = {}, callback, parametriQuery) {
    if (campuri.length != valori.length)
      throw new Error("Numarul de campuri difera de nr de valori");
    let campuriActualizate = [];
    for (let i = 0; i < campuri.length; i++)
      campuriActualizate.push(`${campuri[i]}=$${i + 1}`);
    let conditieWhere = "";
    if (conditiiAnd.length > 0)
      conditieWhere = `where ${conditiiAnd.join(" and ")}`;
    let comanda = `update ${tabel} set ${campuriActualizate.join(", ")} ${conditieWhere}`;
    this.client.query(comanda, valori, callback);
  }

  /**
   * Șterge înregistrări din baza de date.
   *
   * @param {Object} obj - Un obiect cu datele pentru query.
   * @param {string} obj.tabel - Numele tabelului.
   * @param {string[]} obj.conditiiAnd - Lista de stringuri cu condiții pentru clauza where.
   * @param {function} callback - O funcție callback cu 2 parametri: eroare și rezultatul query-ului.
   */
  delete({ tabel = "", conditiiAnd = [] } = {}, callback) {
    let conditieWhere = "";
    if (conditiiAnd.length > 0)
      conditieWhere = `where ${conditiiAnd.join(" and ")}`;
    
    let comanda = `delete from ${tabel} ${conditieWhere}`;
    console.log(comanda);
    this.client.query(comanda, callback);
  }

  /**
   * Execută un query arbitrar.
   *
   * @param {string} comanda - Comanda SQL de executat.
   * @param {function} callback - O funcție callback cu 2 parametri: eroare și rezultatul query-ului.
   */
  query(comanda, callback) {
    this.client.query(comanda, callback);
  }
}

module.exports = AccesBD;