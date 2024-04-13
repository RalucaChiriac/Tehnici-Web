const express = require("express");
const fs = require('fs');
const path=require('path');
const sharp=require('sharp');
const sass=require('sass');
// const ejs=require('ejs');

obGlobal = {
    obErori: null,
    obImagini:null,
    folderScss:path.join(__dirname,"Resurse/scss"),
    folderCss:path.join(__dirname,"Resurse/css"), 
    folderBackup:path.join(__dirname,"backup"),
};

app = express(); //creez un obiect server express
//console.log va afisa in consola, dirname este folderul in care se gaseste fisierul pe care-l rulez eu
console.log("Folder proiect", __dirname);
//filename = dirname + numele fisierului pe care-l rulez eu
console.log("Cale fisier", __filename);
// directorul de lucuru este cel de unde rulez iar dirname folderul proiectului(apilcatiei)
//cwd = Current Working Directory
console.log("Director de lucru", process.cwd());
 
app.set("view engine","ejs");

vect_foldere = ["temp", "temp1", "backup"]; //creare foldere
for(let folder of vect_foldere){
    let caleFolder=path.join(__dirname,folder)
    if(!fs.existsSync(caleFolder)){
        fs.mkdirSync(caleFolder);//verifica existenta unui fisier, daca nu exista il creaza
    }
}

//primeste o cerere care incepe cu /Resurse si va trimite fisiere din folderul (__dirname+"/Resurse")
app.use("/Resurse", express.static(__dirname+"/Resurse"));
app.use("/node_modules", express.static(__dirname+"/node_modules"));

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