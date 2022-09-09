const fs = require("fs")

class Contenedor {
    
     constructor(file,){
        this.file=file
     }

     save= async (object)=>{
        try {
            let data = await fs.promises.readFile(this.file,"utf-8")
            let parsedData

            try {
                parsedData = await JSON.parse(data)
            } catch (error) {
                parsedData = []
            }
            if(parsedData.length > 0){
                object.id = parsedData[parsedData.length-1].id + 1;
                parsedData.push(object)
                await fs.promises.writeFile(this.file, JSON.stringify(parsedData, null, 2))
                console.log(object.id) 
            } else{
                parsedData = []
                object.id = 1
                parsedData.push(object)
                await fs.promises.writeFile(this.file, JSON.stringify(parsedData, null, 2))
                console.log(object.id)
            }

        } catch (error) {
            console.log(error)
        }

     }

     getById= async (id)=>{
         try {
             let data = await fs.promises.readFile(this.file,"utf-8");
             let parsedData = await JSON.parse(data)
             if(parsedData.find(el => el.id === id)) {
              return parsedData.find(el => el.id === id)
             } else {
                console.log('el elemento no existe')
             }
             
         } catch (error) {
             console.error(error)
             
         }

     }

     getAll= async()=>{
         try {
            let data = await fs.promises.readFile(this.file, "utf-8")
            let parsedData = await JSON.parse(data)
           return parsedData 
         } catch (error) {
             console.error(error)
         }

     }

     deleteById= async (id)=>{
        try {
            let data = await fs.promises.readFile(this.file, "utf-8")
            let parseData = await JSON.parse(data)
            if (parseData.some(e=>e.id === id)) {
                let obj = parseData.find(e=>e.id===id)
                let objPosition = parseData.indexOf(obj)
                parseData.splice(objPosition,1)
                fs.promises.writeFile(this.file, JSON.stringify(parseData, null, 2))
                console.log('producto eliminado')
            }
            
        } catch (error) {
            console.error(error)
        }
            
        
     }
     deleteAll= async()=>{
        try {
            await fs.promises.writeFile(this.file, JSON.stringify([]))
            console.log('el contenedor esta vacio')
            
        } catch (error) {
            console.error(error)
        }
     }

     getRandomProduct = async()=>{
        try {
            let data = await fs.promises.readFile(this.file, "utf-8")
            let parseData = await JSON.parse(data)
            let randomIndex = Math.floor(Math.random()*parseData.length)
            let randomProduct = parseData[randomIndex]
            return randomProduct
            
        } catch (error) {
            console.log(error)
        }
     }

     updateProduct= async(id,obj)=>{
        try {
            let data = await fs.promises.readFile(this.file, "utf-8")
            let parseData = await JSON.parse(data)
            let productIndex = parseData.findIndex(products=> products.id === id)

            if (parseData[productIndex]) {
                
                parseData[productIndex] = { ...parseData[productIndex],...obj}
                await fs.promises.writeFile(this.file, JSON.stringify(parseData, null, 2))
            } else{
                console.error("no se encontro el producto que quieres actualizar")
            }
          return parseData[productIndex]
        } catch (error) { 
        }
     }
     
}
module.exports = Contenedor;