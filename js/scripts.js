/* Valores por defecto para la distribución de macros
se pueden cambiar en la configuración*/
const defaultPGanancia = 2;
const defaultPMantenimiento = 2;
const defaultPPerdida = 2.5;
const defaultGHombre = 0.8;
const defaultGMujer = 1.2;
const defaultOCalorias = 300;

/* Valores de la distribución de macros seleccionada, por defecto los de arriba */
var pGanancia, pMantenimiento, pPerdida, gHombre, gMujer, oCalorias;

/* Controladores de los ranger slider para seleccionar la distribución de macros
del apartado de configuración*/
var rangePGanancia, rangePMantenimiento, rangePPerdida, rangeGHombre, rangeGMujer, rangeOCalorias;

/** Variable del grafico tipo donut */
var donut;
$(document).ready(function () {
    inicializarRanges();
    inicializarParametros();

    resetConfig();

    // Botón de restablecer, devuleve en el aprtado de configuracón
    // a los valores, por defecto
    $('#btnRestablecer').click(function (e) {
        e.preventDefault();
        resetConfig();
    });
    $('#btnVolverCalculadora').click(function (e) { 
        e.preventDefault();
        $("#formulario").toggle();
        $("#resultados").toggle();
        $('#btnVolverCalculadora').toggle();
    });

    $(window).on('resize', resizeManager);

    $('#formulario').submit(calcular);
    $('#formConfig').submit(guardarConfiguracion);
});

// Guarda los valores de distribución de macros seleccionada
// en el apratado de configuración en las variables
function guardarConfiguracion(e) {
    e.preventDefault();
    pGanancia = parseFloat(rangePGanancia.value);
    pMantenimiento = parseFloat(rangePMantenimiento.value);
    pPerdida = parseFloat(rangePPerdida.value);
    gHombre = parseFloat(rangeGHombre.value);
    gMujer = parseFloat(rangeGMujer.value);
    oCalorias = parseInt(rangeOCalorias.value);
    console.log('gr proteina por kilo de peso - Ganancia: ' + pGanancia);
    console.log('gr proteina por kilo de peso - Mantenimiento: ' + pMantenimiento);
    console.log('gr proteina por kilo de peso - Perdida: ' + pPerdida);
    console.log('gr grasa por kilo de peso - Hombre: ' + gHombre);
    console.log('gr grasa por kilo de peso - Mujeres: ' + gMujer);
    console.log('Calorias para el objetivo: ' + oCalorias);
    $('#modalConfig').modal('toggle');
    return false;
}

/** Inicializa las variables de distribución de macros a
 * los valores por defecto
*/
function inicializarParametros() {
    pGanancia = defaultPGanancia;
    pMantenimiento = defaultPMantenimiento;
    pPerdida = defaultPPerdida;
    gHombre = defaultGHombre;
    gMujer = defaultGMujer;
    oCalorias = defaultOCalorias;
}

/**Obtenemos los range input del DOM
 * Despues les asignamos el manejador que muestra
 * en texto los valores del dom
 */
function inicializarRanges() {
    let ranges = $('input[type="range"]');
    ranges.rangeslider({
        polyfill: false,
    });
    ranges.on('input', cambiarVistaRange);
}

/** Muestra los valores del range en texto */
function cambiarVistaRange() {
    let name = $(this).attr('id');
    let cadena;
    if (name == 'rangeOCalorias') {
        cadena = ' Cal';
    } else {
        cadena = ' gr / Kg de peso';
    }
    document.getElementById(name + 'Vista').innerHTML = $(this).val() + cadena;
}

/** Establece los valores por defecto
 * de los rangers y el texto
 */
function resetConfig() {
    $('#rangePGanancia').val(defaultPGanancia);
    $('#rangePMantenimiento').val(defaultPMantenimiento);
    $('#rangePPerdida').val(defaultPPerdida);
    $('#rangeGHombre').val(defaultGHombre);
    $('#rangeGMujer').val(defaultGMujer);
    $('#rangeOCalorias').val(defaultOCalorias);

    document.getElementById('rangePGanancia' + 'Vista').innerHTML = defaultPGanancia + ' gr / Kg de peso';
    document.getElementById('rangePMantenimiento' + 'Vista').innerHTML = defaultPMantenimiento + ' gr / Kg de peso';
    document.getElementById('rangePPerdida' + 'Vista').innerHTML = defaultPPerdida + ' gr / Kg de peso';
    document.getElementById('rangeGHombre' + 'Vista').innerHTML = defaultGHombre + ' gr / Kg de peso';
    document.getElementById('rangeGMujer' + 'Vista').innerHTML = defaultGMujer + ' gr / Kg de peso';
    document.getElementById('rangeOCalorias' + 'Vista').innerHTML = defaultOCalorias + ' Cal';
}

/** Maneja el formulario de calcular las calorias y macros */
function calcular(e) {
    e.preventDefault();

    var genero = $("input[name='genero']:checked").val();
    var peso = parseInt($("#pesoKg").val());
    var estatura = parseInt($("#estaturaCm").val());
    var edad = parseInt($("#edad").val());
    var ejercicio = $("input[name='ejercicio']:checked").val();
    var objetivo = $("input[name='objetivo']:checked").val();

    console.log("Genero: " + genero + " Peso: " + peso + " Estatura: " + estatura + " Edad: " + edad + " Ejercicio: " + ejercicio + " Objetivo: " + objetivo);

    $("#formulario").toggle();
    $('#btnVolverCalculadora').toggle();
    lanzarSpinner(peso, estatura, edad, genero, ejercicio, objetivo);

    return false;
}

/** Calcula los gr y calorias y los muestra en el DOM */
function generarCal(peso, estatura, edad, genero, ejercicio, objetivo) {
    $("#resultados").toggle();
    var grProteina, calProteina, grGrasas, calGrasas, grHidratos, calHidratos;
    var tmb = calHarrisBennedict(peso, estatura, edad, genero);
    console.log("Tasa Metabólica Basal: " + tmb);
    var recomendada = ingestaRecomendada(tmb, ejercicio);
    console.log("Ingesta diaria recomendada: " + recomendada);
    var difereciaCal;
    switch (objetivo) {
        case "1":
            difereciaCal = -1 * oCalorias;
            grProteina = peso * pGanancia;
            break;
        case "3":
            difereciaCal = oCalorias;
            grProteina = peso * pMantenimiento;
            break;
        default:
            difereciaCal = 0;
            grProteina = peso * pPerdida;
            break;
    }
    var caloriasObjetivo = recomendada + difereciaCal;
    console.log("Ingesta para el objetivo: " + caloriasObjetivo);
    animateValue('tmb', Math.round(tmb), " Cal");
    animateValue('recomendada', Math.round(recomendada), " Cal");
    animateValue('calObjetivo', Math.round(caloriasObjetivo), " Cal");
    calProteina = 4 * grProteina;
    if (genero == "mujer") {
        grGrasas = peso * gMujer;
    } else {
        grGrasas = peso * gHombre;
    }
    calGrasas = grGrasas * 9;
    calHidratos = caloriasObjetivo - calGrasas - calProteina;
    grHidratos = calHidratos / 4;
    animateValue('grProteinas', Math.round(grProteina), " gr");
    animateValue('calProteinas', Math.round(calProteina), " Cal");
    animateValue('grGrasas', Math.round(grGrasas), " gr");
    animateValue('calGrasas', Math.round(calGrasas), " Cal");
    animateValue('grHidratos', Math.round(grHidratos), " gr");
    animateValue('calHidratos', Math.round(calHidratos), " Cal");

    graficoDonut(grProteina, grGrasas, grHidratos);
}

/** Muestra el spinner por pantalla
 * al acabar lanza generaCal()
 */
function lanzarSpinner(peso, estatura, edad, genero, ejercicio, objetivo){
    $('#modalSpinner').modal('toggle');
    new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve("anything");
        }, 2000);
    }).then(function (result) {
        $('#modalSpinner').modal('toggle');
        $("html, body").animate({ scrollTop: 2 * $(document).outerHeight(true) }, 2000);
        generarCal(peso, estatura, edad, genero, ejercicio, objetivo);
    })
}

/** Genera el gráfico tipo donut con los gramos de los diferentes macros */
function graficoDonut(grProteina, grGrasas, grHidratos) {
    Chart.defaults.global.legend.labels.usePointStyle = true;
    var config = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [
                    Math.round(grProteina),
                    Math.round(grGrasas),
                    Math.round(grHidratos),
                ],
                backgroundColor: [
                    'rgb(228, 75, 96)',
                    'rgb(229, 190, 79)',
                    'rgb(25, 170, 158)',
                ],
                label: 'Dataset 1',
                borderColor: '#222'
            }],
            labels: [
                'Proteinas',
                'Grasas',
                'Hidratos de carbono'
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                animateScale: true,
                animateRotate: true
            },
            legend: {
                position: 'bottom',
                labels: {
                    fontSize: 20
                }
            }
        }
    };
    var ctx = document.getElementById('chart-area').getContext('2d');
    resizeManager();
    donut = new Chart(ctx, config);
}

/** Ecuación de Harris Bennedict */
function calHarrisBennedict(peso, altura, edad, genero) {
    var salida;
    if (genero === "mujer") {
        console.log("Calculando Harris-Bennedict para mujer");
        salida = 655.0955 + (9.5634 * peso) + (1.8449 * altura) - (4.6756 * edad);
    } else {
        console.log("Calculando Harris-Bennedict para hombre");
        salida = 66.4730 + (13.7516 * peso) + (5.0033 * altura) - (6.7550 * edad);
    }
    return salida;
}

/** Calcula la ingesta recomendada en función del ejercicio fisico */
function ingestaRecomendada(tmb, ejercicio) {
    var salida;
    switch (ejercicio) {
        case "2":
            salida = tmb * 1.375;
            break;
        case "3":
            salida = tmb * 1.55;
            break;
        case "4":
            salida = tmb * 1.725;
            break;
        case "5":
            salida = tmb * 1.9;
            break;
        default:
            salida = tmb * 1.2;
            break;
    }
    return salida;
}

/** Detecta en que tipo de pantalla nos encontramos
 * return: false -> Pantalla horizontal (Monitor)
 * return: true  -> Pantalla vertical (Teléfono)
 */
function detectRatio() {
    return $(window).width() < $(window).height();
}

/* Maneja el comportamiento cuando se cambia el tamaño del documento, en este caso solomaneja el comportamiento del gráfico tipo donut */
function resizeManager() {
    if (!detectRatio()) {
        // Pantalla de ordenador
        if (document.getElementById("chart-area").hasAttribute("height")) {
            $('#chart-area').removeAttr("height")
        }
    } else {
        // Pantalla de mobil
        $('#chart-area').height($(window).width());
    }
}

/** Genera la animación de que los números van ascendiendo hasta
 * alcanzar el valor objetivo
 */
function animateValue(id, end, prefix) {
    const duration = 1000;
    const start = 0;
    // assumes integer values for start and end

    var obj = document.getElementById(id);
    var range = end - start;
    // no timer shorter than 50ms (not really visible any way)
    var minTimer = 50;
    // calc step time to show all interediate values
    var stepTime = Math.abs(Math.floor(duration / range));

    // never go below minTimer
    stepTime = Math.max(stepTime, minTimer);

    // get current time and calculate desired end time
    var startTime = new Date().getTime();
    var endTime = startTime + duration;
    var timer;

    function run() {
        var now = new Date().getTime();
        var remaining = Math.max((endTime - now) / duration, 0);
        var value = Math.round(end - (remaining * range));
        obj.innerHTML = value + prefix;
        if (value == end) {
            clearInterval(timer);
        }
    }

    timer = setInterval(run, stepTime);
    run();
}