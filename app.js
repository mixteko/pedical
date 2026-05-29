const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vRDl2i7g0UIQW5Jw6dKXmStMBcrYrcsJ2Kxd0dinPfV75Wjoe0z-fxFBQLtxMsD3A8Xby3DpbKmPXMU/pub?gid=0&single=true&output=csv";

let medicamentos = [];

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
.map(f=>f.split(","));

const encabezados =
filas[0].map(
h=>h.trim()
);

medicamentos =
filas.slice(1).map(fila=>{

let obj = {};

encabezados.forEach(
(col,i)=>{

obj[col] =
fila[i]
? fila[i].trim()
: "";

}
);

return obj;

});

llenarMedicamentos();

}catch(error){

console.error(error);

alert(
"Error cargando medicamentos"
);

}

}

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

}
);

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
this.value.toLowerCase();

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

}
);

}
);

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
💊 ${med.NOMBRE}
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

📋 Copiar indicación

</button>

`;

window.indicacionActual =
`${med.NOMBRE}

Peso: ${peso} kg

Administrar:
${mlToma.toFixed(2)} mL

Cada ${24/frecuencia} horas`;

}
/* ================================= */
/* COPIAR INDICACION */
/* ================================= */

function copiarIndicacion(){

if(!window.indicacionActual){

alert(
"No hay indicación"
);

return;

}

navigator.clipboard.writeText(
window.indicacionActual
);

alert(
"Indicación copiada"
);

}

/* ================================= */
/* PESTAÑAS */
/* ================================= */

function mostrarTab(tab){

document.getElementById(
"medicamentos-tab"
).style.display = "none";

document.getElementById(
"mantenimiento-tab"
).style.display = "none";

document.getElementById(
"deshidratacion-tab"
).style.display = "none";

document
.querySelectorAll(".tab-btn")
.forEach(btn=>{

btn.classList.remove(
"active"
);

});

if(tab==="medicamentos"){

document.getElementById(
"medicamentos-tab"
).style.display = "block";

document.getElementById(
"btnMedicamentos"
).classList.add(
"active"
);

}

if(tab==="mantenimiento"){

document.getElementById(
"mantenimiento-tab"
).style.display = "block";

document.getElementById(
"btnMantenimiento"
).classList.add(
"active"
);

}

if(tab==="deshidratacion"){

document.getElementById(
"deshidratacion-tab"
).style.display = "block";

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
💧 Mantenimiento
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
