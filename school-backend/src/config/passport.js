const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const User = require("../models/User");
const Student = require("../models/Student");

async function upsertOAuthUser({ provider, oauthId, email, name, avatar }) {
  const emailLower = (email || "").toLowerCase();

  let user = await User.findOne({ oauthProvider: provider, oauthId });

  if (!user && emailLower) {
    user = await User.findOne({ email: emailLower });
  }

  if (!user) {
    user = await User.create({
      email: emailLower || `${provider}_${oauthId}@no-email.local`,
      role: "STUDENT",
      oauthProvider: provider,
      oauthId,
      name: name || "",
      avatar: avatar || "",
      passwordHash: ""
    });
  } else {
    user.oauthProvider = user.oauthProvider || provider;
    user.oauthId = user.oauthId || oauthId;
    user.name = user.name || name || "";
    user.avatar = user.avatar || avatar || "";
    await user.save();
  }

  if (user.role === "STUDENT" && !user.studentId && emailLower) {
    const s = await Student.findOne({ email: emailLower });
    if (s) {
      user.studentId = s._id;
      await user.save();
    }
  }

  return user;
}

// ✅ Google
const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      const name = profile.displayName;
      const avatar = profile.photos?.[0]?.value;

      const user = await upsertOAuthUser({
        provider: "google",
        oauthId: profile.id,
        email,
        name,
        avatar
      });

      done(null, user);
    } catch (e) {
      done(e);
    }
  }
);

// ✅ FORCE toujours le sélecteur de compte (même si route oublie prompt)
googleStrategy.authorizationParams = () => ({
  prompt: "select_account"
});

passport.use(googleStrategy);

const axios = require("axios");

// ---------------- GitHub ----------------
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"]
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let email =
          profile.emails?.find((e) => e.verified)?.value ||
          profile.emails?.[0]?.value ||
          null;

        // ✅ fallback: fetch emails from GitHub API
        if (!email) {
          const { data } = await axios.get("https://api.github.com/user/emails", {
            headers: { Authorization: `token ${accessToken}`, "User-Agent": "school-app" }
          });

          // pick primary verified if possible
          const best =
            data.find((e) => e.primary && e.verified) ||
            data.find((e) => e.verified) ||
            data[0];

          email = best?.email || null;
        }

        const name = profile.displayName || profile.username;
        const avatar = profile.photos?.[0]?.value;

        const user = await upsertOAuthUser({
          provider: "github",
          oauthId: profile.id,
          email,
          name,
          avatar
        });

        done(null, user);
      } catch (e) {
        done(e);
      }
    }
  )
);

// ---------------- LinkedIn ----------------
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_CALLBACK_URL,
      scope: ["r_liteprofile", "r_emailaddress"],
      state: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || null;
        const name = profile.displayName;
        const avatar = profile.photos?.[0]?.value;

        const user = await upsertOAuthUser({
          provider: "linkedin",
          oauthId: profile.id,
          email,
          name,
          avatar
        });

        done(null, user);
      } catch (e) {
        done(e);
      }
    }
  )
);

// ---------------- Facebook ----------------
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "displayName", "photos", "email"]
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || null;
        const name = profile.displayName;
        const avatar = profile.photos?.[0]?.value;

        const user = await upsertOAuthUser({
          provider: "facebook",
          oauthId: profile.id,
          email,
          name,
          avatar
        });

        done(null, user);
      } catch (e) {
        done(e);
      }
    }
  )
);

module.exports = passport;
