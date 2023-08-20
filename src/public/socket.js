const socket = io();

socket.on('listChange', (data) => {
    console.log(data)
    updateList(data);
})

const listContainer = document.getElementById('listContainer');

const updateList = (list) => {
    listContainer.innerHTML = '';
    list.forEach((item) => {
        const product = document.createElement('div');
        product.setAttribute('style','display: flex; gap: 1rem; align-items: center;' )
        product.innerHTML = `
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <p>Price: ${item.price}</p>
                        <p>id: ${item.id}</p>
                        <p>code :${item.code}</p>
                        <p>Stock:${item.stock}</p>
                    `;
        listContainer.appendChild(product);
    })
}