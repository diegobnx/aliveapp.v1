import { Model, DataTypes } from 'sequelize';
import { sequelize } from "../instances/mysql";

export interface AliveappInstance extends Model {
    id: number;
    name: string;
    img: string;
    price: number;
    sizes: string;
    categ: string;
    description: string;
}

export const Aliveapp = sequelize.define<AliveappInstance>('Aliveapp', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING
    },
    img: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.FLOAT
    },
    sizes: {
        type: DataTypes.STRING
    },
    categ: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'products',
    timestamps: false
});