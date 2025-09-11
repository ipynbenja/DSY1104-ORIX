// Funciones para RUT
function limpiarRut(rut) {
    return rut.replace(/\./g, '').replace(/-/g, '');
}

function calcularDV(rut) {
    let suma = 0;
    let multiplo = 2;
    for (let i = rut.length - 1; i >= 0; i--) {
        suma += parseInt(rut[i]) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    let dv = 11 - (suma % 11);
    if (dv === 11) return '0';
    if (dv === 10) return 'K';
    return dv.toString();
}

function validarRut(rut) {
    if (!rut) return false;
    const rutLimpio = limpiarRut(rut);
    if (rutLimpio.length < 2) return false;
    const cuerpo = rutLimpio.slice(0, -1);
    const dvIngresado = rutLimpio.slice(-1).toUpperCase();
    if (!/^\d+$/.test(cuerpo)) return false;
    return dvIngresado === calcularDV(cuerpo);
}

function formatearRut(rut) {
    let valor = limpiarRut(rut);
    if (valor.length <= 1) return valor;
    let cuerpo = valor.slice(0, -1);
    let dv = valor.slice(-1);
    cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${cuerpo}-${dv}`;
}

document.addEventListener("DOMContentLoaded", function () {

    rutInput = document.getElementById("rut");

    rutInput.addEventListener('input', function() {
        this.setCustomValidity("");
        rutInput.value = formatearRut(rutInput.value.toUpperCase());
    });

    const tipoSolicitud = document.getElementById("tipoSolicitud");
    const form = document.getElementById("formSolicitud");
    const secciones = {
        problema: document.getElementById("problema"),
        cotizacion: document.getElementById("cotizacion"),
        sugerencia: document.getElementById("sugerencia")
    };

    // Limitar la fecha máxima al día actual
    const fechaProblema = document.getElementById("fechaProblema");
    if (fechaProblema) {
      const hoy = new Date().toISOString().split("T")[0];
      fechaProblema.setAttribute("max", hoy);
    }

    tipoSolicitud.addEventListener("change", function () {
        // Ocultar todas las secciones
        Object.values(secciones).forEach(sec => sec.classList.add("d-none"));

        // Quitar required de todos
        form.querySelectorAll("[required]").forEach(el => el.removeAttribute("required"));

        if (this.value && secciones[this.value]) {
            secciones[this.value].classList.remove("d-none");
            // Poner required solo en los visibles
            secciones[this.value].querySelectorAll("input, select, textarea").forEach(el => {
                el.setAttribute("required", true);
            });
        }
    });

    // Validación
    form.addEventListener("submit", function (e) {
        if (rutInput && rutInput.value) {
            if (!validarRut(rutInput.value)) {
                rutInput.setCustomValidity("El RUT ingresado es inválido");
                e.preventDefault();
                e.stopPropagation();
                form.classList.add("was-validated");
                return;
            } else {
                fechaProblema.setCustomValidity("");
            }
        }

        if (fechaProblema && fechaProblema.value) {
            const seleccionada = new Date(fechaProblema.value);
            const hoy = new Date();
            hoy.setHours(0,0,0,0); // limpiar hora

            if (seleccionada > hoy) {
                e.preventDefault();
                e.stopPropagation();
                fechaProblema.setCustomValidity("La fecha no puede ser mayor a hoy.");
                form.classList.add("was-validated");
                fechaProblema.focus();
                return;
            } else {
                fechaProblema.setCustomValidity("");
            }
        }

        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
            form.classList.add("was-validated");
        }
    }, false);
});
