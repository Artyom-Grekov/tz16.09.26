const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

const products = [
    {
        id: 1,
        name: "Laptop",
        price: 1200,
        category: "electronics",
        image: ""
    },
    {
        id: 2,
        name: "Phone",
        price: 800,
        category: "electronics",
        image: ""
    },
    {
        id: 3,
        name: "Table",
        price: 300,
        category: "furniture",
        image: ""
    },
    {
        id: 4,
        name: "Chair",
        price: 150,
        category: "furniture",
        image: ""
    },
    {
        id: 5,
        name: "Headphones",
        price: 200,
        category: "electronics",
        image: ""
    }
];

function addProduct(newProduct, shouldFail) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error("Failed to save product"));
                return;
            }

            products.push(newProduct);
            resolve(newProduct);
        }, 500);
    });
}

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

app.post("/products", async (req, res) => {
    const { name, price, category, image = "" } = req.body;

    if (
        typeof name !== "string" ||
        name.trim() === "" ||
        typeof price !== "number" ||
        price <= 0 ||
        typeof category !== "string" ||
        category.trim() === ""
    ) {
        return res.status(422).json({
            error: "Invalid product data"
        });
    }

    const productExists = products.some(
        (product) => product.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (productExists) {
        return res.status(409).json({
            error: "Conflict"
        });
    }

    const newProduct = {
        id: products.length + 1,
        name: name.trim(),
        price,
        category: category.trim(),
        image
    };

    try {
        const product = await addProduct(
            newProduct,
            req.query.fail === "true"
        );

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});