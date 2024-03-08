import { User } from "./UserModel.js";
import { Product } from "./ProductModel.js";
import { Variant } from "./VariantModel.js";

Product.hasMany(Variant);
Variant.belongsTo(Product);

export { User, Product, Variant };
