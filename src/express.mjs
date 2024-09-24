import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import cors from 'cors';
<<<<<<< HEAD
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
=======

>>>>>>> 817b4463573ed972472d978fce029226ac3a3368
const app = express();
const url = '/:action'
const port = 40000;

<<<<<<< HEAD

=======
>>>>>>> 817b4463573ed972472d978fce029226ac3a3368
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC = path.join(__dirname, '../public/front/');
const USERS_FILE_PATH = path.join(__dirname, '../src/database/seeders.json'); 

// USERS_FILE_PATH
<<<<<<< HEAD
=======

>>>>>>> 817b4463573ed972472d978fce029226ac3a3368
app.use(cors()); // Isso permite todas as origens
app.use(express.static(path.join(__dirname, '../public/front/')));
app.use(morgan('tiny'))
app.use(express.json());

<<<<<<< HEAD

app.get('/data/users', async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.json(users); 
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});
app.get('/data/macs', async (req,res) => {
    try{ 
        const macs = await prisma.mac.findMany();
        res.json(macs);
    }catch (error){
        res.status(500).json({error: "Macs Not Found"})
    }
});

app.get('/data/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    

    try {
        //findUnique busca pelo ID
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        
       if (user) {
            res.json(user);
        } else {
            res.status(404).send('Usuário não encontrado');
        }
    } catch (err) {
        console.error('Erro ao buscar o usuário:', err);
        res.status(500).send('Erro interno do servidor');
    }
});


=======
>>>>>>> 817b4463573ed972472d978fce029226ac3a3368
app.get(url, (req, res) => {
    const { action } = req.params;

    switch(action){
        case "login":
<<<<<<< HEAD
            res.sendFile(`${PUBLIC}html/login.html`);
            break;
        case "cadastro":
            res.sendFile(`${PUBLIC}html/cadastro.html`)
            break;
        case "sobre":
            res.sendFile(`${PUBLIC}html/sobre.html`)
            break;
        case "contato":
            res.sendFile(`${PUBLIC}html/contato.html`)
            break;
        case "home":
            res.sendFile(`${PUBLIC}html/index.html`)
            break;
        default:
            res.status(404).send('Página não encontrada');
                break;         
    }
})



app.post('/data/users', async (req, res) => {
    const { nome, email, senha } = req.body; // Desestruturando o novo usuário

    console.log('Novo usuário:', req.body); // Logando os dados do novo usuário

    try {
        const newUser = await prisma.user.create({
            data: {
                nome,
                email,
                senha,
            }
        });

        res.status(201).json(newUser); // Retorna o novo usuário como resposta
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
=======
            res.sendfile(`${PUBLIC}html/login.html`);
            break;
        case "cadastro":
            res.sendfile(`${PUBLIC}html/cadastro.html`)
            break;
        case "sobre":
            res.sendfile(`${PUBLIC}html/sobre.html`)
            break;
        case "contato":
            res.sendfile(`${PUBLIC}html/contato.html`)
            break;
        case "home":
            res.sendfile(`${PUBLIC}html/index.html`)
            break;
        case "users":
            res.sendfile(`./database/seeders.json`); 
            break;    
    }
})

app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const data = await fs.readFile('./database/seeders.json', 'utf8');
        const dbData = JSON.parse(data);
        
        const user = dbData.users.find(user => user.id == userId);
        
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('Usuário não encontrado');
        }
    } catch (err) {
        console.error('Erro ao processar o arquivo:', err);
        res.status(500).send('Erro interno do servidor');
    }
});



app.post('/users', async (req, res) => {
    const newUser = req.body;
    console.log('Novo usuário:', newUser);

    try {
        // Lê o arquivo JSON atual
        const data = await fs.readFile(USERS_FILE_PATH, 'utf8');
        let dbData;
        console.log(data)
        console.log()
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
>>>>>>> 817b4463573ed972472d978fce029226ac3a3368
        res.status(500).send('Erro interno do servidor');
    }
});


app.listen(port, () => {
    console.log('Servidor rodando na porta:', port);
<<<<<<< HEAD
});

=======
});
>>>>>>> 817b4463573ed972472d978fce029226ac3a3368
