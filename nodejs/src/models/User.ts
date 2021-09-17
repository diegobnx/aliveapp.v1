import { Schema, model, connection } from 'mongoose';

type UserType = {
    name: string,
    email: string,
    password: string
}

const schema = new Schema<UserType>({
    name: { type: String },
    email: { type: String, required: true},
    password: { type: String, required: true}
});

const modelUser: string = 'Users';

export default (connection && connection.models[modelUser]) ? connection.models[modelUser] : model<UserType>(modelUser, schema);