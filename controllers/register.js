const handleRegister = (req, res, db, bcrypt) => {
	const { name, email, password } = req.body;
	const hash = bcrypt.hashSync(password);

	if (!name || !email || !password) {
		return res.status(400).json('missing fields!');
	}

	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users') // what's the purpose of return here?
			.returning('*')
			.insert({
				name: name,
				email: loginEmail[0],
				joined: new Date()
			})
			.then(user => {
				res.json(user[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('unable to register! :('))
}

module.exports = {
	handleRegister
}