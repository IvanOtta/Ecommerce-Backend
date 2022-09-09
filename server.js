const { urlencoded } = require("express");
const express = require("express");
const app = express();
const { Router } = express;
const router = Router();
const cartRouter = Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});

const PORT = process.env.port || 8080;

const server = app.listen(PORT, () => {
  console.log(`Connected in server ${server.address().port}`);
});

server.on("error", (error) => console.log(error));

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + "/public"));
app.use("/api/productos", router);
app.use("/api/carrito", cartRouter);

const Contenedor = require("./contenedor.js");

const productos = new Contenedor("productos.txt");
const carro = new Contenedor("carrito.txt");

const admin = true;

//PRODUCTOS

// app.all("*", (req, res) => {
//   res.json({
//     error: -2,
//     description: `ruta ${req.url} metodo ${req.method} no autorizado`,
//   });
// });

app.get("/form", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

router.get("/", async (req, res) => {
  const productsList = await productos.getAll();
  res.send(await productsList);
});

router.post(
  "/",
  (req, res, next) => {
    if (!admin) {
      res.send({
        error: -1,
        descripcion: "no autorizado",
      });
    } else {
      next();
    }
  },
  urlencodedParser,
  jsonParser,
  async (req, res) => {
    const { body } = req;

    const newId = await productos.save(body);
    res.json({ success: "ok", new: { ...body, id: newId } });
  }
)

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const productoId = await productos.getById(Number(id));
  res.json(productoId);
});

router.put("/:id",(req, res, next) => {
    if (!admin) {
      res.send({ error: -1, descripcion: "no autorizado" });
    } else {
      next();
    }},urlencodedParser,jsonParser,async (req, res) => {
    const { body } = req;
    console.log(body);
    const id = Number(req.params.id);

    const changesInProd = await productos.updateProduct(id, body);
    res.json(await changesInProd);
  }
);

router.delete(
  "/:id",
  (req, res, next) => {
    if (!admin) {
      res.send({
        error: -1,
        descripcion: "no autorizado",
      });
    } else {
      next();
    }
  },

  async (req, res) => {
    const productoEliminado = await productos.deleteById(Number(req.params.id));
    res.json(productoEliminado);
  }
);

//              CARRITO DE COMPRA

cartRouter.post("/", async (req, res) => {
  let productos = [];
  let timeStamp = Date.now();
  const nuevoCarrito = await carro.save({ timeStamp, productos });
  res.json(nuevoCarrito);
});

cartRouter.delete('/:id',(req, res, next) => {
  if (!admin) {
    res.send({
      error: -1,
      descripcion: "no autorizado",
    });
  } else {
    next();
  }
} , async (req,res)=>{

  const id = req.params.id;
  let carritoEliminado = await carro.deleteById(Number(id));
  res.json(carritoEliminado)
})

cartRouter.post('/:id/productos', urlencodedParser, jsonParser,  async (req,res)=>{
  const id = req.params.id;
  const { body } = req

  const productoAgregado = await productos.getById(Number(body.id))
  
  const carritoID = await carro.getById(parseInt(id));
  const productosCarrito = carritoID.productos;
  productosCarrito.push(productoAgregado);
  await carro.updateProduct(Number(id),{
      productos: productosCarrito
  })
res.json(productosCarrito)

})

cartRouter.delete('/:id/productos/:id_prod', async (req,res)=>{
  const id = req.params.id;
  const id_prod = req.params.id_prod;

  const carritoID = await carro.getById(Number(id))
  const productosCarrito = carritoID.productos;
 
  const prodDelete =  productosCarrito.filter(e => e.id !== Number(id_prod))

  await carro.updateProduct(Number(id),{
    productos: prodDelete
})
  res.json('done')

})