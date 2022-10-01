module.exports = {
    verify: async(req, res, next) => {

        if (!req.body) { return res.status(401).json({ auth: false, message: 'no token provided.' }) }
        let token = JSON.stringify(req.body.auth)
        if (!token) { return res.status(401).json({ auth: false, message: 'no token provided.' }) }


        await jwt.verify('token', process.env.SECRET_KEY, (err, decoded, res) => {
            if (err) return res.status(500).json({ auth: false, message: 'invalid token.' })
            console.log(decoded.id)
            req.locals.id = decoded.id
            next();
        })

        //next():
    }
}