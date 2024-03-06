export async function getAllProducts(req, res) {
    try {
        res.send("all products");
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getProductById(req, res) {
    try {
        res.send("product by id");
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
