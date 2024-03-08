import { User } from "./UserModel.js";
import { Product } from "./ProductModel.js";
import { OptionName } from "./OptionNameModel.js";
import { OptionValue } from "./OptionValueModel.js";
import { Variant } from "./VariantModel.js";

Product.hasMany(Variant);
Variant.belongsTo(Product);

OptionName.hasMany(OptionValue);
OptionValue.belongsTo(OptionName);

Variant.belongsToMany(OptionValue, { through: "VariantOption" });
OptionValue.belongsToMany(Variant, { through: "VariantOption" });

export { User, Product, OptionName, OptionValue, Variant };
