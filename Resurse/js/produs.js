window.addEventListener("DOMContentLoaded",function() {
    var zile=["Duminica", "Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata"];
    var luni=["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
    var data_adaugare = new Date(document.getElementsByClassName("data_adaugare")[0].innerHTML);
    var data_formatata = data_adaugare.getDate() + "(" + zile[data_adaugare.getDay()] + ")/" + luni[data_adaugare.getMonth()] + "/" + data_adaugare.getFullYear();
    document.getElementsByClassName("data_adaugare")[0].innerHTML = data_formatata;
    if(document.getElementsByClassName("pt_alergici")[0].innerHTML == "true"){
        document.getElementsByClassName("pt_alergici")[0].innerHTML = "da";
    }
    else{
        document.getElementsByClassName("pt_alergici")[0].innerHTML = "nu";
    }
});