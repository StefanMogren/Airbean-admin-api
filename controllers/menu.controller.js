import Menu from "../models/menu.model.js";

import CustomError from "../utils/customError.util.js";

// GET /api/menu
export const getAllMenuItems = async (req, res, next) => {
	try {
		const menu = await Menu.find();
		res.status(200).json(menu);
	} catch (err) {
		next(new CustomError("Failed to get menu items", 500, err));
	}
};

// POST /api/menu
/* 
Description: Adds new product to menu

Headers: Authorization : <token>

Body:

{
  "title" : <product name>,
  "desc" : <product description>,
  "price" : <product price>
} 
*/

// PUT /api/menu/{prodId}
/* 
Description: Updates product in menu

Headers: Authorization : <token>

Body:

{
  "title" : <product name>,
  "desc" : <product description>,
  "price" : <product price>
}
*/

// DELETE /api/menu/{prodId}
/* 
Description: Deletes product in menu

Headers: Authorization : <token>
*/
