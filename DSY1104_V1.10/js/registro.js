
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

function setEstadoCampo(input, feedback, valido, mensaje = "") {
    input.classList.toggle('is-valid', valido);
    input.classList.toggle('is-invalid', !valido);
    feedback.textContent = mensaje;
    feedback.classList.toggle('text-success', valido && mensaje);
    feedback.classList.toggle('text-danger', !valido && mensaje);
}

function validarCampo(input, feedback, nombreCampo) {
    if (!input.value.trim()) {
        setEstadoCampo(input, feedback, false, `${nombreCampo} no puede estar vacío`);
        return false;
    }
    setEstadoCampo(input, feedback, true);
    return true;
}

function validarConfirmPassword(passwordInput, confirmInput, feedback) {
    if (!confirmInput.value.trim()) {
        setEstadoCampo(confirmInput, feedback, false, "Confirmar contraseña no puede estar vacío");
        return false;
    }
    if (confirmInput.value !== passwordInput.value) {
        setEstadoCampo(confirmInput, feedback, false, "Las contraseñas no coinciden");
        return false;
    }
    setEstadoCampo(confirmInput, feedback, true);
    return true;
}

function validarCampoRut(input, feedback) {
    if (!input.value.trim()) {
        return validarCampo(input, feedback, "RUT");
    }
    if (!validarRut(input.value)) {
        setEstadoCampo(input, feedback, false, "RUT inválido");
        return false;
    }
    setEstadoCampo(input, feedback, true, "RUT válido");
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    const campos = [
        { id: 'nombre', nombre: 'Nombre completo' },
        { id: 'usuario', nombre: 'Nombre de usuario' },
        { id: 'correo', nombre: 'Correo electrónico' },
        { id: 'password', nombre: 'Contraseña' },
        { id: 'confirmPassword', nombre: 'Confirmar contraseña' },
        { id: 'rut', nombre: 'RUT' }
    ];

    const passwordInput = document.querySelector('#password');
    const confirmInput = document.querySelector('#confirmPassword');
    const confirmFeedback = document.querySelector('#confirmPasswordFeedback');
    const rutInput = document.querySelector('#rut');
    const rutFeedback = document.querySelector('#rutFeedback');
    const btnRegistro = document.querySelector('#btnRegistro');

    campos.forEach(campo => {
        const input = document.querySelector(`#${campo.id}`);
        const feedback = document.querySelector(`#${campo.id}Feedback`);

        input.addEventListener('blur', () => {
            if (campo.id === 'rut') {
                validarCampoRut(rutInput, rutFeedback);
            } else if (campo.id === 'confirmPassword') {
                validarConfirmPassword(passwordInput, confirmInput, confirmFeedback);
            } else {
                validarCampo(input, feedback, campo.nombre);
            }
        });
    });

    // Formateo RUT mientras escribe
    rutInput.addEventListener('input', () => {
        rutInput.value = formatearRut(rutInput.value.toUpperCase());
    });

    btnRegistro.addEventListener('click', () => {
        let valido = true;

        campos.forEach(campo => {
            const input = document.querySelector(`#${campo.id}`);
            const feedback = document.querySelector(`#${campo.id}Feedback`);

            if (campo.id === 'rut') {
                if (!validarCampoRut(rutInput, rutFeedback)) valido = false;
            } else if (campo.id === 'confirmPassword') {
                if (!validarConfirmPassword(passwordInput, confirmInput, confirmFeedback)) valido = false;
            } else {
                if (!validarCampo(input, feedback, campo.nombre)) valido = false;
            }
        });

        //SI TODO ES VÁLIDO, REDIRIGE
        if (valido) { 
            sessionStorage.setItem('usuarioLogueado', 'true');
            window.location.href = 'index.html';
        }
    });
});

