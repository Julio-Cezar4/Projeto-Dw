const cadastros = [{nome: "admin", email: "admin@sistema.com", senha: "admin"}];

/* Função que Verifica se existe o email informado no banco de dados */
function verifica_existencia(email) {

    return new Promise((resolve) => {
        fetch('http://localhost:3000/users').then((response) => {
            response.json().then((users) => {
                for (i in users) {
                    if (users[i].email == email) {
                        resolve(true);
                        return;
                    }
                }
                resolve(false);
                return;
            })
        })
    })

}
let conteudo = document.getElementById('resultado')
let pesquisado = document.getElementById('pesquisado')
let historico = document.getElementById("resultados")

function find(){
    // regex que pega apenas os valores informados retirando os hífens.
    // busca por ocorrências de hífen globalmente na palavra e troca por ''
    let novo = pesquisado.value.replace(/-/g,'')


    let pesquisar = ''
     // pegando apenas os 6 primeiros valores informados na pesquisa
    for (let i of novo){
        if (pesquisar.length == 6){
            break;
        }else{
            pesquisar += i
        }
    }
    fetch('../data/dispositivos.json')
    .then(function (response) {
        return(response.json())
    })
    .then(function (response) {
        for(let macs of response){
            if (pesquisado.value = ''){
                break;
            }
            if (macs.mac == pesquisar ){
                conteudo.innerHTML = `<p class="mac_results">${macs.fabricante}</p>`
                break;
            } 
        }              
    })
    pesquisado.value = ''
}


function entrar(){
    let id = ''
    let email = document.querySelector('input#mail').value;
    let senha = document.querySelector("input#password").value;
    let verifica = false;

    if (email.length > 0 && senha.length > 0){
        fetch('http://localhost:3000/users').then((response) => {
            response.json().then((users) => {
                for (i in users) {
                    if (users[i].email == email && users[i].senha == senha) {
                        id = users[i].id 
                        verifica = true;                
                        window.location.href = `../User-page/page_user.html?id=${id}`;
                        break;
                    }
                }
                if (verifica == false) {
                    window.alert('Usuário ou senha inválidos!')
                    return;
                }  
                    
            })
        })

    }
    
    else{
        alert('Preencha todos os campos!')
        return;
    }
}


function user_info(id){
    let dados = document.getElementById("historico")
    let user  = document.getElementById("userNameDisplay")

    fetch(`http://localhost:3000/users/${id}`)
    .then((response) => {return response.json()})
    .then((response) => {
        for (let i=0; i <= response.history.length; i++){
            if (response.history[i] == undefined){
                response.history[i] = {};
                break;
            }
            dados.innerHTML += `<li style="color: green; list-style: none; font-size: 20px "> ${response.history[i]} </li>`

        }
        user.innerHTML = `<span style="font-size: 20px;">Usuário: ${response.nome}</span>`

    })
}

function cadastrar(){
    let nome = document.querySelector('input#nome').value;
    let email = document.querySelector('input#mail').value;
    let senha = document.querySelector("input#password").value;
    let confirm_senha = document.querySelector("input#conf-password").value;
    const new_user = {
        nome: nome,
        email: email,
        senha: senha,
        history: []
    }
    const url = "http://localhost:3000/users"

    // Configuração das opções para a requisição POST
    const options = {
        // Método da requisição (neste caso, POST)
            method: 'POST',
        // Cabeçalhos da requisição, incluindo o tipo de conteúdo esperado (application/json)
            headers: {
                'Content-Type': 'application/json'
            },
        // Corpo da requisição, contendo os dados do novo usuário convertidos para JSON
            body: JSON.stringify(new_user)
        }
        
        /* verifica se todos os campos do cadastro foi preenchido*/
        if (nome.length == 0 || email.length == 0 || senha.length == 0 ||confirm_senha.length == 0) {
            alert('Preencha todos os campos!')
            return;
        }
        if (senha.value != confirm_senha.value){
            alert('Senhas não conferem!')
            return;
        }
    verifica_existencia(email).then((emailExiste) => {
        if (emailExiste == true) {
            alert(`Email Já Está Cadastrado!`);
            return;
        } else {
            // Se o email não existe, realiza o cadastro
            fetch(url, options)
                .then((response) => {
                    if (!response.ok) {
                        /* isso interrompe a execução normal do código e causa a saída imediata da função atual. */
                        throw new Error('Erro ao enviar os dados para o servidor');
                    }
                    return response.json(); /* Converte em json a resposta */
                })
                .then((data) => {
                    console.log('Novo usuário cadastrado com sucesso:', data);
                    window.location.href = '../login/login.html'                    
                })
                .catch((error) => {
                    console.error("Erro: ", error);
                });
        }
    }).catch((error) => {
        console.error("Erro ao verificar existência de email:", error);
    });

}

