const handleSignin = (req, res, db, bcrypt) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json('Incorrect Form Submission');
    }
    
    db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
        if (data.length === 0) {
            return res.status(400).json('Invalid email');
        }

        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid) {
            return db.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
                res.json(user[0])
            }) 
            .catch(err => res.status(400).json('Unable to get user'));
        } else {
            res.status(400).json('Wrong credentials');
        }
    })
    .catch(err => res.status(400).json('Wrong Credentials'));
}

module.exports = {
    handleSignin: handleSignin
}