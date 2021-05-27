const { sign } = require('jsonwebtoken');
const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport');
const passportJwt = require('passport-jwt');

function authJwt(email) {
  return sign({ user: { email } }, `SECRET`);
}

passport.use(
  new GitHubStrategy(
    {
      clientID: `GITHUB_CLIENT_ID`,
      clientSecret: `GITHUB_CLIENT_SECRET`,
      // callbackURL: `${BASE_URL}${ENDPOINT}/auth/github/callback`,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        //* can include other required attributes
        const email = profile.emails[0].value;

        // Here you'd typically create a new or load an existing user and
        // store the bare necessary informations about the user in the JWT.
        const jwt = authJwt(email);

        return done(null, { email, jwt });
      } catch (error) {
        return done(error);
      }
    }
  )
);

// ? this can act as a common strategy for authtication using jwt
passport.use(
  new passportJwt.Strategy(
    {
      jwtFromRequest(req) {
        if (!req.cookies) throw new Error('Missing cookie-parser middleware');
        return req.cookies.jwt;
      },
      secretOrKey: `SECRET`,
    },
    async ({ user: { email } }, done) => {
      try {
        // Here you'd typically load an existing user
        // and use the data to create the JWT.
        const jwt = authJwt(email);

        return done(null, { email, jwt });
      } catch (error) {
        return done(error);
      }
    }
  )
);
