function buscarCombinacion() {
  // Obtener y validar los valores de entrada
  const inputs = document.querySelectorAll(".grid input");
  const valores = Array.from(inputs)
    .map((input) => Number(input.value))
    .filter((value) => !isNaN(value) && value !== 0);
  const valorObjetivo = Number(document.getElementById("valorObjetivo").value);

  // Validación inicial
  if (valores.length === 0 || isNaN(valorObjetivo)) {
    alert("Por favor ingresa valores en la cuadrícula y un valor objetivo.");
    return;
  }

  // Ordenar los valores de mayor a menor para optimizar la búsqueda
  valores.sort((a, b) => b - a);

  // Variables para almacenar el mejor resultado
  let mejorCombinacion = [];
  let mejorDiferencia = Infinity;
  let encontradoExacto = false;

  /**
   * Implementación optimizada usando backtracking con poda
   * @param {number[]} combinacionActual - Combinación actual siendo evaluada
   * @param {number} indiceInicio - Índice de inicio para la búsqueda
   * @param {number} sumaActual - Suma acumulada de la combinación actual
   */
  function buscarCombinacionesOptimizado(
    combinacionActual,
    indiceInicio,
    sumaActual
  ) {
    // Verificar si la combinación actual es mejor que la anterior
    const diferenciaActual = Math.abs(valorObjetivo - sumaActual);
    if (diferenciaActual < mejorDiferencia) {
      mejorDiferencia = diferenciaActual;
      mejorCombinacion = [...combinacionActual];

      // Si encontramos una coincidencia exacta, terminamos
      if (diferenciaActual === 0) {
        encontradoExacto = true;
        return;
      }
    }

    // Si la suma actual ya excede el objetivo por mucho, podamos esta rama
    if (
      sumaActual > valorObjetivo &&
      sumaActual - valorObjetivo > mejorDiferencia
    ) {
      return;
    }

    // Si no podemos alcanzar el objetivo incluso sumando todos los números restantes, podamos
    let sumaMaximaPosible = sumaActual;
    for (let i = indiceInicio; i < valores.length; i++) {
      sumaMaximaPosible += valores[i];
    }
    if (valorObjetivo - sumaMaximaPosible > mejorDiferencia) {
      return;
    }

    // Explorar posibles combinaciones
    for (let i = indiceInicio; i < valores.length && !encontradoExacto; i++) {
      combinacionActual.push(valores[i]);
      buscarCombinacionesOptimizado(
        combinacionActual,
        i + 1,
        sumaActual + valores[i]
      );
      combinacionActual.pop();
    }
  }

  // Iniciar la búsqueda
  buscarCombinacionesOptimizado([], 0, 0);

  // Mostrar resultados
  const resultadoDiv = document.getElementById("resultado");
  const sumaFinal = mejorCombinacion.reduce((acc, val) => acc + val, 0);

  if (mejorDiferencia === 0) {
    resultadoDiv.textContent = `¡Cuadre Exacto! Valores: ${mejorCombinacion.join(
      " | "
    )}`;
  } else {
    resultadoDiv.textContent = `No se encontró una combinación exacta. La combinación más cercana es: ${mejorCombinacion.join(
      " | "
    )}, con una suma de ${sumaFinal}`;
  }
}

// Las funciones auxiliares se mantienen igual
function limpiarValores() {
  const inputs = document.querySelectorAll(".grid input");
  inputs.forEach((input) => (input.value = ""));
  document.getElementById("valorObjetivo").value = "";
  document.getElementById("resultado").textContent = "";
}

function handlePaste(event) {
  event.preventDefault();
  const clipboardData = event.clipboardData.getData("text");
  const rows = clipboardData.split("\n");

  const inputs = document.querySelectorAll(".grid input");
  let inputIndex = 0;

  rows.forEach((row) => {
    const values = row.split("\t");
    values.forEach((value) => {
      if (inputIndex < inputs.length) {
        inputs[inputIndex].value = value.trim();
        inputIndex++;
      }
    });
  });
}
