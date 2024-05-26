const Drepturi = require('./drepturi.js');

/**
 * Clasa de bază pentru toate rolurile.
 */
class Rol {
    /**
     * Tipul de rol.
     * @type {string}
     */
    static get tip() { return "generic"; }

    /**
     * Lista de drepturi asociate rolului.
     * @type {Symbol[]}
     */
    static get drepturi() { return []; }

    /**
     * Constructor pentru clasa Rol.
     */
    constructor() {
        this.cod = this.constructor.tip;
    }

    /**
     * Verifică dacă rolul are un anumit drept.
     * @param {Symbol} drept - Dreptul de verificat.
     * @returns {boolean} True dacă rolul are dreptul, false altfel.
     */
    areDreptul(drept) {
        return this.constructor.drepturi.includes(drept);
    }
}

/**
 * Clasa pentru rolul de admin.
 * @extends Rol
 */
class RolAdmin extends Rol {
    /**
     * Tipul de rol.
     * @type {string}
     */
    static get tip() { return "admin"; }

    /**
     * Constructor pentru clasa RolAdmin.
     */
    constructor() {
        super();
    }

    /**
     * Verifică dacă rolul are un anumit drept. Adminul are toate drepturile.
     * @returns {boolean} True, deoarece adminul are toate drepturile.
     */
    areDreptul() {
        return true;
    }
}

/**
 * Clasa pentru rolul de moderator.
 * @extends Rol
 */
class RolModerator extends Rol {
    /**
     * Tipul de rol.
     * @type {string}
     */
    static get tip() { return "moderator"; }

    /**
     * Lista de drepturi asociate rolului de moderator.
     * @type {Symbol[]}
     */
    static get drepturi() {
        return [
            Drepturi.vizualizareUtilizatori,
            Drepturi.stergereUtilizatori
        ];
    }

    /**
     * Constructor pentru clasa RolModerator.
     */
    constructor() {
        super();
    }
}

/**
 * Clasa pentru rolul de client.
 * @extends Rol
 */
class RolClient extends Rol {
    /**
     * Tipul de rol.
     * @type {string}
     */
    static get tip() { return "comun"; }

    /**
     * Lista de drepturi asociate rolului de client.
     * @type {Symbol[]}
     */
    static get drepturi() {
        return [
            Drepturi.cumparareProduse
        ];
    }

    /**
     * Constructor pentru clasa RolClient.
     */
    constructor() {
        super();
    }
}

/**
 * Facory pentru roluri - crearea instanțelor de roluri.
 */
class RolFactory {
    /**
     * Creează o instanță de rol pe baza tipului specificat.
     * @param {string} tip - Tipul de rol.
     * @returns {Rol} Instanța de rol creată.
     */
    static creeazaRol(tip) {
        switch (tip) {
            case RolAdmin.tip: return new RolAdmin();
            case RolModerator.tip: return new RolModerator();
            case RolClient.tip: return new RolClient();
        }
    }
}

module.exports = {
    RolFactory: RolFactory,
    RolAdmin: RolAdmin,
    RolModerator: RolModerator,
    RolClient: RolClient
}
