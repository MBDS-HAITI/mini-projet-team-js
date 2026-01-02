const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },

    // ✅ passwordHash devient optionnel si OAuth
    passwordHash: {
      type: String,
      default: "",
      required: function () {
        return !this.oauthProvider;
      }
    },

    role: { type: String, enum: ["ADMIN", "SCOLARITE", "STUDENT"], required: true },

    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null },

    // ✅ champs OAuth
    oauthProvider: { type: String, enum: ["google", "github", "linkedin"], default: null },
    oauthId: { type: String, default: null },
    name: { type: String, default: "" },
    avatar: { type: String, default: "" }
  },
  { timestamps: true }
);

userSchema.index({ oauthProvider: 1, oauthId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("User", userSchema);
