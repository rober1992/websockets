const socket = io.connect();


socket.emit('inicio-productos');


socket.on('producto-update', (products) => {
    products.forEach((product) => {
        addTr(product);
        console.log(product)
    });
});

const addTr = (productos) => {
    let tbodyID = document.getElementById('tbodyID');

        tbodyID.innerHTML += 
            `
        <tr>
            <td>${productos.title}</td>
            <td>${productos.price}</td>
            <td>${productos.thumbnail}</td>
        </tr>
        `;
}
