const express = require("express");

const app = express();
const PORT = 3000;

const products = [
    {
        id: 1,
        name: "Laptop",
        price: 1200,
        category: "electronics"
    },
    {
        id: 2,
        name: "Phone",
        price: 800,
        category: "electronics"
    },
    {
        id: 3,
        name: "Table",
        price: 300,
        category: "furniture"
    },
    {
        id: 4,
        name: "Chair",
        price: 150,
        category: "furniture"
    },
    {
        id: 5,
        name: "Headphones",
        price: 200,
        category: "electronics"
    }
];

app.get("/products", (req, res) => {
    const { take, category } = req.query;

    let result = products;

    if (category) {
        result = result.filter((product) => product.category === category);
    }

    if (take !== undefined) {
        const takeNumber = Number(take);

        if (!Number.isInteger(takeNumber) || takeNumber <= 0) {
            return res.status(400).json({
                error: "Invalid take"
            });
        }

        result = result.slice(0, takeNumber);
    }

    res.status(200).json(result);
});

app.get("/products/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            error: "Invalid product id"
        });
    }

    const product = products.find((product) => product.id === id);

    if (!product) {
        return res.status(404).json({
            error: "Product not found"
        });
    }

    res.status(200).json(product);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});