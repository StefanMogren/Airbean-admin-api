import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
	{
		prodId: {
			type: String,
			required: true,
			unique: true,
		},
		title: {
			type: String,
			required: true,
			unique: true,
		},
		desc: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

const Menu = mongoose.model("menu", menuSchema);
export default Menu;
