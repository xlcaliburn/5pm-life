import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';

export function setup(User, config) {
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    //callbackURL: config.facebook.callbackURL,
    profileFields: [
      'first_name',
      'last_name',
      'birthday',
      'email',
      'gender'
    ]
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({'facebook.id': profile.id}).exec()
      .then(user => {
        if (user) {
            done(null, user);
            return null;
        }

        user = new User({
          first_name: profile._json.first_name,
          last_name: profile._json.last_name,
          birthday: profile._json.birthday,
          email: profile._json.email,
          gender: profile._json.gender,
          role: 'user',
          provider: 'facebook',
          verified: false,
          profile_picture: {
              current: 'https://graph.facebook.com/' + profile.id + '/picture?width=250&height=250'
          },
          account_create_date: new Date(),
          facebook: profile._json
        });
        user.save()
          .then(user => done(null, user))
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }));
}
