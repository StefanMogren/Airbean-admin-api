import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    // "userId" och "guestId" kommer bara inkluderas ifall de får ett värde då de inte har "required: true"
    // Använder en kontroll i botten av koden för att säkerställa att en av dem kommer finnas.
    userId: {
        type: String,
    },
    guestId: {
        type: String,
    },
    items: [
        {
            prodId: {
                type: String,
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            qty: {
                type: Number,
                required: true,
                min: 1,
            },
        },
    ],
    total: {
        type: Number,
        required: true,
        min: 1,
    },
    discountsApplied: [String],
});

/* // En kontroll att antingen "userId" eller "guestId" inkluderas
orderSchema.pre("validate", (next) => {
    if (!this.userId && !this.guestId) {
        this.invalidate("userId", "Either userId or guestId must be provided");
        this.invalidate("guestId", "Either userId or guestId must be provided");
    }
    next();
}); */

const Order = mongoose.model("Order", orderSchema);

export default Order;
