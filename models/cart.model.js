import mongoose from "mongoose";

import { generateCartId } from "../utils/idGenerator.util.js";

const Schema = mongoose.Schema;

const cartSchema = new Schema(
    {
        cartId: {
            type: String,
            default: () => generateCartId(),
            unique: true,
        },
        userId: {
            type: String,
            default: null,
        },
        guestId: {
            type: String,
            default: null,
        },
        items: [
            {
                prodId: {
                    type: String,
                    required: true,
                },
                qty: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],
    },
    { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
