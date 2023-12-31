const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Please provide a title"],
			trim: true,
			minlength: [1, "Title must be between 1 and 100 characters"],
			maxlength: [100, "Title must be between 1 and 100 characters"],
		},
		author: {
			type: String,
			required: [true, "Please provide an author name"],
			trim: true,
			minlength: [1, "Author name must be between 1 and 100 characters"],
			maxlength: [100, "Author name must be between 1 and 100 characters"],
		},
		description: {
			type: String,
			trim: true,
			//maxlength: [500, "Description must not exceed 500 characters"],
		},
		imageUrl: {
			type: String,
			trim: true,
			// Add regex to validate URL if needed
		},
		googleBooksId: String,
		status: {
			type: String,
			enum: ["available", "checked-out", "unavailable"],
			default: "available",
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // Reference to the User model
			required: true,
		},
		requestedBy: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				username: {
					type: String,
					required: true,
				},
				// TODO add user rating
			},
		],
		currentBorrower: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // Reference to the User model
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Book", BookSchema);
