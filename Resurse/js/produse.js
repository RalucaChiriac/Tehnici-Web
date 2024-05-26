window.addEventListener("DOMContentLoaded",function() {
    // bonus onchnage
    var descriere = document.getElementById("inp-descriere");
    var pret = document.getElementById("inp-pret");
    var nume = document.getElementById("inp-nume");
    var checkboxuri = document.getElementsByName("gr_ch");
    var culoare = document.getElementById("inp-culoare");
    var categorie = document.getElementById("inp-categorie");
    var nr_fire = document.getElementById("inp-nr_fire");

    function updateOnChange() {
        var displayCount = 0;
        var produse = Array.from(document.getElementsByClassName("produs"));
        var pt_alergici = document.querySelector('input[name="gr_rad"]:checked');

        for (let prod of produse) {
            let val_descriere = prod.getElementsByClassName("val-descriere")[0].innerHTML.toLowerCase();
            let val_pret = parseInt(prod.getElementsByClassName("val-pret")[0].innerHTML);
            let val_nume = prod.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
            let val_flori_componente = prod.getElementsByClassName("val-flori_componente")[0].innerHTML;
            let val_culoare = prod.getElementsByClassName("val-culoare")[0].innerHTML;
            let val_categorie = prod.getElementsByClassName("val-categorie")[0].innerHTML;
            let val_pt_alergici = prod.getElementsByClassName("val-pt_alergici")[0].innerHTML;
            let val_nr_fire = prod.getElementsByClassName("val-nr_fire")[0].innerHTML;


            // inputuri
            let inp_descriere = descriere.value.toLowerCase();
            let array_descriere = [];
            if(inp_descriere!="") {
                let cuv = inp_descriere.split(",");
                for(let c of cuv) {
                    c = c.trim();
                    array_descriere.push(c);
                }
            }
            let inp_pret = parseInt(pret.value);
            let inp_nume = nume.value.toLowerCase();
            let inp_flori_componente = [];
            for(let ch of checkboxuri) {
                if(ch.checked){
                    inp_flori_componente.push(ch.value);
                }
            }
            let options = [];
            for(let op of culoare.options) {
                if(op.selected) {
                    options.push(op.value);
                }
            }
            let inp_categorie = categorie.value;
            let inp_pt_alergici = pt_alergici.value;
            let inp_nr_fire = nr_fire.value;
            if (inp_nr_fire != "oricate") {
                let vals = inp_nr_fire.split(":");
                var nr_fire_inf = parseInt(vals[0]);
                var nr_fire_sup = parseInt(vals[1]);
            }


            // conditii
            let cond1 = false;
            if (array_descriere.length == 0)
                cond1 = true;
            for (let c of array_descriere) {
                cond1 = (val_descriere.includes(c));
                if (cond1 == true)
                    break;
            }
            let cond2 = (val_pret >= inp_pret);
            let cond3 = (inp_nume == "") ? true : (val_nume.startsWith(inp_nume));
            let cond4 = false;
            for (let floare of inp_flori_componente) {
                cond4 = (val_flori_componente.includes(floare));
                if (cond4 == true)
                    break;
            }
            let cond5 = false;
            for(let op of options) {
                if(val_culoare == op || op == "toate") {
                    cond5 = true;
                }
            }
            let cond6 = (inp_categorie == "") ? true : (val_categorie == inp_categorie);
            let cond7 = (inp_pt_alergici == "oricare") ? true : (inp_pt_alergici.trim() == val_pt_alergici.trim());
            let cond8 = (inp_nr_fire == "oricate") ? true : (val_nr_fire >= nr_fire_inf && val_nr_fire <= nr_fire_sup);


            if (cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7 && cond8) {
                prod.style.display = "block";
                displayCount++;
            } else {
                prod.style.display = "none";
            }

            if (displayCount === 0) {
                document.getElementById("no-products-message").style.display = "block";
            } else {
                document.getElementById("no-products-message").style.display = "none";
            }
        }
    }

    descriere.onchange = function() {
        // verificare descriere
        let condValidare2=true;
        let inpNume=this.value.toLowerCase().trim();
        condValidare2 = condValidare2 && inpNume.match(new RegExp("^[a-zA-Z ,]*$"));
        if (!condValidare2){
            this.classList.add("is-invalid");
            document.getElementById("mesaj-invalid-txtarea").style.display="block";
        }
        else if(this.classList.contains("is-invalid") && condValidare2){
            this.classList.remove("is-invalid");
            document.getElementById("mesaj-invalid-txtarea").style.display="none";
        }
        updateOnChange();
    }

    pret.onchange = function() {
        document.getElementById("infoRange").innerHTML = `(${this.value})`;
        updateOnChange();
    }

    nume.onchange=function(){
        // verficare nume
        let condValidare1=true;
        let inpNume=this.value.toLowerCase().trim();
        condValidare1 = condValidare1 && inpNume.match(new RegExp("^[a-zA-Z]*$"));
        if (!condValidare1){
            this.classList.add("is-invalid");
            document.getElementById("mesaj-invalid-txt").style.display="block";
        }
        else if(this.classList.contains("is-invalid") && condValidare1){
            this.classList.remove("is-invalid");
            document.getElementById("mesaj-invalid-txt").style.display="none";
        }

        updateOnChange();
    }

    checkboxuri.forEach(ch => {
        ch.addEventListener('change', updateOnChange);
    });

    culoare.onchange = function() {
        updateOnChange();
    }

    categorie.onchange = function() {
        updateOnChange();
    }

    var radios = document.getElementsByName("gr_rad");
    radios.forEach(radio => {
        radio.addEventListener('change', updateOnChange);
    });

    nr_fire.onchange = function() {
        updateOnChange();
    }

    document.getElementById("filtrare").onclick=function(){
        let val_descriere = document.getElementById("inp-descriere").value.toLowerCase();
        let condValidare2=true;
        condValidare2 = condValidare2 && val_descriere.match(new RegExp("^[a-zA-Z ,]*$"));
        if (!condValidare2){
            return;
        }

        let array_descriere = [];
        if(val_descriere!=''){
            var cuv = val_descriere.split(",");
            for(let c of cuv) {
                c = c.trim();
                array_descriere.push(c);
            }
        }
        
        let val_nume=document.getElementById("inp-nume").value.toLowerCase().trim();
        let condValidare1=true;
        condValidare1 = condValidare1 && val_nume.match(new RegExp("^[a-zA-Z]*$"));
        if (!condValidare1){
            return;
        }

        let checkboxuri=document.getElementsByName("gr_ch");
        let val_flori_componente = [];
        for(let ch of checkboxuri){
            if(ch.checked){
                val_flori_componente.push(ch.value);
            }
        }

        let val_culoare = document.getElementById("inp-culoare");
        let options = [];
        for(let op of val_culoare.options) {
            if(op.selected) {
                options.push(op.value);
            }
        }

        let val_categorie = document.getElementById("inp-categorie").value;

        let val_pret=document.getElementById("inp-pret").value;

        // querySelector = selector css pentru input-urile care au name=gr_rad si sunt checked
        let val_pt_alergici = document.querySelector('input[name="gr_rad"]:checked').value;

        let val_nr_fire = document.getElementById("inp-nr_fire").value;
        if (val_nr_fire != "oricate") {
            let vals = val_nr_fire.split(":");
            var nr_fire_inf = parseInt(vals[0]);
            var nr_fire_sup = parseInt(vals[1]);
        }

        var produse=document.getElementsByClassName("produs");

        for (let prod of produse){
            prod.style.display="none";

            let descriere = prod.getElementsByClassName("val-descriere")[0].innerHTML.toLowerCase();
            let cond1 = false;
            if (array_descriere.length == 0)
                cond1 = true;
            
            for (let c of array_descriere) {
                cond1 = (descriere.includes(c));
                if (cond1 == true)
                    break;
            }

            let flori_componente = prod.getElementsByClassName("val-flori_componente")[0].innerHTML;
            let cond2 = false;
            for (let floare of val_flori_componente) {
                cond2 = (flori_componente.includes(floare));
                if (cond2 == true)
                    break;
            }

            let culoare = prod.getElementsByClassName("val-culoare")[0].innerHTML;
            let cond3 = false;

            for(let op of options) {
                if(culoare == op || op == "toate") {
                    cond3 = true;
                }
            }

            let nume=prod.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();

            let cond4 = (nume == "") ? true : (nume.startsWith(val_nume));
            
            let pret=parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
            let cond5 = (pret >= val_pret);

            let categorie = prod.getElementsByClassName("val-categorie")[0].innerHTML;
            let cond6 = (val_categorie == "") ? true : (categorie == val_categorie);

            let pt_alergici = prod.getElementsByClassName("val-pt_alergici")[0].innerHTML;
            let cond7 = (val_pt_alergici == "oricare") ? true : (pt_alergici.trim() == val_pt_alergici.trim());

            let nr_fire = parseInt(prod.getElementsByClassName("val-nr_fire")[0].innerHTML);
            let cond8 = (val_nr_fire == "oricate") ? true : (nr_fire >= nr_fire_inf && nr_fire <= nr_fire_sup);

            if(cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7 && cond8){
                prod.style.display="block";
            }
        }
    }

    document.getElementById("resetare").onclick= function(){
        if(confirm("Sunteti siguri ca doriti sa resetati filtrele?") == true){
            document.getElementById("inp-nume").value="";
            document.getElementById("inp-descriere").value="";
            for(let ch of document.getElementsByName("gr_ch")) {
                ch.checked = true;
            }
            document.getElementById("inp-pret").value=document.getElementById("inp-pret").min;
            document.getElementById("infoRange").innerHTML=`(${document.getElementById("inp-pret").value})`;
            for(let op of document.getElementById("inp-culoare").options) {
                if(op.selected) {
                    op.selected = false;
                }
            }
            document.getElementById("sel-mult-toate").selected = true;
            document.getElementById("inp-categorie").value = "";
            document.getElementById("i_rad3").checked=true;
            document.getElementById("sel-toate").selected=true;
            var produse=document.getElementsByClassName("produs");
            for (let prod of produse){
                prod.style.display="block";
            }
        }
    }

    function sortare (semn){
        var produse=document.getElementsByClassName("produs");
        var v_produse= Array.from(produse);
        v_produse.sort(function (a,b){
            let pret_a=parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
            let pret_b=parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);
            if(pret_a==pret_b){
                let flori_componente_a = a.getElementsByClassName("val-flori_componente")[0].innerHTML;
                let flori_componente_b = b.getElementsByClassName("val-flori_componente")[0].innerHTML;
                let numar_flori_componente_a = flori_componente_a.split(",").length;
                let numar_flori_componente_b = flori_componente_b.split(",").length;

                return semn*(numar_flori_componente_a - numar_flori_componente_b);
            }
            return semn*(pret_a - pret_b);
        });
        for(let prod of v_produse){
            prod.parentElement.appendChild(prod);
        }
    }
    document.getElementById("sortCrescNume").onclick=function(){
        sortare(1);
    }
    document.getElementById("sortDescrescNume").onclick=function(){
        sortare(-1);
    }

    window.onkeydown = function(e){
        if (e.key=="c" && e.altKey){
            if(document.getElementById("info-suma"))
                return;
            var produse=document.getElementsByClassName("produs");
            let suma=0;
            for (let prod of produse){
                if(prod.style.display!="none")
                {
                    let pret=parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
                    suma+=pret;
                }
            }
            
            let p=document.createElement("p");
            p.innerHTML=`Suma tuturor produselor afisate: ${suma}`;
            p.id="info-suma";
            ps=document.getElementById("p-suma");
            container = ps.parentNode;
            frate=ps.nextElementSibling;
            container.insertBefore(p, frate);
            setTimeout(function(){
                let info=document.getElementById("info-suma");
                if(info)
                    info.remove();
            }, 1000)
        }
    }

    var produse=document.getElementsByClassName("produs");
    var v_produse=Array.from(produse);
    var zile=["Duminica", "Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata"];
    var luni=["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
    for(let prod of v_produse) {
        var data_adaugare = new Date(prod.getElementsByClassName("val-data_adaugare")[0].innerHTML);
        var data_formatata = data_adaugare.getDate() + "(" + zile[data_adaugare.getDay()] + ")/" + luni[data_adaugare.getMonth()] + "/" + data_adaugare.getFullYear();
        
        prod.getElementsByClassName("val-data_adaugare")[0].innerHTML = data_formatata;
        if(prod.getElementsByClassName("val-pt_alergici")[0].innerHTML == "true"){
            prod.getElementsByClassName("val-pt_alergici")[0].innerHTML = "da";
        }
        else{
            prod.getElementsByClassName("val-pt_alergici")[0].innerHTML = "nu";
        }
    }
});