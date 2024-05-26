const AccesBD = require('./accesbd.js');
const parole = require('./parole.js');
const { RolFactory } = require('./roluri.js');
const crypto = require("crypto");
const nodemailer = require("nodemailer");

/**
 * Clasa Utilizator reprezintă un utilizator în sistem.
 */
class Utilizator {
    static tipConexiune = "local";
    static tabel = "utilizatori";
    static parolaCriptare = "tehniciweb";
    static emailServer = "ralucac.2024@gmail.com";
    static lungimeCod = 64;
    static numeDomeniu = "localhost:8080";
    #eroare;

    /**
     * Creează o instanță a clasei Utilizator.
     * @param {Object} param0 - Obiect cu proprietățile utilizatorului.
     * @param {number} param0.id - ID-ul utilizatorului.
     * @param {string} param0.username - Username-ul utilizatorului.
     * @param {string} param0.nume - Numele utilizatorului.
     * @param {string} param0.prenume - Prenumele utilizatorului.
     * @param {string} param0.email - Email-ul utilizatorului.
     * @param {string} param0.parola - Parola utilizatorului.
     * @param {string} param0.rol - Rolul utilizatorului.
     * @param {string} param0.culoare_chat - Culoarea chat-ului utilizatorului.
     * @param {string} param0.poza - Poza utilizatorului.
     */
    constructor({ id, username = "", nume = "", prenume = "", email = "", parola = "", rol = "comun", culoare_chat = "black", poza = "" } = {}) {
        this.id = id;
        try {
            if (this.checkUsername(username))
                this.username = username;
        } catch (e) { this.#eroare = e.message }

        try {
            if (this.checkName(nume))
                this.nume = nume;
        } catch (e) { this.#eroare = e.message }

        for (let prop in arguments[0]) {
            this[prop] = arguments[0][prop]
        }
        if (this.rol)
            this.rol = this.rol.cod ? RolFactory.creeazaRol(this.rol.cod) : RolFactory.creeazaRol(this.rol);
        console.log(this.rol);

        this.#eroare = "";
    }

    /**
     * Verifică dacă numele este valid.
     * @param {string} nume - Numele de verificat.
     * @returns {boolean} True dacă numele este valid, false altfel.
     */
    checkName(nume) {
        return nume != "" && nume.match(new RegExp("^[A-Z][a-z]+$"));
    }

    /**
     * Setează numele utilizatorului.
     * @param {string} nume - Numele de setat.
     * @throws {Error} Aruncă o eroare dacă numele este invalid.
     */
    set setareNume(nume) {
        if (this.checkName(nume)) this.nume = nume
        else {
            throw new Error("Nume gresit")
        }
    }

    /**
     * Verifică dacă username-ul este valid.
     * @param {string} username - Username-ul de verificat.
     * @returns {boolean} True dacă username-ul este valid, false altfel.
     */
    checkUsername(username) {
        return username != "" && username.match(new RegExp("^[A-Za-z0-9#_./]+$"));
    }

    /**
     * Setează username-ul utilizatorului.
     * @param {string} username - Username-ul de setat.
     * @throws {Error} Aruncă o eroare dacă username-ul este invalid.
     */
    set setareUsername(username) {
        if (this.checkUsername(username)) this.username = username
        else {
            throw new Error("Username gresit")
        }
    }

    /**
     * Criptează parola utilizatorului.
     * @param {string} parola - Parola de criptat.
     * @returns {string} Parola criptată.
     */
    static criptareParola(parola) {
        return crypto.scryptSync(parola, Utilizator.parolaCriptare, Utilizator.lungimeCod).toString("hex");
    }

    /**
     * Modifică informațiile utilizatorului.
     * @param {Array<string>} campuri - Lista de câmpuri de modificat.
     * @param {Array<string>} valori - Lista de valori corespunzătoare câmpurilor.
     */
    modifica(campuri = [], valori = []) {
        AccesBD.getInstanta(Utilizator.tipConexiune).select({ tabel: Utilizator.tabel, campuri: ["*"], conditiiAnd: [`username=${this.username}`] }, function (err, res) {
            if (res.rowCount == 0) {
                throw new Error("Utilizatorul nu exista");
            }
        });
        AccesBD.getInstanta(Utilizator.tipConexiune).update({ tabel: Utilizator.tabel, campuri: campuri, valori: valori, conditiiAnd: [`username=${this.username}`] }, function (err, rez) {
            if (err) {
                console.log(err);
            }
        });
    }

    /**
     * Salvează utilizatorul în baza de date.
     */
    salvareUtilizator() {
        let parolaCriptata = Utilizator.criptareParola(this.parola);
        let utiliz = this;
        let token = parole.genereazaToken(100);
        AccesBD.getInstanta(Utilizator.tipConexiune).insert({
            tabel: Utilizator.tabel,
            campuri: {
                username: this.username,
                nume: this.nume,
                prenume: this.prenume,
                parola: parolaCriptata,
                email: this.email,
                culoare_chat: this.culoare_chat,
                cod: token,
                poza: this.poza
            }
        }, function (err, rez) {
            if (err)
                console.log(err);
            else
                utiliz.trimiteMail("Te-ai inregistrat cu succes", "Username-ul tau este " + utiliz.username,
                    `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${utiliz.username}.</p> <p><a href='http://${Utilizator.numeDomeniu}/cod/${utiliz.username}/${token}'>Click aici pentru confirmare</a></p>`,
                )
        });
    }

    /**
     * Șterge utilizatorul din baza de date.
     */
    sterge() {
        AccesBD.getInstanta(Utilizator.tipConexiune).select({ tabel: Utilizator.tabel, campuri: ["*"], conditiiAnd: [`username='${this.username}'`] }, function (err, res) {
            if (res.rowCount == 0) {
                throw new Error("Utilizatorul nu exista");
            }
        });
        AccesBD.getInstanta(Utilizator.tipConexiune).delete({ tabel: Utilizator.tabel, conditiiAnd: [`username='${this.username}'`] }, function (err, rez) {
            if (err) {
                console.log(err);
            }
        });
    }

    /**
     * Obține un utilizator după username.
     * @param {string} username - Username-ul utilizatorului.
     * @param {Object} obparam - Obiect cu parametri suplimentari.
     * @param {function} proceseazaUtiliz - Funcție callback pentru procesarea utilizatorului.
     * @returns {Utilizator|null} Utilizatorul găsit sau null dacă nu a fost găsit.
     */
    static getUtilizDupaUsername(username, obparam, proceseazaUtiliz) {
        if (!username) return null;
        let eroare = null;
        AccesBD.getInstanta(Utilizator.tipConexiune).select({ tabel: "utilizatori", campuri: ['*'], conditiiAnd: [`username='${username}'`] }, function (err, rezSelect) {
            if (err) {
                console.error("Utilizator:", err);
                eroare = -2;
            }
            else if (rezSelect.rowCount == 0) {
                eroare = -1;
            }
            let u = new Utilizator(rezSelect.rows[0])
            proceseazaUtiliz(u, obparam, eroare);
        });
    }

    /**
     * Obține un utilizator după username asincron.
     * @param {string} username - Username-ul utilizatorului.
     * @returns {Promise<Utilizator|null>} Promisiune care se rezolvă cu utilizatorul găsit sau null dacă nu a fost găsit.
     */
    static async getUtilizDupaUsernameAsync(username) {
        if (!username) return null;
        try {
            let rezSelect = await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync(
                {
                    tabel: "utilizatori",
                    campuri: ['*'],
                    conditiiAnd: [`username='${username}'`]
                });
            if (rezSelect.rowCount != 0) {
                return new Utilizator(rezSelect.rows[0])
            }
            else {
                console.log("getUtilizDupaUsernameAsync: Nu am gasit utilizatorul");
                return null;
            }
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }

    /**
     * Caută utilizatori pe baza parametrilor specificați.
     * @param {Object} obparam - Obiect cu parametri de căutare.
     * @param {function} proceseazaUtiliz - Funcție callback pentru procesarea utilizatorilor găsiți.
     */
    static cauta(obparam, proceseazaUtiliz) {
        let eroare = null;
        var conditiiAnd = [];
        var keys = Object.keys(obparam);
        var values = Object.values(obparam);
        var listaUtiliz = [];
        for (let idx in values) {
            let conditie = `${keys[idx]} = ${values[idx]}`;
            conditiiAnd.push(conditie);
        }
        AccesBD.getInstanta(Utilizator.tipConexiune).select({ tabel: Utilizator.tabel, campuri: ['*'], conditiiAnd: conditiiAnd }, function (err, rezSelect) {
            if (err) {
                console.error(err);
                eroare = -1;
            }
            if (rezSelect.rowCount == 0) {
                proceseazaUtiliz(eroare, []);
            }
            else {
                for (idx in rezSelect.rows) {
                    let u = new Utilizator(rezSelect.rows[idx])
                    listaUtiliz.push(u);
                }
                proceseazaUtiliz(eroare, listaUtiliz);
            }
        })
    }

    /**
     * Caută utilizatori pe baza parametrilor specificați asincron.
     * @param {Object} obparam - Obiect cu parametri de căutare.
     * @returns {Promise<Utilizator[]>} Promisiune care se rezolvă cu lista de utilizatori găsiți.
     */
    static async cautaAsync(obparam) {
        var conditiiAnd = [];
        var keys = Object.keys(obparam);
        var values = Object.values(obparam);
        var listaUtiliz = [];
        for (let idx in values) {
            let conditie = `${keys[idx]} = ${values[idx]}`;
            conditiiAnd.push(conditie);
        }
        try {
            rezSelect = await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync({ tabel: Utilizator.tabel, campuri: ['*'], conditiiAnd: conditiiAnd })
            if (rezSelect.rowCount == 0) {
                return [];
            }
            else {
                for (idx in rezSelect.rows) {
                    let u = new Utilizator(rezSelect.rows[idx])
                    listaUtiliz.push(u);
                }
                return listaUtiliz;
            }
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }

    /**
     * Verifică dacă utilizatorul are un anumit drept.
     * @param {Symbol} drept - Dreptul de verificat.
     * @returns {boolean} True dacă utilizatorul are dreptul, false altfel.
     */
    areDreptul(drept) {
        return this.rol.areDreptul(drept);
    }

    /**
     * Trimite un email utilizatorului.
     * @param {string} subiect - Subiectul email-ului.
     * @param {string} mesajText - Mesajul text al email-ului.
     * @param {string} mesajHtml - Mesajul HTML al email-ului.
     * @param {Array<Object>} atasamente - Lista de atașamente.
     */
    async trimiteMail(subiect, mesajText, mesajHtml, atasamente = []) {
        var transp = nodemailer.createTransport({
            service: "gmail",
            secure: false,
            auth: {//date login 
                user: Utilizator.emailServer,
                pass: "ktcsoitnitprzxns"
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        //genereaza html
        await transp.sendMail({
            from: Utilizator.emailServer,
            to: this.email, //TO DO
            subject: subiect,//"Te-ai inregistrat cu succes",
            text: mesajText, //"Username-ul tau este "+username
            html: mesajHtml,// `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
            attachments: atasamente
        })
        console.log("trimis mail");
    }
}

module.exports = { Utilizator: Utilizator }
