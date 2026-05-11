// Referencias al DOM
const formulario = document.getElementById('formularioEvaluacion');
const cajaErrores = document.getElementById('cajaErrores');
const cajaResultado = document.getElementById('cajaResultado');
const textoSumaPesos = document.getElementById('textoSumaPesos');

// Función para actualizar en tiempo real el contador de "Suma actual de pesos"
function actualizarSumaPesos() {
    let sumaActual = 0;
    for (let i = 1; i <= 5; i++) {
        let valorPeso = parseFloat(document.getElementById(`peso${i}`).value);
        if (!isNaN(valorPeso)) {
            sumaActual += valorPeso;
        }
    }
    textoSumaPesos.textContent = `${sumaActual}%`;
    textoSumaPesos.style.color = (sumaActual === 100) ? "green" : "black";
}

// Escuchar cambios en los inputs de peso
for (let i = 1; i <= 5; i++) {
    document.getElementById(`peso${i}`).addEventListener('input', actualizarSumaPesos);
}

// Lógica principal al hacer clic en "Calcular evaluación"
formulario.addEventListener('submit', function(evento) {
    evento.preventDefault(); 
    
    let errores = [];
    
    // 1. Validar nombre y cargo (Solo letras y espacios)
    const nombre = document.getElementById('nombre').value.trim();
    const cargo = document.getElementById('cargo').value.trim();
    const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (nombre === "") {
        errores.push("El nombre del colaborador es obligatorio.");
    } else if (!regexLetras.test(nombre)) {
        errores.push("El nombre solo debe contener letras.");
    }

    if (cargo === "") {
        errores.push("El cargo del colaborador es obligatorio.");
    } else if (!regexLetras.test(cargo)) {
        errores.push("El cargo solo debe contener letras.");
    }

    let sumaPesosTotal = 0;
    let notaFinal = 0;

    // 2. Validar cada fila de criterios
    for (let i = 1; i <= 5; i++) {
        let puntaje = parseFloat(document.getElementById(`puntaje${i}`).value);
        let peso = parseFloat(document.getElementById(`peso${i}`).value);

        if (isNaN(puntaje) || puntaje < 1 || puntaje > 10) {
            errores.push(`El puntaje del criterio ${i} debe estar entre 1 y 10.`);
        }
        
        if (isNaN(peso) || peso < 0 || peso > 100) {
            errores.push(`El peso del criterio ${i} debe estar entre 0 y 100.`);
        } else {
            sumaPesosTotal += peso;
        }

        if (!isNaN(puntaje) && !isNaN(peso)) {
            notaFinal += (puntaje * peso) / 100;
        }
    }

    // 3. Validar la suma total de los pesos
    if (sumaPesosTotal !== 100) {
        errores.push(`Los pesos deben sumar 100% (actual: ${sumaPesosTotal}%).`);
    }

    // 4. Mostrar errores o el resultado final
    if (errores.length > 0) {
        cajaErrores.innerHTML = "<strong>Corrige los siguientes errores:</strong><ul>" + 
                                errores.map(err => `<li>${err}</li>`).join('') + 
                                "</ul>";
        cajaErrores.classList.remove('oculto');
        cajaResultado.classList.add('oculto');
    } else {
        cajaErrores.classList.add('oculto');
        mostrarResultadoFinal(nombre, notaFinal);
    }
});

function mostrarResultadoFinal(nombre, nota) {
    let categoria = "";
    let claseColor = "";

    if (nota >= 9.0 && nota <= 10.0) {
        categoria = "Excelente";
        claseColor = "excelente";
    } else if (nota >= 7.0 && nota < 9.0) { 
        categoria = "Bueno";
        claseColor = "bueno";
    } else if (nota >= 5.0 && nota < 7.0) {
        categoria = "Regular";
        claseColor = "regular";
    } else {
        categoria = "Insuficiente";
        claseColor = "insuficiente";
    }

    cajaResultado.className = `caja-resultado ${claseColor}`;
    cajaResultado.innerHTML = `
        <p>Colaborador evaluado: <strong>${nombre}</strong></p>
        <p>Nota final ponderada: <strong>${nota.toFixed(2)}</strong></p>
        <p>Categoría de desempeño: <strong>${categoria}</strong></p>
    `;
    cajaResultado.classList.remove('oculto');
}