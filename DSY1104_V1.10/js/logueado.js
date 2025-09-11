document.addEventListener('DOMContentLoaded', (event) => {
    const botonLogin = document.getElementById('loginDropdown');
    const botonRegister = document.getElementById('botonRegister')
    if (sessionStorage.getItem('usuarioLogueado') === 'true') {
        if (botonLogin) {
            botonLogin.style.display = 'none';
        }
        if (botonRegister) {
            botonRegister.innerHTML = '<i class="bi bi-person-circle"></i> Bienvenido';
            botonRegister.removeAttribute('href');
        }
    }
});