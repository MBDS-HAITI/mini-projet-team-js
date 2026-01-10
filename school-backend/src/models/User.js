const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },

    passwordHash: {
      type: String,
      default: "",
      required: function () {
        return !this.oauthProvider;
      }
    },

    role: { type: String, enum: ["ADMIN", "SCOLARITE", "STUDENT"], required: true },

    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null },

    oauthProvider: { type: String, enum: ["google", "github", "linkedin", "facebook"], default: null },
    oauthId: { type: String, default: null },
    name: { type: String, default: "" },
    avatar: { type: String, default: "" },
    blocked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// ✅ Unique seulement quand oauthProvider/oauthId sont des strings (donc pas null)
userSchema.index(
  { oauthProvider: 1, oauthId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      oauthProvider: { $type: "string" },
      oauthId: { $type: "string" }
    }
  }
);

module.exports = mongoose.model("User", userSchema);
