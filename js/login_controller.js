document.addEventListener('DOMContentLoaded', () => {

    const formProfissional = document.getElementById('form-login-profissional');
    const inputIdentificador = document.getElementById('identificador_profissional');
    const inputSenhaProfissional = document.getElementById('senha_profissional');
    const errorMessageElement = document.getElementById('error-message-profissional');

    
    
    
    const SENHA_ADMIN_CORRETA = "gabigol"; 
    

    if (formProfissional) {
        formProfissional.addEventListener('submit', (event) => {
            event.preventDefault(); 

            const identificadorDigitado = inputIdentificador.value;
            const senhaDigitada = inputSenhaProfissional.value;

            
            errorMessageElement.textContent = '';
            errorMessageElement.style.display = 'none';

            
            if (senhaDigitada === SENHA_ADMIN_CORRETA) {
                
                alert('Login de administrador bem-sucedido! Redirecionando...'); 

                
                
                window.location.href = 'espacoProfissional.html';
                
        

            } else {
                
                errorMessageElement.textContent = 'Identificador ou senha inválido.';
                errorMessageElement.style.display = 'block'; 
            }
            
        });
    } else {
        console.error("Formulário de login profissional não encontrado.");
    }


});