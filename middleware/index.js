function loggedOut(req,res,next){
	if (req.session && req.session.userId){
		return res.redirect('/profile');
	}
	return next();
}

function requiresLogin(req, res, next){
	if (!req.session || ! req.session.userId){
		var err = new Error("You are not supposed to be here! Are you logged in?");
		err.status = 401;
		return next(err);
	}
	return next();
}

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;