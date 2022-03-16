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

//1.- Ruta joyas V1: http://localhost:3000/api/v1/joyas/
app.get('/api/v1/joyas', (req, res) => {
  const {category, value, page} = req.query;
  const datos = HATEOAS();

  if(!category)
  //return res.json(datos);

  //6.- Paginación: http://localhost:3000/api/v1/joyas?page=1
  if(page){
    return res.json(datos.slice(page * 2 -2, page *2));
  };

  //7.- Orden ASC/DESC: http://localhost:3000/api/v2/joyas?value=asc
  //No funciona orden asc ni desc
  if(value === 'asc'){
    const order = datos.results.sort((a,b) => (a.value > b.value ? 1 : -1));
    return res.json(order)
  };

  if(value === 'desc'){
    const order = datos.results.sort((a,b) => (a.value < b.value ? 1 : -1));
    return res.json(order)
  };

});

//Filtro por ID: http://localhost:3000/api/v1/joyas/3
app.get('/api/v1/joyas/:id', (req, res) => {
  const { id } = req.params;
  const { fields } = req.query;

  //Con opcion comentada, no funciona el mensaje de error
  //const joyaObjeto = {...joyas.results.find(item => item.id == id)};
  const joyaObjeto = joyas.results.find(item => item.id == id);

  //5.- Mensaje de error: http://localhost:3000/api/v1/joyas/9
  if(!joyaObjeto){
    return res.status(404).json({msg: 'Error: Joya no encontrada.'});
  };

  if(!fields){
    return res.json(joyaObjeto);
  };

  //4.- Filtro por campos: http://localhost:3000/api/v1/joyas/5?fields=metal,model,value
  const arrayFields = fields.split(',');
  for (let propiedad in joyaObjeto) {
    if(!arrayFields.includes(propiedad)) delete joyaObjeto[propiedad]
  };
  return res.json(joyaObjeto);

});

//3.- Filtro por categoría: http://localhost:3000/api/v1/categorias/collar
//Error al realizar consulta
app.get('/api/v1/categorias/:category', async (req, res) => {
  const { category } = req.params;
  const filtroCategoria = result.filter((item) => item.category == category);
  return res.json(filtroCategoria);
});


//2.- Ruta joyas V2: http://localhost:3000/api/v2/joyas
app.get('/api/v2/joyas', (req, res) => {
  const {category} = req.query;
  const datosV2 = HATEOAS2();

  if(!category)
  return res.json(datosV2);

});


const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log('Servidor OK. Puerto: ' + PORT))