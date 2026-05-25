import mongoose from "mongoose";
// ❌ Remove the Comment import line — it doesn't belong here

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,  // capital O
            ref: "Blog"
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,  // capital O
            ref: 'User'
        },
        likes: {
            type: Array,
            default: []
        },
        numberOfLikes: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
)

const Comment = mongoose.model("Comment", commentSchema)
export default Comment