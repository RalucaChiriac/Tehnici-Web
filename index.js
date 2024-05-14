const express = require("express");
const fs = require('fs');
const path=require('path');
const sharp=require('sharp');
const sass=require('sass');
const ejs=require('ejs');
const Client = require('pg').Client;
const { randomInt } = require('crypto')

const AccesBD= require("./module_proprii/accesbd.js");
const formidable=require("formidable");
const {Utilizator}=require("./module_proprii/utilizator.js");
const session=require('express-session');
const Drepturi = require("./module_proprii/drepturi.js");

var client= new Client({database:"cti_2024",
        user:"postgres",
        password:"Raluca2003",
        host:"localhost",
        port:5432});
client.connect();

client.query("select * from flori" , function (err,rez){
  console.log(rez);
})

obGlobal = {
    obErori: null,
    obImagini:null,
    folderScss:path.join(__dirname,"Resurse/scss"),
    folderCss:path.join(__dirname,"Resurse/css"), 
    folderBackup:path.join(__dirname,"backup"),
    tipuri:null,
};

app = express(); //creez un obiect server express
//console.log va afisa in consola, dirname este folderul in care se gaseste fisierul pe care-l rulez eu
console.log("Folder proiect", __dirname);
//filename = dirname + numele fisierului pe care-l rulez eu
console.log("Cale fisier", __filename);
// directorul de lucuru este cel de unde rulez iar dirname folderul proiectului(apilcatiei)
//cwd = Current Working Directory
console.log("Director de lucru", process.cwd());
 
app.use(session({
  secret:'abcdefg',
  resave:true,
  saveUninitialized:false
}));

app.set("view engine","ejs");

vect_foldere = ["temp", "temp1", "backup","poze_uploadate"]; //creare foldere
for(let folder of vect_foldere){
    let caleFolder=path.join(__dirname,folder)
    if(!fs.existsSync(caleFolder)){
        fs.mkdirSync(caleFolder);//verifica existenta unui fisier, daca nu exista il creaza
    }
}

//primeste o cerere care incepe cu /Resurse si va trimite fisiere din folderul (__dirname+"/Resurse")
app.use("/Resurse", express.static(__dirname+"/Resurse"));
app.use("/poze_uploadate", express.static(__dirname+"/poze_uploadate"));
app.use("/node_modules", express.static(__dirname+"/node_modules"));

client.query("select * from unnest(enum_range(null::tipuri_produse))", function(err, rez){
  if(err)
      console.log(err);
  else{
      console.log(rez);
      obGlobal.tipuri = rez.rows;
  }
});

app.use("/*",function(req,res,next){
  res.locals.tipuri=obGlobal.tipuri;
  next();
})

// verifica daca se afla in folderul de resurse, folosind un regex pentru a vedea daca e orice cuvant dupa /Resurse in calea
// paginiii cerute, daca da, afiseaza eroarea 403 - forbidden
app.get("/favicon.ico", function(req, res) {
    res.sendFile(path.join(__dirname+"/Resurse/ico/favicon.ico"))
})

app.get(new RegExp("^\/Resurse\/[A-Za-z0-9\/]*\/$"), function(req,res){
    afisareEroare(res, 403);
});

app.get(["/", "/index", "/home"], function(req, res){
   res.render("pagini/index", {ip: req.ip, imagini: obGlobal.obImagini.imagini}); // este cea care executa defapt ejs-ul
})

//---------------Produse-----------

app.get("/produse", function(req,res){
  continuareQuery=""
  if (req.query.tip)
    continuareQuery+=` and tip_produs='${req.query.tip}'`;
  client.query("select * from flori where 1=1 " + continuareQuery , function(err, rez){
    if(err){
      console.log(err);
      afisareEroare(res, 2);
    }
    else{
      res.render("pagini/produse",{produse: rez.rows})
    }
  })
})

app.get("/produs/:id", function(req,res){
  client.query(`select * from flori where id= ${req.params.id}` , function (err,rez){
    if(err){
      console.log(err);
      afisareEroare(res,2);
    }
    else{
      res.render("pagini/produs",{prod: rez.rows[0]})
    }
  })
})

app.get("/galerie-animata", function(req, res) {
  let nrImagini = randomInt(5, 11)
  if (nrImagini % 2 == 0) nrImagini++

  let imgInv = [...obGlobal.obImagini.imagini].reverse()

  let fisScss = path.join(__dirname, 'resurse/scss/galerieanimata.scss')
  let liniiFisScss = fs.readFileSync(fisScss).toString().split('\n')

  let stringImg = '$nrImg: ' + nrImagini + ';'

  liniiFisScss.shift()
  liniiFisScss.unshift(stringImg)

  fs.writeFileSync(fisScss, liniiFisScss.join('\n'))

  res.render('pagini/galerie_animata.ejs', {
    imagini: obGlobal.obImagini.imagini,
    nrImagini: nrImagini,
    imgInv: imgInv,
  })
})

//--------------------------------UTILIZATORI--------------------------

app.post("/inregistrare",function(req, res){
  var username;
  var poza;
  var formular= new formidable.IncomingForm()
  formular.parse(req, function(err, campuriText, campuriFisier ){//4
      console.log("Inregistrare:",campuriText);


      console.log(campuriFisier);
      console.log(poza, username);
      var eroare="";


      // TO DO var utilizNou = creare utilizator
      try{
          utilizNou.setareNume=campuriText.nume[0];
          utilizNou.setareUsername=campuriText.username[0];
          utilizNou.email=campuriText.email[0]
          utilizNou.prenume=campuriText.prenume[0]
         
          utilizNou.parola=campuriText.parola[0];
          utilizNou.culoare_chat=campuriText.culoare_chat[0];
          utilizNou.poza= poza[0];
          Utilizator.getUtilizDupaUsername(campuriText.username[0], {}, function(u, parametru ,eroareUser ){
              if (eroareUser==-1){//nu exista username-ul in BD
                  //TO DO salveaza utilizator
              }
              else{
                  eroare+="Mai exista username-ul";
              }


              if(!eroare){
                  res.render("pagini/inregistrare", {raspuns:"Inregistrare cu succes!"})
                 
              }
              else
                  res.render("pagini/inregistrare", {err: "Eroare: "+eroare});
          })
         


      }
      catch(e){
          console.log(e);
          eroare+= "Eroare site; reveniti mai tarziu";
          console.log(eroare);
          res.render("pagini/inregistrare", {err: "Eroare: "+eroare})
      }
 

  });
  formular.on("field", function(nume,val){  // 1
 
      console.log(`--- ${nume}=${val}`);
     
      if(nume=="username")
          username=val;
  })
  formular.on("fileBegin", function(nume,fisier){ //2
      console.log("fileBegin");
     
      console.log(nume,fisier);
      //TO DO adaugam folderul poze_uploadate ca static si sa fie creat de aplicatie
      //TO DO in folderul poze_uploadate facem folder cu numele utilizatorului (variabila folderUser)
      var folderUser=path.join(__dirname,"poze_uploadate",username);
      if(!fs.existsSync(folderUser))
          fs.mkdirSync(folderUser)
     
      fisier.filepath=path.join(folderUser, fisier.originalFilename)
      poza=fisier.originalFilename;
      //fisier.filepath=folderUser+"/"+fisier.originalFilename
      console.log("fileBegin:",poza)
      console.log("fileBegin, fisier:",fisier)


  })    
  formular.on("file", function(nume,fisier){//3
      console.log("file");
      console.log(nume,fisier);
  });
});

app.get("/galerie", function(req, res){
  // console.log(obGlobal.obImagini);
  res.render("pagini/galerie", {imagini: obGlobal.obImagini.imagini});
})

// // trimiterea unui mesaj fix
// //este o cerere pe care o trimitem in browser, iar function(req, res) se va apela cand trimit cererea, cea care va veni cu raspunsul
// app.get("/cerere", function(req, res){
//     res.send("<b>Hello</b> <span style='color:red'>world!</span>");

// //trimiterea unui mesaj dinamic , next() este o functie care ne ajuta sa-i spunem cauta mai departe nu te opri aici
// //send si opreste trimiterea. /data ar intra pe prima pe care o gaseste
// app.get("/data", function(req, res, next){
//     res.write("Data: ");
//     next();
// });
// app.get("/data", function(req, res){
//     res.write(""+new Date());// converteste obiectul intr-un sir de caractere ""+
//     res.end();// indica terminarea raspunsului, daca nu clientul inca asteapta date
// });

// //trimiterea unui mesaj dinamic in functie de parametri (req.params; req.query)

// app.get("/suma/:a/:b", function(req, res){
//     var suma=parseInt(req.params.a)+parseInt(req.params.b)// convertite la întregi
//     res.send(""+suma);//ca sa-l converteasca la sir de caractere
// }); 

app.get("/*.ejs", function(req, res) {
    afisareEroare(res, 400);
})

app.get("/*", function (req, res) {
    console.log(req.url);// afiseaza url-ul cererii in consola
    try {
      res.render("pagini" + req.url, function (err, rezHtml) {
        if (err) {
          if (err.message.startsWith("Failed to lookup view")) {
            afisareEroare(res, 404);
            console.log("Nu a gasit pagina: ", req.url);
          }
        } else {
          res.send(rezHtml + "");
        }
      });
    } catch (err1) {
      if (err1) {
        if (err1.message.startsWith("Cannot find module")) {
          afisareEroare(res, 404);
          console.log("Nu a gasit resursa: ", req.url);
        }
      } else {
        afisareEroare(res);
      }
    }
  });
  
  function initErori() {
    var continut = fs
      .readFileSync(path.join(__dirname, "Resurse/json/erori.json"))
      .toString("utf-8");
    console.log(continut);
  
    obGlobal.obErori = JSON.parse(continut);
    for (let eroare of obGlobal.obErori.info_erori) {
      eroare.imagine = path.join(obGlobal.obErori.cale_baza, eroare.imagine);
    }
    obGlobal.obErori.eroare_default.imagine = path.join(
      obGlobal.obErori.cale_baza,
      obGlobal.obErori.eroare_default.imagine
    );
    console.log(obGlobal.obErori);
  }
  initErori();
  
  function afisareEroare(res, _identificator, _titlu, _text, _imagine) {
    let eroare = obGlobal.obErori.info_erori.find(function (elem) {
      return elem.identificator == _identificator;
    });
  
    if (!eroare) {
      let eroare_default = obGlobal.obErori.eroare_default;
      res.render("pagini/eroare", {
        titlu: _titlu || eroare_default.titlu,
        text: _text || eroare_default.text,
        imagine: _imagine || eroare_default.imagine,
      });
    } else {
      if (eroare.status) {
        res.status(eroare.identificator);
        res.render("pagini/eroare", {
          titlu: _titlu || eroare.titlu,
          text: _text || eroare.text,
          imagine: _imagine || eroare.imagine,
        });
      }
    }
  }

  function initImagini(){
    var continut = fs.readFileSync(path.join(__dirname,"Resurse/json/galerie.json")).toString("utf-8");

    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;

    let caleAbs=path.join(__dirname,obGlobal.obImagini.cale_galerie);
    let caleAbsMediu=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mediu");
    let caleAbsMic=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mic");
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);

    for (let imag of vImagini){
        [numeFis, ext]=imag.fisier.split(".");
        let caleFisAbs=path.join(caleAbs,imag.fisier);
        let caleFisMediuAbs=path.join(caleAbsMediu, numeFis+".webp");
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);
        let caleFisMicAbs=path.join(caleAbsMic, numeFis+".webp");
        sharp(caleFisAbs).resize(200).toFile(caleFisMicAbs);
        imag.fisier_mic=path.join("/", obGlobal.obImagini.cale_galerie, "mic",numeFis+".webp" )
        imag.fisier_mediu=path.join("/", obGlobal.obImagini.cale_galerie, "mediu",numeFis+".webp" )
        imag.fisier=path.join("/", obGlobal.obImagini.cale_galerie, imag.fisier)
    }

    console.log(obGlobal.obImagini)
}
initImagini();


function compileazaScss(caleScss, caleCss){
    console.log("cale:",caleCss);
    if(!caleCss) {
        let numeFisExt=path.basename(caleScss);//numele 
        let numeFis=numeFisExt.split(".")[0];  /// "a.scss"  -> ["a","scss"]
        caleCss=numeFis+".css";
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss)
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss )

    let caleBackup=path.join(obGlobal.folderBackup, "Resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup,{recursive:true})
    }
    
    // la acest punct avem cai absolute in caleScss si  caleCss
    let numeFisCss=path.basename(caleCss);
    if (fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "Resurse/css", numeFisCss))// +(new Date()).getTime()
    }
    
    rez=sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss,rez.css)
    //console.log("Compilare SCSS",rez);
}
//compileazaScss("a.scss");
vFisiere=fs.readdirSync(obGlobal.folderScss);
for( let numeFis of vFisiere ){
    if (path.extname(numeFis)==".scss"){
        compileazaScss(numeFis);
    }
}

fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    console.log(eveniment, numeFis);
    if (eveniment=="change" || eveniment=="rename"){
        let caleCompleta=path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
        }
    }
})

app.listen(8080);//asculta cererile de pe portul 8080
console.log("Serverul a pornit");//afiseaza