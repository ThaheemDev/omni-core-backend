const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const user = require('../models/user');
const db = require("../models");
const bcrypt = require('bcrypt');

module.exports =  (app) => {

	app.use(passport.initialize());
	app.use(passport.session());

	var strategy = new localStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},  async (email, password, done) => {
		let user = await db.user.findOne({ where: { email: email } })
		console.log('user', user)
		if (user && user.dataValues) {
			user = user.dataValues;
			const isSame = await bcrypt.compare(String(password), String(user.password))
			if (isSame) {
				done(null, user)
			} else {
				done(null, false, { message: 'Incorrect username or password' })
			}
		} else {
			done(null, false, { message: 'Incorrect username or password' })
		}
	})

	passport.use(strategy);

	passport.serializeUser((user, done) => {
		done(null, user)
	})
	passport.deserializeUser(async (user, done) => {
		try {
			done(null, user);
		} catch(e) {
			done(null, false);
		}
	})

}