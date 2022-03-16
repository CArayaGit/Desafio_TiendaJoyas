const express = require('express')
const joyas = require('./data/joyas.js')
const app = express()

const HATEOAS = () => {
  return joyas.results.map(item => {
    return {
      name: item.name,
      href: `http://localhost:3000/api/v1/joyas/${item.id}`
    }
  });
};

const HATEOAS2 = () => {
  return joyas.results.map(item => {
    return {
      Joya: item.name,
      value: item.value,
      src: `http://localhost:3000/api/v2/joyas/${item.id}`
    }
  });
};

app.get('/api/v1/joyas', (req, res) => {
  const {category, value, page} = req.query;
  const datos = HATEOAS();

  if(!category)
  return res.json(datos);

  if(page){
    return res.json(datos.slice(page * 2 -2, page *2));
  };

  if(value === 'asc'){
    const order = data.results.sort((a,b) => (a.value > b.value ? 1 : -1));
    return res.json(order)
  };

  if(value === 'desc'){
    const order = data.results.sort((a,b) => (a.value < b.value ? 1 : -1));
    return res.json(order)
  };

});


app.get('/api/v1/joyas/:id', (req, res) => {
  const { id } = req.params;
  const { fields } = req.query;

  const joyaObjeto = {...joyas.results.find((item) => item.id == id)};

  if(!joyaObjeto){
    return res.status(404).json({msg: 'Error: Joya no encontrada.'});
  };

  if(!fields){
    return res.json(joyaObjeto);
  };

  const arrayFields = fields.split(',');
  for (let propiedad in joyaObjeto) {
    if(!arrayFields.includes(propiedad)) delete joyaObjeto[propiedad]
  };
  return res.json(joyaObjeto);

});


app.get('/api/v2/joyas', (req, res) => {
  const {category, value, page} = req.query;
  const datos = HATEOAS2();

  if(!category)
  return res.json(datos);

  if(page){
    return res.json(datos.slice(page * 2 -2, page *2));
  };

  if(value === 'asc'){
    const order = data.results.sort((a,b) => (a.value > b.value ? 1 : -1));
    return res.json(order)
  };

  if(value === 'desc'){
    const order = data.results.sort((a,b) => (a.value < b.value ? 1 : -1));
    return res.json(order)
  };

});


const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log('Servidor OK. Puerto: ' + PORT))