const express = require('express')
const uuid = require('uuid')
const port = 3000
const app = express()
app.use(express.json())


const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex(user => user.id === id)
    if (index < 0) {
        return response.status(404).json({ error: "Order not found" })
    }
    request.userIndex = index
    request.userId = id

    next()
}

const requests = (request, response, next) => {
    const method = request.route.methods
    const url = request.route.path
    console.log(method, url)

    next()
}

app.post('/order', requests, (request, response) => {
    const { order, clientName, price } = request.body
    const status = "Em preparação"
    const orderClient = { id: uuid.v4(), order, clientName, price, status }
    orders.push(orderClient)
    return response.status(201).json(orderClient)
})

app.get('/order', requests, (request, response) => {
    return response.status(201).json(orders)
})

app.put('/order/:id', checkOrderId, requests, (request, response) => {
    const { order, clientName, price } = request.body
    const index = request.userIndex
    const id = request.userId
    const status = "Em preparação"
    const updateOrders = { id, order, clientName, price, status }
    orders[index] = updateOrders
    return response.json(updateOrders)
})

app.delete('/order/:id', checkOrderId, requests, (request, response) => {
    const index = request.userIndex
    orders.splice(index, 1)

    return response.status(204).json()
})

app.get('/order/:id', checkOrderId, requests, (request, response) => {

    const index = request.userIndex
    const order = orders[index]

    return response.json(order)
})

app.patch("/order/:id", checkOrderId, requests, (request, response) => {
    const index = request.userIndex
    const { id, clientName, order, price } = orders[index]
    let status = orders[index].status
    status = "Pedido pronto"
    const finishedOrder = { id, order, clientName, price, status }
    orders[index] = finishedOrder

    return response.json(finishedOrder)
})


app.listen(port, () => {
    console.log(`🍔 Server started on port ${port} 🍔`)
})