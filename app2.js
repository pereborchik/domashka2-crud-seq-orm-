const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes} = require('sequelize');
const dbconfig = require('./dbconfig.json')

const app = express();
const port = 3000;
const sequelize = new Sequelize(dbconfig.development.database, dbconfig.development.username, dbconfig.development.password,  {
  host: dbconfig.development.host,
  port: dbconfig.development.port,
  dialect: 'postgres',
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true
    }
  }
});

// Задача со звёздочкой - писать и изменять данные в базе с помощью sequelize orm, которая у нас в коре/интеграциях используется.

sequelize.authenticate()
  .then(() => {
    console.log('norm');
  })
  .catch(err => {
  console.error('error', err)
  });

const channels = {};
let idCounter = 1;

const item = sequelize.define('Item', {
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
});

item.sync()
  .then(() => {
    console.log('Таблица успешно синхронизирована');
  })
  .catch(error => {
    console.error('Ошибка синхронизации таблицы:', error);
  });

app.use(bodyParser.json()); // Парсер для обработки json
app.use(bodyParser.urlencoded({ extended: true })); // Парсер для обработки URL-кодированных данных (не пон)

app.post('/', async (req, res) => {
  const channelData = req.body;
  channels[idCounter] = channelData;
  console.log(channelData)
  res.status(201).json({channels: [idCounter]});
  idCounter += 1;
  try {
    await item.create(channelData);
  } catch (error) {
    console.error('Ошибка при создании объекта:', error);
    res.send('Ошибка при добавлении объекта в БД');
  }
});


app.get('/all', (req, res) => {
  res.json(channels);
});

app.get('/:id', (req, res) => {
  const channel = channels[req.params.id];
  if (!channel) return res.status(400).send('Нет такого канала');
  res.json(channel);
});


app.post('/update', (req, res) => {
  const updateData = req.body;
  Object.keys(updateData).forEach(key => {
    if (randomObjects.hasOwnProperty(key)) {
      randomObjects[key] = updateData[key];
      res.send(updateData);
    } else {
      res.send('Нет такого элемента');
    }
  });
});

app.delete('/:id', (req, res) => {
  const idToDelete = req.params.id;

  if (randomObjects.hasOwnProperty(idToDelete)) {
    delete randomObjects[idToDelete];
    res.send(`Элемент с ключом '${idToDelete}' удален`);
  } else {
    res.send(`Нет элемента с ключом '${idToDelete}'`);
  }
});

app.listen(port, () => {
  console.log(`Слушаю порт ${port}`);
});