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
	},  async (email, password, next) => {
		const user = await db.user.findOne({ where: { email: email } })
		if (user && user.password) {
			const isSame = await bcrypt.compare(String(password), String(user.password))
			if (isSame) {
				next(null, user)
			} else {
				next(null, false, { message: 'Incorrect username or password' })
			}
		} else {
			next(null, false, { message: 'Incorrect username or password' })
		}
	})

	passport.use(strategy);

	passport.serializeUser((user, next) => {
		next(null, user)
	})
	passport.deserializeUser(async (user, next) => {
		try {
			next(null, user);
		} catch(e) {
			next(null, false);
		}
	})

}