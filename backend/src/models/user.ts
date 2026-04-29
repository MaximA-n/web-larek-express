import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    tokens: { token: string }[];
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        minlength: [2, 'Минимальная длина поля "name" - 2'],
        maxlength: [30, 'Максимальная длина поля "name" - 30'],
        default: 'Ё-мое',
    },
    email: {
        type: String,
        required: [true, 'Поле "email" обязательно'],
        unique: true,
    validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'Некорректный email',
  },
    },
    password: {
        type: String,
        required: [true, 'Поле "password" обязательно'],
        minlength: [6, 'Минимальная длина поля "password" - 6'],
        select: false,
    },
    tokens: {
        type: [{ token: String }],
        select: false,
        default: [],
    },
});

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        (this as IUser).password = await bcrypt.hash((this as IUser).password, 10);
    }
});

userSchema.methods.comparePassword = function comparePassword(
    password: string,
): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('user', userSchema);
