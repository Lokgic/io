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

function requiresAdmin(req, res, next){
	if (req.session.nickname == 'admin' && (req.session.userId == 3 || req.session.userId ==1) ){
		return next();

	}else{
		var err = new Error("GTFO");
		err.status = 401;
		return next(err);
	}
}

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;
module.exports.requiresAdmin = requiresAdmin;
