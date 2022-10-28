import 'dotenv/config';
import mongoose from 'mongoose';
import { Category, Projects} from './models/index.js';
import express from 'express';
import cors from 'cors';
let app = express();
app.use(cors());

async function getApi(collection, req) {
  let limit = 10;
  if (typeof req.query._limit !== 'undefined') limit = parseInt(req.query._limit);
  if (typeof req.query._end !== 'undefined') limit = parseInt(req.query._end);
  const sorting = {};
  let sort = 'id';
  if (typeof req.query._sort !== 'undefined') sort = req.query._sort;
  let order = 1;
  if (typeof req.query._order !== 'undefined' && req.query._order === 'desc') order = -1;
  sorting[sort] = order;

  let skip = 0;
  if (typeof req.query._page !== 'undefined') skip = parseInt(req.query._page) * limit - limit;
  if (typeof req.query._start !== 'undefined') skip = parseInt(req.query._start);

let query = {};
for (let q in req.query) {
  if (q[0] === '_') continue;
if (q === 'q') {
  query["$text"] = {$search: req.query[q]};
} else if (q.indexOf('_like') > -1) {
  query[q.split('_')[0]] = {$regex: req.query[q],$options:"$i"};
} else if (q.indexOf('_lte') > -1) {
  query[q.split('_')[0]] = {$lte: parseInt(req.query[q])};
} else if (q.indexOf('_gte') > -1) {
  query[q.split('_')[0]] = {$gte: parseInt(req.query[q])};
} else if (q.indexOf('_ne') > -1) {
  query[q.split('_')[0]] = {$ne: req.query[q]};
} else {
  query[q] = req.query[q];
}
}
    console.log(collection);
  let data = await collection.find(query).sort(sorting).skip(skip).limit(limit);
console.log(data);
return data;
}

app.get('/category', async function (req, res) {
  if (!req.headers['x-api-key'] || req.headers['x-api-key'] && req.headers['x-api-key'] !== process.env.API_KEY) {
    res.send('{}');
    return;
  } else {
    delete req.headers['x-api-key'];
  }
  let data = await getApi(Category, req);
  res.send(data);
});

app.get('/projects', async function (req, res) {
  if (!req.headers['x-api-key'] || req.headers['x-api-key'] && req.headers['x-api-key'] !== process.env.API_KEY) {
    res.send('{}');
    return;
  } else {
    delete req.headers['x-api-key'];
  }
  console.log('GET запрос:', JSON.stringify(req.query));
let data = await getApi(Projects, req);
res.send(data);
});

app.post('/category', async function (req, res) {
  if (!req.headers['x-api-key'] || req.headers['x-api-key'] && req.headers['x-api-key'] !== process.env.API_KEY) {
    res.send('{}');
    return;
  } else {
    delete req.headers['x-api-key'];
  }
  const filter = {};
  if (typeof req.query.id !== 'undefined') {
    filter = {id: req.query.id};
delete req.query.id;
} else {
  let counter = await Category.find({}).count() + 1;
  req.query.id = counter;
}
  let data =   await Category.updateOne(filter, req.query,
  { upsert: true }
);
res.send(data);
});

app.post('/projects', async function (req, res) {
  if (!req.headers['x-api-key'] || req.headers['x-api-key'] && req.headers['x-api-key'] !== process.env.API_KEY) {
    res.send('{}');
    return;
  } else {
    delete req.headers['x-api-key'];
  }
  console.log('POST запрос:', JSON.stringify(req.query));
  const filter = {};
    if (typeof req.query.id !== 'undefined') {
      filter = {id: req.query.id};
  delete req.query.id;
  } else {
    let counter = await Projects.find({}).count() + 1;
    req.query.id = counter;
  }
    if (req.query.links && req.query.links !== '') {
      let links_arr = req.query.links.split(', ');
if (links_arr[0] === 'null' || links_arr[0] === null || links_arr[0] === '"null"') req.query.links = null;
    }
  let data =   await Projects.updateOne(filter, req.query,
    { upsert: true }
  );
  res.send(data);
  });
app.listen(3000, function () {
});