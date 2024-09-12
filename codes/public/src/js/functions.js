
/* Função que Verifica se existe o email informado no banco de dados */
async function verifica_existencia(email) {
    try {
        const response = await fetch('/users');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Dados recebidos:', data);
//        console.log('Dados recebidos:', data['users'][0].email);

        // Acessar a lista de usuários
        const users = data.users;
        return users.some(user => user.email === email);
    } catch (error) {
        console.error('Erro ao verificar existência do email:', error);
        return false;
    }
}

let conteudo = document.getElementById('resultado')
let pesquisado = document.getElementById('pesquisado')
let historico = document.getElementById("resultados")

async function find() {
    try {
        // Regex que remove hífens
        let novo = pesquisado.value.replace(/-/g, '');

        // Pegando apenas os 6 primeiros caracteres
        let pesquisar = novo.substring(0, 6);

        // Fetch dos dados
        let response = await fetch('/data/dispositivos.json');
        let data = await response.json();

        // Busca pelo MAC
        for (let macs of data) {
            if (pesquisado.value === '') {
                break;
            }
            if (macs.mac === pesquisar) {
                conteudo.innerHTML = `<p class="mac_results">${macs.fabricante}</p>`;
                break;
            }
        }
    } catch (error) {
        console.error('Erro:', error);
    } finally {
        // Limpar o valor do input
        pesquisado.value = '';
    }
}

async function entrar() {
    const email = document.querySelector('input#mail').value;
    const senha = document.querySelector("input#password").value;

    if (email && senha) {
        try {
            const response = await fetch('/users');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const users = data.users; // Acessar a lista de usuários

            const user = users.find(user => user.email === email && user.senha === senha);
            if (user) {
                window.location.href = `../User-page/page_user.html?id=${user.id}`;
            } else {
                alert('Usuário ou senha inválidos!');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    } else {
        alert('Preencha todos os campos!');
    }
}


function user_info(id){
    let dados = document.getElementById("historico")
    let user  = document.getElementById("userNameDisplay")

    fetch(`/users${id}`)
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

async function cadastrar() {
    const nome = document.querySelector('input#nome').value;
    const email = document.querySelector('input#mail').value;
    const senha = document.querySelector("input#password").value;
    const confirm_senha = document.querySelector("input#conf-password").value;

    if (!nome || !email || !senha || !confirm_senha) {
        alert('Preencha todos os campos!');
        return;
    }
    if (senha !== confirm_senha) {
        alert('Senhas não conferem!');
        return;
    }


    const emailExiste = await verifica_existencia(email);
    if (emailExiste) {
        alert('Email Já Está Cadastrado!');
        return;
    }

    const new_user = {
        "id": Math.floor(Math.random() * 100000),
        "nome": nome,
        "email": email,
        "senha": senha,
        "history": []
    }
    try {
        const response = await fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(new_user)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        alert('Usuário cadastrado com sucesso!');
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
    }
}



