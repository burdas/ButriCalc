$(document).ready(function () {
    $('#formulario').submit(function (e) {
        e.preventDefault();
        var grProteina, calProteina, grGrasas, calGrasas, grHidratos, calHidratos;
        var genero = $("input[name='genero']:checked").val();
        var peso = parseInt($("#pesoKg").val());
        var estatura = parseInt($("#estaturaCm").val());
        var edad = parseInt($("#edad").val());
        var ejercicio = $("input[name='ejercicio']:checked").val();
        var objetivo = $("input[name='objetivo']:checked").val();
        console.log("Genero: " + genero + " Peso: " + peso + " Estatura: " + estatura + " Edad: " + edad + " Ejercicio: " + ejercicio + " Objetivo: " + objetivo);
        var tmb = calHarrisBennedict(peso, estatura, edad, genero);
        var recomendada = ingestaRecomendada(tmb, ejercicio);
        var difereciaCal;
        switch (objetivo) {
            case "1":
                difereciaCal = -300;
                grProteina = 2.5 * peso;
                break;
            case "3":
                difereciaCal = 300;
                grProteina = 2 * peso;
                break;
            default:
                difereciaCal = 0;
                grProteina = 2 * peso;
                break;
        }
        var caloriasObjetivo = recomendada + difereciaCal;
        $('#tmb').text(Math.round(tmb) + " Cal");
        $('#recomendada').text(Math.round(recomendada) + " Cal");
        $('#calObjetivo').text(Math.round(caloriasObjetivo) + " Cal");
        calProteina = 4 * grProteina;
        if (genero == "mujer") {
            grGrasas = 1.2 * peso;
        } else {
            grGrasas = 0.8 * peso;
        }
        calGrasas = grGrasas * 9;
        calHidratos = caloriasObjetivo - calGrasas - calProteina;
        grHidratos = calHidratos/4;
        $('#hidratos').text(Math.round(calHidratos) + " Cal / " + Math.round(grHidratos) + " gr");
        $("#pbHidratos")
            .attr("aria-valuemax", caloriasObjetivo)
            .css("width", Math.round(calHidratos/caloriasObjetivo*100) + "%")
            .attr("aria-valuenow", calHidratos);
        $('#grasas').text(Math.round(calGrasas) + " Cal / " + Math.round(grGrasas) + " gr");
        $("#pbGrasas")
            .attr("aria-valuemax", caloriasObjetivo)
            .css("width", Math.round(calGrasas/caloriasObjetivo*100) + "%")
            .attr("aria-valuenow", calGrasas);
        $('#proteinas').text(Math.round(calProteina) + " Cal / " + Math.round(grProteina) + " gr");
        $("#pbProteinas")
            .attr("aria-valuemax", caloriasObjetivo)
            .css("width", Math.round(calProteina/caloriasObjetivo*100) + "%")
            .attr("aria-valuenow", calProteina);
        return false;
    });
});

function calHarrisBennedict(peso, altura, edad, genero) {
    var salida;
    if (genero == "mujer") {
        salida = 655.0955 + (9.5634 * peso) + (1.8449 * altura) - (4.6756 * edad);
    } else {
        salida = 66.4730 + (13.7516 * peso) + (5.0033 * altura) - (6.7550 * edad);
    }
    return salida;
}

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