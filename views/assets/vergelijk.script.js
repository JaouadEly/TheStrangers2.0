console.log("vergelijkscript laadt..");

var vermogen_L = document.getElementById('vermogen_L');
var vermogen_R = document.getElementById('vermogen_R');
var schulden_L = document.getElementById('schulden_L');
var schulden_R = document.getElementById('schulden_R');
var winst_L = document.getElementById('winst_L');
var winst_R = document.getElementById('winst_R');
var naam_L = document.getElementById('naam_L');
var naam_R = document.getElementById('naam_R');

console.log(naam_L.innerText);

if(naam_L.innerText === 'Onbestaande'){
    console.log("Links is onbestaande..");

}else if(naam_R.innerText === 'Onbestaande'){
    console.log("Rechts is onbestaande..");
}else{
    if(vermogen_L.innerText < vermogen_R.innerText){  
        vermogen_L.classList.add("green");
        vermogen_R.classList.add("red");
    }else if(vermogen_L.innerText > vermogen_R.innerText){
        vermogen_L.classList.add("red");
        vermogen_R.classList.add("green");
    }
    if(schulden_L.innerText < schulden_R.innerText){
        schulden_L.classList.add("red");
        schulden_R.classList.add("green");
    }else if(schulden_L.innerText > schulden_R.innerText){
        schulden_L.classList.add("green");
        schulden_R.classList.add("red");
    }
    if(winst_L.innerText < winst_R.innerText){
        winst_L.classList.add("red");
        winst_R.classList.add("green");
    }else if(winst_L.innerText > winst_R.innerText){
        winst_L.classList.add("green");
        winst_R.classList.add("red");
    }
}
