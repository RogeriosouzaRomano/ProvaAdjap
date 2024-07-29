const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;  // Usando a variável de ambiente PORT

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Servir arquivos estáticos

const dataFilePath = './dados.json';

// Endpoint para obter usuários
app.get('/usuarios', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao ler o arquivo de dados' });
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint para cadastrar novos usuários
app.post('/cadastrar', (req, res) => {
    const novoUsuario = req.body;

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao ler o arquivo de dados' });
        }
        
        const usuarios = JSON.parse(data).usuarios;

        // Verificar se o email já existe
        if (usuarios.find(user => user.email === novoUsuario.email)) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        usuarios.push(novoUsuario);

        fs.writeFile(dataFilePath, JSON.stringify({ usuarios }), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao salvar o novo usuário' });
            }
            res.json({ message: 'Cadastro realizado com sucesso' });
        });
    });
});

// Iniciar o servidor e ouvir no IP 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
                          
