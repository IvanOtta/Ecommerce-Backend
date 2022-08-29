const { urlencoded } = require("express");
const express = require("express");
const app = express();
const { Router } = express;
const router = Router();
const PORT = process.env.port || 8080;

const server = app.listen(PORT, () => {
  console.log(`Connected in server ${server.address().port}`);
});

server.on("error", (error) => console.log(error));

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + "/public"));
app.use("/api/productos", router);

const productsArg = [
  {
    id: 1,
    title: "Camiseta Argentina Qatar 2022",
    price: 18000,
    thumbnail:
      "http://localhost:8080/public/camiseta-adidas-argentina-2022-3.jpg",
  },
  {
    id: 2,
    title: "Pelota Qatar 2022",
    price: 45000,
    thumbnail:
      "http://localhost:8080/public/pelota-qatar-2022-adidas-al-rihla-league-box-replica-numero-5-blanca-100040h57782001-1.jpg",
  },
  {
    id: 3,
    title: "Botines adidas Lionel Messi x Speedflow",
    price: 19000,
    thumbnail:
      "http://localhost:8080/public/messi-botines-2022-adidas-x-speedflow-mi-historia-nm.jpg",
  },
];

const admin = true;

router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const prodFound = productsArg.find((item) => item.id == id);
  if (id) {
    res.json(prodFound);
  }else{
    next()
  }

})

router.get('/', (req,res) => {
    res.json(productsArg)
})

router.post('/admin', (req, res,next) => {
    const {body} = req

    const lastId = productsArg.length  
    const newId = lastId + 1
    body.price = parseInt(body.price)
    body.id = parseInt(newId)
    productsArg.push(body)

    res.json({status: '200', new: body})
    if(!admin){
        next()
    }
})

router.put('/:id', (req, res, next) => {
    const {id} = req.params
    const {body} = req

    const prodUpdate = productsArg.find(item => item.id == id)
    prodUpdate.price = body.price

    res.json({status: '200', new: prodUpdate})
    if(!admin){
        next()
    }
})

router.delete('/:id', (req, res, next) => {
    const {id} = req.params
    console.log(id)
    if(productsArg.some(item => item.id == id)){
        let obj = productsArg.find(item => item.id == id)
        let posicion = productsArg.indexOf(obj)
        productsArg = productsArg.splice(posicion,1)
        res.json(productsArg)
    }
    res.json({status:'ok'})
    if(!admin){
        next()
    }
})


app.all("/*", (req, res) => {
  res.status(404).json({ error: "pagina no encontrada" });
});
