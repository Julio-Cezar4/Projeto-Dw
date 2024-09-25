/* Função que Verifica se existe o email informado no banco de dados */
async function verifica_existencia(email) {
    try {
        const response = await fetch('/data/users');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const users = data; // Acessar a lista de usuários
        return users.some(user => user.email === email);
    } catch (error) {
        console.error('Erro ao verificar existência do email:', error);
        return false;
    }
}

let conteudo = document.getElementById('resultado');
let pesquisado = document.getElementById('pesquisado');
let historico = document.getElementById("resultados");

async function find() {
    try {
        // Regex que remove hífens e busca pelos primeiros 6 caracteres
        let novo = pesquisado.value.replace(/-/g, '');
        let pesquisar = novo.substring(0, 6);

        // Fetch dos dados dos Macs
        let response = await fetch('http://127.0.0.1:40000/data/macs');
        let data = await response.json();
        let resultado = '';

        // Busca pelo MAC
        for (let macs of data) {
            if (pesquisado.value === '') {
                break;
            }
            if (macs.nome.toLowerCase() === pesquisar) {
                resultado = macs.fabricante;
                conteudo.innerHTML = `<p class="mac_results">${resultado}</p>`;
                break;
            }
        }

        if (resultado) {
            const userId = window.localStorage.getItem('userId'); // ou outra forma de pegar o ID do usuário logado

            // Envia o histórico para o backend
            const responseHistory = await fetch(`/data/users/${userId}/history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pesquisa: resultado })
            });

            const historyData = await responseHistory.json();

            // Atualize o histórico no frontend
            addHistoryToDOM(resultado);
        }
    } catch (error) {
        console.error('Erro:', error);
    } finally {
        pesquisado.value = ''; // Limpa o campo de pesquisa
    }
}

function carregarHistoricoDoUsuario(userId) {
    fetch(`http://localhost:40000/data/users/${userId}/history`).then((response) => {
        return response.json()
    })
    .then((response) => {
        console.log(response.history)
        for(const item of response.history){
            addHistoryToDOM(item.entry)
        }
    })
    console.log('ID do usuário: ',userId)
}

// Função para adicionar o histórico ao DOM
function addHistoryToDOM(entry) {
    const historicoContainer = document.getElementById('historico'); // Certifique-se de que o ID 'historico' existe no HTML
    const newHistoryItem = document.createElement('li');
    newHistoryItem.textContent = entry;
    newHistoryItem.style.color = 'green'; // Personalize o estilo se necessário
    newHistoryItem.style.listStyle = 'none';
    newHistoryItem.style.fontSize = '20px';
    historicoContainer.appendChild(newHistoryItem); // Adiciona o novo item ao final da lista
}

async function entrar() {
    const email = document.querySelector('input#mail').value;
    const senha = document.querySelector("input#password").value;

    if (email && senha) {
        try {
            const response = await fetch('/data/users');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const users = data; // Acessar a lista de usuários
            console.log('Usuários: \n', users);
            const user = users.find(user => user.email === email && user.senha === senha);
            if (user) {
                window.localStorage.setItem('userId', user.id);
                window.location.href = `../html/page_user.html?id=${user.id}`; // User-page/page_user.html
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

function user_info(id) {
    let dados = document.getElementById("historico");
    let user = document.getElementById("userNameDisplay");

    fetch(`/data/users/${id}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((response) => {
            dados.innerHTML = ''; 
            
            // if (Array.isArray(response.history)) {
            //     response.history.forEach(item => {
            //         dados.innerHTML += `<li style="color: green; list-style: none; font-size: 20px">${item}</li>`;
            //     });
            // } else {
            //     console.error('response.history não é um array');
            // }
            
            user.innerHTML = `<span style="font-size: 20px;">Usuário: ${response.nome}</span>`;
        })
        .catch(error => console.error('Erro:', error));
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
    };
    
    try {
        const response = await fetch('/data/users', {
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
        document.location.href = 'http://localhost:40000/login'; 
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
    }
}


