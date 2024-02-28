const express = require('express');
const bodyParser = require('body-parser');


const app = express();
const port = 3000;

// Задачка - написать crud роутер с помощью express'а. Роутов будет 4, следуя аббревиатуре: create, read, update, delete.
// Изменения надо делать в объекте, который в стейте самого приложения напишешь (в смысле просто объект в коде твоём).
// Чтоб проще нагуглить было - это http сервером ещё обзывается.
// Задача со звёздочкой - писать и изменять данные в базе с помощью sequelize orm, которая у нас в коре/интеграциях используется.

const channels = {};
let idCounter = 1;

app.use(bodyParser.json()); // Парсер для обработки json
app.use(bodyParser.urlencoded({ extended: true })); // Парсер для обработки URL-кодированных данных (не пон)

app.post('/', (req, res) => {
  const channelData = req.body;
  channels[idCounter] = channelData;
  console.log(channelData)
  res.status(201).json({channels: [idCounter]});
  idCounter += 1;
});

app.get('/all', (req, res) => {
  res.json(channels);
});

app.get('/:id', (req, res) => {
  const channel = channels[req.params.id];
  if (!channel) return res.status(400).send('Нет такого канала');
  res.json(channel);
});

app.patch('/:id', (req, res) => {
  const channelId = req.params.id;
  if (!channels[channelId]) return res.status(400).send('Нет такого канала');
  const channelData = req.body;
  channels[channelId] = channelData;
  res.json({ channels: [channelId] });
});

app.delete('/:id', (req, res) => {
  const channelId = req.params.id;
  if (!channels[channelId]) return res.status(400).send('Нет такого канала');
  delete channels[channelId];
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Слушаю порт ${port}`);
});