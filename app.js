const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vRDl2i7g0UIQW5Jw6dKXmStMBcrYrcsJ2Kxd0dinPfV75Wjoe0z-fxFBQLtxMsD3A8Xby3DpbKmPXMU/pub?gid=0&single=true&output=csv";

let medicamentos = [];

async function cargarMedicamentos() {

    try {

        const response = await fetch(SHEET_URL);

        if (!response.ok) {
            throw new Error("No se pudo cargar Google Sheets");
        }

        const csv = await response.text();

        const filas = csv
            .trim()
            .split("\n")
            .map(f => f.split(","));

        const encabezados = filas[0].map(h => h.trim());

        medicamentos = filas.slice(1).map(fila => {

            let obj = {};

            encabezados.forEach((col, i) => {

                obj[col] = fila[i]
                    ? fila[i].trim()
                    : "";

            });

            return obj;

        });

        llenarMedicamentos();

        console.log(
            "Medicamentos cargados:",
            medicamentos.length
        );

    }
    catch (error) {

        console.error(error);

        alert(
            "Error cargando medicamentos desde Google Sheets"
        );

    }

}

function llenarMedicamentos() {

    const select =
        document.getElementById("medicamento");

    select.innerHTML = "";

    medicamentos.forEach((med, index) => {

        const option =
            document.createElement("option");

        option.value = index;

        option.textContent =
            med.NOMBRE || "Sin nombre";

        select.appendChild(option);

    });

}

document
.getElementById("buscar")
.addEventListener("input", function () {

    const texto =
        this.value.toLowerCase();

    const select =
        document.getElementById("medicamento");

    select.innerHTML = "";

    medicamentos
        .filter(m =>
            (m.NOMBRE || "")
            .toLowerCase()
            .includes(texto)
        )
        .forEach((med) => {

            const option =
                document.createElement("option");

            option.value =
                medicamentos.indexOf(med);

            option.textContent =
                med.NOMBRE;

            select.appendChild(option);

        });

});

function calcular() {

    const peso =
        parseFloat(
            document.getElementById("peso").value
        );

    if (!peso || peso <= 0) {

        alert(
            "Ingrese un peso válido"
        );

        return;

    }

    const indice =
        document.getElementById("medicamento").value;

    if (indice === "") {

        alert(
            "Seleccione un medicamento"
        );

        return;

    }

    const med =
        medicamentos[indice];

    const dosisKgDia =
        parseFloat(
            med.DOSIS_MG_KG_DIA
        );

    const frecuencia =
        parseFloat(
            med.FRECUENCIA
        );

    const concentracionMl =
        parseFloat(
            med.CONCENTRACION_ML
        );

    const concentracionMg =
        parseFloat(
            med.CONCENTRACION_MG
        );

    if (
        isNaN(dosisKgDia) ||
        isNaN(frecuencia) ||
        isNaN(concentracionMl) ||
        isNaN(concentracionMg)
    ) {

        alert(
            "Datos incompletos en el medicamento seleccionado"
        );

        return;

    }

    const dosisDia =
        peso * dosisKgDia;

    const dosisPorToma =
        dosisDia / frecuencia;

    const mlPorToma =
        (dosisPorToma * concentracionMl)
        / concentracionMg;

    const horas =
        24 / frecuencia;

    const resultado =
        document.getElementById("resultado");

    resultado.style.display = "block";

    resultado.innerHTML = `

        <div class="result-title">
            ${med.NOMBRE}
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
                ${dosisPorToma.toFixed(2)} mg
            </span>
        </div>

        <div class="result-item">
            Administrar:
            <span class="valor">
                ${mlPorToma.toFixed(2)} mL
            </span>
        </div>

        <div class="result-item">
            Frecuencia:
            <span class="valor">
                Cada ${horas} horas
            </span>
        </div>

        <div class="result-item">
            Vía:
            <span class="valor">
                ${med.VIA || "-"}
            </span>
        </div>

        <div class="result-item">
            Categoría:
            <span class="valor">
                ${med.CATEGORIA || "-"}
            </span>
        </div>

        <div class="result-item">
            Dosis máxima:
            <span class="valor">
                ${med["DOSIS MAXIMAS"] || "-"}
            </span>
        </div>

    `;

}

window.onload = () => {

    cargarMedicamentos();

};
