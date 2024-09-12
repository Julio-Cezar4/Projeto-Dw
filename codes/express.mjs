import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const app = express();
const url = '/:action'
const port = 40000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE_PATH = path.join(__dirname, 'public/data/db-users.json');

console.log(USERS_FILE_PATH)

app.use(express.static('public'));
app.use(morgan('tiny'))
app.use(express.json());

app.get(url, (req, res) => {
    const { action } = req.params;

    switch(action){
        case "login":
            res.sendfile('./public/src/html/login.html')
            break;
        case "cadastro":
            res.sendfile('./public/src/html/cadastro.html')
            break;
        case "sobre":
            res.sendfile('./public/src/html/sobre.html')
            break;
        case "contato":
            res.sendfile('./public/src/html/contato.html')
            break;
        case "home":
            res.sendfile('./public/src/html/index.html')
            break;
        case "fabricantes":
            res.sendfile('./public/data/dispositivos.json'); 
            break;
        case "users":
            res.sendfile('./public/data/db-users.json'); 
            break;    
    }
})
app.post('/users', async (req, res) => {
    const newUser = req.body;
    console.log('Novo usuário:', newUser);

    try {
        // Lê o arquivo JSON atual
        const data = await fs.readFile(USERS_FILE_PATH, 'utf8');
        let dbData;
        console.log(data)

        try {
            dbData = JSON.parse(data);
        } catch (e) {
            console.error('Erro ao parsear o JSON:', e);
            return res.status(500).send('Erro interno do servidor');
        }

        // Verifica se dbData é um objeto e contém a chave 'users'
        if (typeof dbData !== 'object' || !Array.isArray(dbData.users)) {
            console.error('Formato do arquivo JSON inválido');
            return res.status(500).send('Formato do arquivo JSON inválido');
        }

        // Adiciona o novo usuário ao array 'users'
        dbData.users.push(newUser);

        // Escreve o arquivo JSON atualizado
        await fs.writeFile(USERS_FILE_PATH, JSON.stringify(dbData, null, 2));
        
        res.status(201).send('Usuário cadastrado com sucesso!');
    } catch (err) {
        console.error('Erro ao processar o arquivo:', err);
        res.status(500).send('Erro interno do servidor');
    }
});


app.listen(port, () => {
    console.log('Servidor rodando na porta:', port);
});