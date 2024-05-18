import express from "express"
import { __dirname } from "./utils.js"
import handlebars from "express-handlebars"
import {Server} from "socket.io"

import productRoutes from "./routes/productRoutes.js"
import cartRouter from "./routes/cartRoutes.js"
import viewsRoutes from "./routes/viewsRoutes.js"

import connectToDB from "./config/configServer.js"

import socketProducts from "./listener/socketProducts.js"
import socketChat from "./listener/socketChat.js"
const app = express()
const PORT=8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + "/public"))
//handlebars
app.engine("handlebars",handlebars.engine())
app.set("views", __dirname+"/views")
app.set("view engine","handlebars")
//rutas
app.use("/api",productRoutes)
app.use("/api",cartRouter)
app.use('/', viewsRoutes)

const httpServer=app.listen(PORT, () => {
    try {
        console.log(`Listening to the port ${PORT}\nAcceder a:`)
        console.log(`\t1). http://localhost:${PORT}/api/products`)
        console.log(`\t2). http://localhost:${PORT}/api/carts`)
    }
    catch (err) {
        console.log(err)
    }
})

connectToDB()
const socketServer = new Server(httpServer)

socketProducts(socketServer)
socketChat(socketServer)