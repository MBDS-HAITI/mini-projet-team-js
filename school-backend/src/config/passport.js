const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;

const User = require("../models/User");
const Student = require("../models/Student");

async function upsertOAuthUser({ provider, oauthId, email, name, avatar }) {
  const emailLower = (email || "").toLowerCase();

  // 1) si user existe par oauthProvider+oauthId
  let user = await User.findOne({ oauthProvider: provider, oauthId });

  // 2) sinon si user existe par email → on lie le provider
  if (!user && emailLower) {
    user = await User.findOne({ email: emailLower });
  }

  if (!user) {
    // ✅ par défaut : STUDENT
    user = await User.create({
      email: emailLower || `${provider}_${oauthId}@no-email.local`,
      role: "STUDENT",
      oauthProvider: provider,
      oauthId,
      name: name || "",
      avatar: avatar || "",
      passwordHash: "" // OAuth
    });
  } else {
    // update lien OAuth si manquant
    user.oauthProvider = user.oauthProvider || provider;
    user.oauthId = user.oauthId || oauthId;
    user.name = user.name || name || "";
    user.avatar = user.avatar || avatar || "";
    await user.save();
  }

  // ✅ si c'est un STUDENT et studentId absent, tente de lier via email
  if (user.role === "STUDENT" && !user.studentId && emailLower) {
    const s = await Student.findOne({ email: emailLower });
    if (s) {
      user.studentId = s._id;
      await user.save();
    }
  }

  return user;
}

// ---- Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/oauth/google/callback`
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
  )
);

// ---- GitHub
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/oauth/github/callback`,
      scope: ["user:email"]
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // GitHub ne donne pas toujours l'email => on prend le premier disponible
        const email =
          profile.emails?.find((e) => e.verified)?.value ||
          profile.emails?.[0]?.value ||
          null;

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

// ---- LinkedIn
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/oauth/linkedin/callback`,
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

module.exports = passport;
