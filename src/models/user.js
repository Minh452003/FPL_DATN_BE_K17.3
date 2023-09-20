import { format } from "date-fns";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    avatar: {
        type: Object
    },
    role: {
        type: String,
        default: "member",
    },
    googleId: {
        type: String,
        default: null,
    },
    authType: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        default: 'local'
    },
    role: {
        type: String,
        default: "member",
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: String
    },
    passwordChangeAt: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
userSchema.virtual("formattedCreatedAt").get(function () {
    return format(this.createdAt, "HH:mm a dd/MM/yyyy");
});
export default mongoose.model("User", userSchema);