import express from 'express';
import handlebars from 'express-handlebars'
import path from 'path';
import rutaProductos from './routes/products.js'
import * as http from 'http';
import io from 'socket.io';
import Productos from './classes.js'

const app = express();
const puerto = 8080;

const layoutsFolderPath = path.resolve(__dirname, '../views/layouts')
const partialsFolderPath = path.resolve(__dirname, '../views/partials');
const publicFolderPath = path.resolve(__dirname, '../public/');
app.use(express.static(publicFolderPath));

app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    extname: 'hbs',
    layoutsDir : layoutsFolderPath,
    partialsDir : partialsFolderPath 
}));

const myServer = http.Server(app);
myServer.listen(puerto, () => console.log('Server up en puerto', puerto));

app.use('/', rutaProductos);


const myWSServer = io(myServer);


const NuevosProductos = new Productos;


myWSServer.on('connection', function (socket) {
    console.log('\n\nUn cliente se ha conectado');
    console.log(`ID DEL SOCKET DEL CLIENTE => ${socket.client.id}`);
    console.log(`ID DEL SOCKET DEL SERVER => ${socket.id}`);

    socket.on('inicio-productos', () => {
        console.log('inicio lista de productos productos');
        const productos = NuevosProductos.leer();
        console.log(productos);
        if (productos.length > 0) {
            socket.emit('producto-update', productos);
         }
     });

    socket.on('producto-nuevo', products => {
        const {title,price,thumbnail} = products;
        console.log('nuevo producto');
        NuevosProductos.guardar(products);
        myWSServer.emit('producto-update', [products]);
    })

})