import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import User from "./user.interface.js";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String
        },
        role: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

/** Хук перед сохранением. Если пароль не менялся то просто продолжаем сохранение
 * Иначе создаем хэш пароль и продолжаем сохранение
 */
UserSchema.pre<User>("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const password = await bcrypt.hash(this.password, 10);
    this.password = password;

    next();
});

UserSchema.methods.isValidPassword = async function (
    password: string
): Promise<Error | boolean> {
    return await bcrypt.compare(password, this.password);
};

export default model<User>("User", UserSchema);
