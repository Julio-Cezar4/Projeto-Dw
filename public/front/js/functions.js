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
        let novo = pesquisado.value.replace(/[:-]/g, '');
        console.log(novo)
        let pesquisar = novo.substring(0, 6);

        let response = await fetch('http://127.0.0.1:40000/data/macs');
        let data = await response.json();
        let resultado = '';

        for (let macs of data) {
            if (pesquisado.value === '') {
                break;
            }
            if (macs.nome.toLowerCase() === pesquisar) {
                resultado = macs.fabricante;
                conteudo.innerHTML = `<p class="mac_results">${resultado}</p>`;
                break;
            }
            else{
                conteudo.innerHTML = `<p class="mac_results">Not Found</p>`;
            }
        }

        if (resultado) {
            const userId = window.localStorage.getItem('userId'); 
           
            const responseHistory = await fetch(`/data/users/${userId}/history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pesquisa: resultado })
            });

            const historyData = await responseHistory.json();

            addHistoryToDOM(resultado);
        }
    } catch (error) {
        console.error('Erro:', error);
    } finally {
        pesquisado.value = ''; 
    }
}


function carregarHistoricoDoUsuario(userId) {
    fetch(`http://localhost:40000/data/users/${userId}/history`).then((response) => {
        return response.json()
    })
    .then((response) => {
        console.log(response)
        for(const item of response.history){
            addHistoryToDOM(item.entry, item.createdAt)
            console.log(item.createdAt)
        }
    })
}

function addHistoryToDOM(entry, date) {
    const historicoBody = document.getElementById('historico-body');
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${entry}</td>
        <td>${formatarData(date)}</td>
    `;
    historicoBody.appendChild(newRow); 
}

function formatarData(dataISO) {
    const data = new Date(dataISO);
    
    const dia = String(data.getDate()).padStart(2, '0'); 
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
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
    let user = document.getElementById("userName");

    fetch(`/data/users/${id}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((response) => {
            user.innerHTML = `<span style="font-size: 20px;">User: ${response.nome}</span>`;
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


