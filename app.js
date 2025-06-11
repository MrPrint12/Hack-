const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const pdf = require('html-pdf');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const USER_CREDENTIALS = {
  contribuinte: 'C913277700',
  senha: 'Rosario123'
};

const EMPRESA = {
  contribuinte: 'C913277700',
  nome: 'NEW 143 LDA',
  actividade: 'ACTIVIDADES DOS SERVICOS NAO FINANCEIROS'
};

app.post('/api/login', (req, res) => {
  const { contribuinte, senha } = req.body;
  if (contribuinte === USER_CREDENTIALS.contribuinte && senha === USER_CREDENTIALS.senha) {
    res.status(200).json({ sucesso: true, dados: EMPRESA });
  } else {
    res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas ou não autorizados' });
  }
});

app.get('/api/gerar-pdf', (req, res) => {
  const conteudoHTML = `
    <h1>Hack Iremoval - SERVIÇOS DE INSS</h1>
    <p><strong>Nº Contribuinte:</strong> ${EMPRESA.contribuinte}</p>
    <p><strong>Nome:</strong> ${EMPRESA.nome}</p>
    <p><strong>Actividade Principal:</strong> ${EMPRESA.actividade}</p>
    <p><strong>Conta:</strong> BINANCE - https://s.binance.com/xk5ApxW9</p>
    <p><strong>Valor:</strong> 104 USD</p>
  `;

  pdf.create(conteudoHTML).toStream((err, stream) => {
    if (err) return res.status(500).send('Erro ao gerar PDF');
    res.setHeader('Content-type', 'application/pdf');
    stream.pipe(res);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
