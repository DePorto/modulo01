const express = require('express');

const server = express();

server.use(express.json());

//Query params = ?teste=1
//Query params = /users/1
//Request body = {"name" : "Deini", "email":"deini.porto@cmc.pr.gov.br"}

const users = ['Feliz', 'Soneca', 'Zangado', 'Mestre', 'Dunga'];

//esta função sempre é chamada independente da rota!
server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();
  
  console.timeEnd('Request');
  console.log('Finalizou');
});

//middleware para verificar se um nome foi enviado
function checkUserExists(req, res, next) {
  if (!req.body.name){
    return res.status(400).json({ "error": "Username required"});
  }
  return next();
}

//middleware para verificar se há o usuário solicitado
function checkUserInArray(req, res, next){
  const user = users[req.params.index];

  if (!user){
    return res.status(400).json({"error": "User does not exist"});
  }
  req.user = user;

  return next();
}

//CRUD - Create, Read, Update & Delete

//lista todos
server.get('/users', (req, res) => {
  return res.json(users);
})

//busca por índice de array
server.get('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params; //desestruturação do ES6 > const { index }
  
  return res.json(users[index]);
});

//adiciona novo ao final da lista
server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

//edita um registro existente
server.put('/users/:index', checkUserInArray, checkUserExists, (req,res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

//apaga um registro
server.delete('/users/:index', checkUserInArray, (req,res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3333);
