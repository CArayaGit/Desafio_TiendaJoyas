const express = require('express')
const joyas = require('./data/joyas.js')
const app = express()

const HATEOASV1 = () => {
  return joyas.results.map(item => {
    return {
      name: item.name,
      href: `http://localhost:3000/api/v1/joyas/${item.id}`
    }
  });
};

const HATEOASV2 = () => {
  return joyas.results.map(item => {
    return {
      Joya: item.name,
      Categoria: item.category,
      Valor: item.value,
      src: `http://localhost:3000/api/v2/joyas/${item.id}`
    }
  });
};


//1.- Ruta joyas V1: http://localhost:3000/api/v1/joyas/
app.get('/api/v1/joyas', (req, res) => {
    const datos = HATEOASV1();
    res.send(datos)
});


//2.- Ruta joyas V2: http://localhost:3000/api/v2/joyas
app.get('/api/v2/joyas', (req, res) => {
    const datos = HATEOASV2();
    const { value, page } = req.query;

    //6.- Paginación: http://localhost:3000/api/v2/joyas?page=1
    if (req.query.page) {
        return res.send({joyas: HATEOASV2().slice(page * 2 - 2, page * 2)}); 
    }

    //7.- Orden ASC/DESC: http://localhost:3000/api/v2/joyas?value=asc
    if (value == "asc") {
        const order = joyas.results.sort((a, b) => (a.value > b.value ? 1 : -1));
        return res.json(order);
    }
    if (value == "desc") {
        const order = joyas.results.sort((a, b) => (a.value < b.value ? 1 : -1));
        return res.json(order);
    }

    return res.json(datos); 
});


//Filtro por ID: http://localhost:3000/api/v2/joyas/3
app.get('/api/v2/joyas/:id', (req, res) => {
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
  
    //4.- Filtro por campos: http://localhost:3000/api/v2/joyas/5?fields=metal,model,value
    const arrayFields = fields.split(',');
    for (let propiedad in joyaObjeto) {
      if(!arrayFields.includes(propiedad)) delete joyaObjeto[propiedad]
    };
    return res.json(joyaObjeto);
  
});


//3.- Filtro por categoría: http://localhost:3000/api/v2/category/collar
//No funciona
app.get('/api/v2/categorias/:category', async (req, res) => {
    const category = joyas.results.filter((item) => item.category == req.params.category);

    return res.json(category);

});


const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log('Servidor OK. Puerto: ' + PORT))