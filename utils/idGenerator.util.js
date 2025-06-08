import { v4 as uuid } from "uuid";

export const generateUserId = () => `user-${uuid().substring(0, 5)}`;
export const generateCartId = () => `cart-${uuid().substring(0, 5)}`;
export const generateProdId = () => `prod-${uuid().substring(0, 5)}`;
