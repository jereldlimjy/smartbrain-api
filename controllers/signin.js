const handleSignin = (req, res, db, bcrypt) => {
	const { email, password } = req.body;

	db('login')
	.select('*')
	.where({
		email: email
	})
	.then(data => {
		const isValid = bcrypt.compareSync(password, data[0].hash);
		if (isValid) {
			return db('users')
			.select('*')
			.where({
				email: email
			})
			.then(user => {
				res.json(user[0])
			})
			.catch(err => res.status(400).json('unable to log in!'))
		} else {
			res.json('unable to log in!');
		}
	})
	.catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
	handleSignin
}