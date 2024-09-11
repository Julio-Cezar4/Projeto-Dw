import express from 'express';
import morgan from 'morgan';

const app = express();
const url = '/:action'
const port = 40000;

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
        default:
            res.send(`404 Not Found`)
    }
})

app.listen(port, () => {
    console.log('Servidor rodando na porta: ', port)
})