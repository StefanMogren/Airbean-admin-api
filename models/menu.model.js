import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    prodId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
});

const Products = mongoose.model("Products", productsSchema);
export default Products;
