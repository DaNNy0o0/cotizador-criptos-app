// ******* SELECTORES *******

// Seleccion del select de las criptomonedas y de las monedas
const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedasSelect = document.querySelector("#moneda");

const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objBusqueda = {
  moneda: "",
  criptomoneda: "",
};

// **************************************************

// ******* EVENT LISTENERS *******

// Cuando carga el DOM, lanzamos la funcion para obtener el listado de criptomonedas
document.addEventListener("DOMContentLoaded", () => {
  consultarCriptomonedas();
  formulario.addEventListener("submit", submitFormulario);

  // Leemos los valores de cada select al cambiar de option
  criptomonedasSelect.addEventListener("change", leerValor);
  monedasSelect.addEventListener("change", leerValor);
});

// ******* FUNCIONES *******

// Promise que almacena el listado de criptos desde el fetch
const obtenerCriptomonedas = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

// **************************************************

// Funcion que realiza el fetch y trae las criptomonedas
function consultarCriptomonedas() {
  const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

  fetch(url)
    .then((response) => response.json())
    .then((resolve) => obtenerCriptomonedas(resolve.Data))
    .then((criptomonedas) => selectCriptomonedas(criptomonedas));
}

// **************************************************

// Creamos y asignamos cada criptomonedas a un option y lo inyectamos en el select
function selectCriptomonedas(criptomonedas) {
  criptomonedas.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;

    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;

    criptomonedasSelect.appendChild(option);
  });
}

// **************************************************

// Funcion que lee el valor de cada select y lo asigna al objeto general de la busqueda
function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value;
}

// **************************************************

// Funcion que valida el formulario
function submitFormulario(e) {
  e.preventDefault();

  // Validar
  const { moneda, criptomoneda } = objBusqueda;

  if (moneda === "" || criptomoneda === "") {
    mostrarAlerta("Ambos campos son obligatorios");
    return;
  }

  // Consultar la API con los resultados
  consultarAPI();
}

// **************************************************

// Funcion que muestra mensaje de alerta
function mostrarAlerta(mensaje) {
  // Validar si ya hay una alerta
  const alerta = document.querySelector(".error");

  // Si no hay ninguna (retorna false)
  if (!alerta) {
    // Crear alerta
    const alerta = document.createElement("DIV");
    // Añadimos las clases
    alerta.classList.add("error");
    // Añadimos el mensaje a la alerta
    alerta.textContent = mensaje;

    // Añadimos la alerta al formulario
    formulario.appendChild(alerta);

    // Eliminar alerta despues de 5 segundos
    setTimeout(() => {
      alerta.remove();
    }, 5000);
  }
}

// **************************************************

// Funcion que realiza la consulta a la API con los valores ya agregados a objBusqueda
function consultarAPI() {
  // Extraemos los valores
  const { moneda, criptomoneda } = objBusqueda;

  // Creamos la url para hacer el fetch
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  // Mostramos spinner
  mostrarSpinner();

  // Despues de mostrar el spinner 1 segundo, realizamos la cotizacion
  setTimeout(() => {
    fetch(url)
      .then((response) => response.json())
      .then((resolve) => {
        // Usamos la funcion que muestra la cotizacion sobre la respuesta
        // y directamente sobre la moneda y criptomoneda escogidas
        mostrarCotizacionHTML(resolve.DISPLAY[criptomoneda][moneda]);
      });
  }, 1000);
}

// **************************************************

// Funcion que muestra los resultados del fetch con los elementos seleccionados

function mostrarCotizacionHTML(cotizacion) {
  // Limpiamos resultados previos
  limpiarHTML();

  // Extraemos de los resultados del fetch
  const { PRICE, LASTUPDATE, CHANGEPCT24HOUR, LOWDAY, HIGHDAY } = cotizacion;

  // Creamos el scripting y lo inyectamos al div de resultado
  const precio = document.createElement("P");
  precio.classList.add("precio");
  precio.innerHTML = `Valor actual: <span>${PRICE}</span>`;

  const precioAlto = document.createElement("P");
  precioAlto.innerHTML = `Valor más alto hoy: <span>${HIGHDAY}</span>`;

  const precioBajo = document.createElement("P");
  precioBajo.innerHTML = `Valor más bajo hoy: <span>${LOWDAY}</span>`;

  const variacionUltimasHoras = document.createElement("P");
  variacionUltimasHoras.innerHTML = `Variación de las últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

  const ultimaActualizacion = document.createElement("P");
  ultimaActualizacion.innerHTML = `Última actualización: <span>${LASTUPDATE}</span>`;

  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(variacionUltimasHoras);
  resultado.appendChild(ultimaActualizacion);
}

// **************************************************

// Funcion que limpia el HTML previo

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

// **************************************************

function mostrarSpinner() {
  // Limpiamos HTML previo
  limpiarHTML();

  // Creamos div del spinner, asignamos clase, inyectamos el html y lo      colocamos en el div de resultado
  const spinner = document.createElement("DIV");
  spinner.classList.add("spinner");
  spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

  resultado.appendChild(spinner);
}
