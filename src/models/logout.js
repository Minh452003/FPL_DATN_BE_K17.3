import { format } from "date-fns";
import mongoose from "mongoose";

const logoutSchema = new mongoose.Schema({
    
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
      }
});
logoutSchema.virtual("formattedCreatedAt").get(function () {
    return format(this.createdAt, "HH:mm a dd/MM/yyyy");
  });
export default mongoose.model("Logout", logoutSchema);