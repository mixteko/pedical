const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vRDl2i7g0UIQW5Jw6dKXmStMBcrYrcsJ2Kxd0dinPfV75Wjoe0z-fxFBQLtxMsD3A8Xby3DpbKmPXMU/pub?gid=0&single=true&output=csv";

let medicamentos = [];
let indicacionActual = "";

/* ================================= */
/* GOOGLE SHEETS */
/* ================================= */

async function cargarMedicamentos(){

try{

const response =
await fetch(SHEET_URL);

const csv =
await response.text();

const filas =
csv.trim()
.split("\n")
.map(f => f.split(","));

const encabezados =
filas[0].map(
h => h.trim()
);

medicamentos =
filas.slice(1).map(
fila => {

let obj = {};

encabezados.forEach(
(col,i)=>{

obj[col] =
fila[i]
? fila[i].trim()
: "";

});

return obj;

});

llenarMedicamentos();

const estado =
document.getElementById(
"estadoConexion"
);

if(estado){

estado.innerHTML =
"Base de medicamentos cargada";

}

}catch(error){

console.error(error);

const estado =
document.getElementById(
"estadoConexion"
);

if(estado){

estado.innerHTML =
"Error cargando medicamentos";

}

alert(
"Error cargando medicamentos"
);

}

}
/* ================================= */
/* LLENAR SELECT */
/* ================================= */

function llenarMedicamentos(){

const select =
document.getElementById(
"medicamento"
);

select.innerHTML = "";

medicamentos.forEach(
(med,index)=>{

const option =
document.createElement(
"option"
);

option.value =
index;

option.textContent =
med.NOMBRE;

select.appendChild(
option
);

});

restaurarMedicamento();

}

/* ================================= */
/* BUSCADOR */
/* ================================= */

function activarBuscador(){

const buscador =
document.getElementById(
"buscar"
);

if(!buscador) return;

buscador.addEventListener(
"input",
function(){

const texto =
this.value
.toLowerCase();

const select =
document.getElementById(
"medicamento"
);

select.innerHTML = "";

medicamentos
.filter(
m =>
(m.NOMBRE || "")
.toLowerCase()
.includes(texto)
)
.forEach(
(med)=>{

const option =
document.createElement(
"option"
);

option.value =
medicamentos.indexOf(
med
);

option.textContent =
med.NOMBRE;

select.appendChild(
option
);

});

});

}

/* ================================= */
/* LOCAL STORAGE */
/* ================================= */

function restaurarMedicamento(){

const ultimo =
localStorage.getItem(
"ultimoMedicamento"
);

if(
ultimo !== null
){

setTimeout(()=>{

const select =
document.getElementById(
"medicamento"
);

select.value =
ultimo;

},300);

}

}
/* ================================= */
/* MEDICAMENTOS */
/* ================================= */

function calcularMedicamento(){

const peso =
parseFloat(
document.getElementById(
"peso"
).value
);

const indice =
document.getElementById(
"medicamento"
).value;

localStorage.setItem(
"ultimoMedicamento",
indice
);

if(!peso){

alert(
"Ingrese peso"
);

return;

}

const med =
medicamentos[indice];

if(!med){

alert(
"Seleccione un medicamento"
);

return;

}

const dosisDia =
peso *
parseFloat(
med.DOSIS_MG_KG_DIA
);

const frecuencia =
parseFloat(
med.FRECUENCIA
);

const dosisToma =
dosisDia /
frecuencia;

const mlToma =
(
dosisToma *
parseFloat(
med.CONCENTRACION_ML
)
)
/
parseFloat(
med.CONCENTRACION_MG
);

const r =
document.getElementById(
"resultado"
);

r.style.display =
"block";

r.innerHTML = `

<div class="result-title">
${med.NOMBRE}
</div>

<div class="result-item">
<span>Categoría</span>
<span class="valor">
${med.CATEGORIA || "-"}
</span>
</div>

<div class="result-item">
<span>Vía</span>
<span class="valor">
${med.VIA || "-"}
</span>
</div>

<div class="result-item">
<span>Dosis máxima</span>
<span class="valor">
${med["DOSIS MAXIMAS"] || "-"}
</span>
</div>

<div class="result-item">
<span>Dosis diaria</span>
<span class="valor">
${dosisDia.toFixed(2)} mg
</span>
</div>

<div class="result-item">
<span>Dosis por toma</span>
<span class="valor">
${dosisToma.toFixed(2)} mg
</span>
</div>

<div class="result-item">
<span>Administrar</span>
<span class="valor">
${mlToma.toFixed(2)} mL
</span>
</div>

<div class="result-item">
<span>Frecuencia</span>
<span class="valor">
Cada ${24/frecuencia} horas
</span>
</div>

<button
onclick="copiarIndicacion()">

Copiar indicación

</button>

`;

indicacionActual =

`${med.NOMBRE}

Categoría:
${med.CATEGORIA || "-"}

Vía:
${med.VIA || "-"}

Dosis máxima:
${med["DOSIS MAXIMAS"] || "-"}

Peso:
${peso} kg

Dosis diaria:
${dosisDia.toFixed(2)} mg

Dosis por toma:
${dosisToma.toFixed(2)} mg

Administrar:
${mlToma.toFixed(2)} mL

Frecuencia:
Cada ${24/frecuencia} horas`;

}
/* ================================= */
/* COPIAR INDICACION */
/* ================================= */

function copiarIndicacion(){

if(!indicacionActual){

alert(
"No hay indicación"
);

return;

}

navigator.clipboard.writeText(
indicacionActual
);

alert(
"Indicación copiada"
);

}

/* ================================= */
/* LIMPIAR */
/* ================================= */

function limpiarMedicamentos(){

document.getElementById(
"peso"
).value = "";

document.getElementById(
"buscar"
).value = "";

document.getElementById(
"resultado"
).innerHTML = "";

document.getElementById(
"resultado"
).style.display =
"none";

}

function limpiarMantenimiento(){

document.getElementById(
"pesoMantenimiento"
).value = "";

document.getElementById(
"resultadoMantenimiento"
).innerHTML = "";

document.getElementById(
"resultadoMantenimiento"
).style.display =
"none";

}

function limpiarDeshidratacion(){

document.getElementById(
"pesoDeshidratacion"
).value = "";

document.getElementById(
"porcentaje"
).value = "5";

document.getElementById(
"gradoDeshidratacion"
).value = "5";

document.getElementById(
"resultadoDeshidratacion"
).innerHTML = "";

document.getElementById(
"resultadoDeshidratacion"
).style.display =
"none";

}

/* ================================= */
/* PESTAÑAS */
/* ================================= */

function mostrarTab(tab){

document.getElementById(
"medicamentos-tab"
).style.display =
"none";

document.getElementById(
"mantenimiento-tab"
).style.display =
"none";

document.getElementById(
"deshidratacion-tab"
).style.display =
"none";

document
.querySelectorAll(
".tab-btn"
)
.forEach(btn=>{

btn.classList.remove(
"active"
);

});

if(tab==="medicamentos"){

document.getElementById(
"medicamentos-tab"
).style.display =
"block";

document.getElementById(
"btnMedicamentos"
).classList.add(
"active"
);

}

if(tab==="mantenimiento"){

document.getElementById(
"mantenimiento-tab"
).style.display =
"block";

document.getElementById(
"btnMantenimiento"
).classList.add(
"active"
);

}

if(tab==="deshidratacion"){

document.getElementById(
"deshidratacion-tab"
).style.display =
"block";

document.getElementById(
"btnDeshidratacion"
).classList.add(
"active"
);

}

}
/* ================================= */
/* HOLLIDAY SEGAR */
/* ================================= */

function mantenimientoHS(peso){

if(peso <= 10){

return peso * 100;

}

if(peso <= 20){

return 1000 +
(
(peso - 10)
*
50
);

}

return 1500 +
(
(peso - 20)
*
20
);

}

/* ================================= */
/* MANTENIMIENTO */
/* ================================= */

function calcularMantenimiento(){

const peso =
parseFloat(
document.getElementById(
"pesoMantenimiento"
).value
);

if(!peso){

alert(
"Ingrese peso"
);

return;

}

const total =
mantenimientoHS(
peso
);

const mlHora =
total / 24;

const micro =
Math.round(
mlHora
);

const macro =
Math.round(
(mlHora * 20) / 60
);

const volumen8 =
total * (8/24);

const volumen16 =
total * (16/24);

const r =
document.getElementById(
"resultadoMantenimiento"
);

r.style.display =
"block";

r.innerHTML = `

<div class="result-title">
Mantenimiento hídrico
</div>

<div class="result-item">
<span>mL/día</span>
<span class="valor">
${total.toFixed(0)}
</span>
</div>

<div class="result-item">
<span>mL/hora</span>
<span class="valor">
${mlHora.toFixed(1)}
</span>
</div>

<div class="result-item">
<span>Microgotas/min</span>
<span class="valor">
${micro}
</span>
</div>

<div class="result-item">
<span>Macrogotas/min</span>
<span class="valor">
${macro}
</span>
</div>

<div class="result-item">
<span>Volumen 8 h</span>
<span class="valor">
${volumen8.toFixed(0)} mL
</span>
</div>

<div class="result-item">
<span>Volumen 16 h</span>
<span class="valor">
${volumen16.toFixed(0)} mL
</span>
</div>

`;

}
/* ================================= */
/* DESHIDRATACION */
/* ================================= */

function actualizarPorcentaje(){

const grado =
document.getElementById(
"gradoDeshidratacion"
).value;

const porcentaje =
document.getElementById(
"porcentaje"
);

if(
grado === "personalizada"
){
return;
}

porcentaje.value =
grado;

}

function calcularDeshidratacion(){

const peso =
parseFloat(
document.getElementById(
"pesoDeshidratacion"
).value
);

const porcentaje =
parseFloat(
document.getElementById(
"porcentaje"
).value
);

const tipoSolucion =
document.getElementById(
"tipoSolucion"
).value;

if(
!peso ||
!porcentaje
){

alert(
"Complete los datos"
);

return;

}

const deficit =
peso *
porcentaje *
10;

const mantenimiento =
mantenimientoHS(
peso
);

const total24 =
deficit +
mantenimiento;

const mantenimiento8 =
mantenimiento *
(8/24);

const mantenimiento16 =
mantenimiento *
(16/24);

const primeras8 =
(deficit / 2) +
mantenimiento8;

const siguientes16 =
(deficit / 2) +
mantenimiento16;

const velocidad8 =
primeras8 / 8;

const velocidad16 =
siguientes16 / 16;

const micro8 =
Math.round(
velocidad8
);

const macro8 =
Math.round(
(velocidad8 * 20) / 60
);

const micro16 =
Math.round(
velocidad16
);

const macro16 =
Math.round(
(velocidad16 * 20) / 60
);

let bolo = 0;

if(
porcentaje >= 10
){

bolo =
peso * 20;

}

const r =
document.getElementById(
"resultadoDeshidratacion"
);

r.style.display =
"block";

r.innerHTML = `

<div class="result-title">
Deshidratación
</div>

<div class="result-item">
<span>Solución</span>
<span class="valor">
${tipoSolucion}
</span>
</div>

<div class="result-item">
<span>Déficit hídrico</span>
<span class="valor">
${deficit.toFixed(0)} mL
</span>
</div>

<div class="result-item">
<span>Mantenimiento 24 h</span>
<span class="valor">
${mantenimiento.toFixed(0)} mL
</span>
</div>

<div class="result-item">
<span>Total 24 h</span>
<span class="valor">
${total24.toFixed(0)} mL
</span>
</div>

${bolo > 0 ? `

<div class="result-item">
<span>Bolo inicial</span>
<span class="valor">
${bolo.toFixed(0)} mL
</span>
</div>

` : ""}

<div class="result-item">
<span>Primeras 8 h</span>
<span class="valor">
${primeras8.toFixed(0)} mL
</span>
</div>

<div class="result-item">
<span>Velocidad 8 h</span>
<span class="valor">
${velocidad8.toFixed(1)} mL/h
</span>
</div>

<div class="result-item">
<span>Microgotas 8 h</span>
<span class="valor">
${micro8}/min
</span>
</div>

<div class="result-item">
<span>Macrogotas 8 h</span>
<span class="valor">
${macro8}/min
</span>
</div>

<div class="result-item">
<span>Siguientes 16 h</span>
<span class="valor">
${siguientes16.toFixed(0)} mL
</span>
</div>

<div class="result-item">
<span>Velocidad 16 h</span>
<span class="valor">
${velocidad16.toFixed(1)} mL/h
</span>
</div>

<div class="result-item">
<span>Microgotas 16 h</span>
<span class="valor">
${micro16}/min
</span>
</div>

<div class="result-item">
<span>Macrogotas 16 h</span>
<span class="valor">
${macro16}/min
</span>
</div>

`;

}

/* ================================= */
/* INICIO */
/* ================================= */

window.addEventListener(
"DOMContentLoaded",
()=>{

cargarMedicamentos();

activarBuscador();

document.getElementById(
"btnMedicamentos"
).onclick =
()=>mostrarTab(
"medicamentos"
);

document.getElementById(
"btnMantenimiento"
).onclick =
()=>mostrarTab(
"mantenimiento"
);

document.getElementById(
"btnDeshidratacion"
).onclick =
()=>mostrarTab(
"deshidratacion"
);

document.getElementById(
"btnCalcular"
).onclick =
calcularMedicamento;

document.getElementById(
"btnMantenimientoCalc"
).onclick =
calcularMantenimiento;

document.getElementById(
"btnDeshidratacionCalc"
).onclick =
calcularDeshidratacion;

document.getElementById(
"gradoDeshidratacion"
).addEventListener(
"change",
actualizarPorcentaje
);

/* BOTONES LIMPIAR */

const btnLM =
document.getElementById(
"btnLimpiarMedicamentos"
);

if(btnLM){
btnLM.onclick =
limpiarMedicamentos;
}

const btnLMan =
document.getElementById(
"btnLimpiarMantenimiento"
);

if(btnLMan){
btnLMan.onclick =
limpiarMantenimiento;
}

const btnLD =
document.getElementById(
"btnLimpiarDeshidratacion"
);

if(btnLD){
btnLD.onclick =
limpiarDeshidratacion;
}

});

/* ================================= */
/* PWA */
/* ================================= */

if(
"serviceWorker"
in navigator
){

window.addEventListener(
"load",
()=>{

navigator.serviceWorker.register(
"/pedical/service-worker.js",
{
scope:"/pedical/"
}
)
.catch(
err=>console.log(err)
);

});

}
