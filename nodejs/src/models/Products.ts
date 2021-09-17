import { Schema, model, connection } from "mongoose";
import autoIncrement from 'mongoose-auto-increment';

autoIncrement.initialize(connection);

type ProductType = {
    name: string;
    ident: number;
    img: string;
    price: number;
    sizes: [string];
    categ: string;
    description: string;
}

const schema = new Schema<ProductType>({
    name: { type: String, required: true },
    ident: {type: Number, required:true },
    img: { type: String },
    price: { type: Number, required: true },
    sizes: [String],
    categ: { type: String, required: true},
    description: { type: String }
});

schema.plugin(autoIncrement.plugin, {
    model: 'Products', field: 'ident',
    startAt: 1,
    incrementBy: 1
})

const modelProduct: string = 'Products';

export default (connection && connection.models[modelProduct]) ? connection.models[modelProduct] : model<ProductType>(modelProduct, schema);