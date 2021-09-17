import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface UsersInterface extends Model {
    id: number,
    name: string,
    email: string,
    password: string
}

export const Users = sequelize.define<UsersInterface>('Users', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'users',
    timestamps: false
})