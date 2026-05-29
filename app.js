const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vRDl2i7g0UIQW5Jw6dKXmStMBcrYrcsJ2Kxd0dinPfV75Wjoe0z-fxFBQLtxMsD3A8Xby3DpbKmPXMU/pub?gid=0&single=true&output=csv";

let medicamentos = [];

async function cargarMedicamentos(){

try{

const respuesta = await fetch(SHEET_URL);

const texto = await respuesta.text();

const filas = texto.trim().split("\n");

const encabezados =
filas[0]
.split(",")
.map(h => h.trim());

medicamentos = filas
.slice(1)
.map(fila => {

const valores = fila.split(",");

let obj = {};

encabezados.forEach((col,i)=>{

obj[col.trim()] =
valores[i]?.trim() || "";

});

return obj;

});

llenarSelect();

}catch(error){

console.error(error);

alert("Error cargando medicamentos");

}

}

function llenarSelect(){

const select =
document.getElementById("medicamento");

select.innerHTML="";

medicamentos.forEach((med,index)=>{

const option =
document.createElement("option");

option.value=index;

option.textContent=med.nombre;

select.appendChild(option);

});

}

document
.getElementById("buscar")
.addEventListener("input", function(){

const texto =
this.value.toLowerCase();

const select =
document.getElementById("medicamento");

select.innerHTML="";

medicamentos
.filter(m =>
m.nombre.toLowerCase().includes(texto)
)
.forEach((med,index)=>{

const option =
document.createElement("option");

option.value =
medicamentos.indexOf(med);

option.textContent =
med.nombre;

select.appendChild(option);

});

});

function calcular(){

const peso =
parseFloat(
document.getElementById("peso").value
);

const indice =
document.getElementById("medicamento").value;

if(!peso){

alert("Ingrese el peso");

return;

}

const med =
medicamentos[indice];

const dosisKgDia =
parseFloat(med.dosis_kg_dia);

const frecuencia =
parseFloat(med.frecuencia);

const concentracionMl =
parseFloat(med.concentracion_ml);

const concentracionMg =
parseFloat(med.concentracion_mg);

const dosisDia =
peso * dosisKgDia;

const dosisToma =
dosisDia / frecuencia;

const mlToma =
(dosisToma * concentracionMl)
/
concentracionMg;

const horas =
24 / frecuencia;

const resultado =
document.getElementById("resultado");

resultado.style.display="block";

resultado.innerHTML =

`
<div class="result-title">
${med.nombre}
</div>

<div class="result-item">
Peso:
<span class="valor">
${peso} kg
</span>
</div>

<div class="result-item">
Dosis diaria:
<span class="valor">
${dosisDia.toFixed(2)} mg/día
</span>
</div>

<div class="result-item">
Dosis por toma:
<span class="valor">
${dosisToma.toFixed(2)} mg
</span>
</div>

<div class="result-item">
Administrar:
<span class="valor">
${mlToma.toFixed(2)} mL
</span>
</div>

<div class="result-item">
Frecuencia:
<span class="valor">
Cada ${horas} horas
</span>
</div>
`;

}

cargarMedicamentos();
