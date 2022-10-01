var express = require('express')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")

const User = require('../schemas/user')
const Deck = require('../schemas/deck')
const StandardDeck = require('../schemas/standardDeck')

var router = express.Router()

router.post('/login', async(req, res) => {
    try {
        const username = req.body.name
        const password = req.body.password

        if (!password || !username) {
            return res.status(400).json({
                status: 400,
                message: "Os campos foram preenchidos incorretamente."
            })
        }
        let user = await User.findOne({ username: username })

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "Usuario não foi encontrado."
            })
        }

        const correctPassword = await bcrypt.compare(password, user.password)
        if (!correctPassword) {
            return res.status(400).json({
                status: 400,
                message: "Senha Invalida."
            })
        }

        const id = user._id

        const token = jwt.sign({ id }, process.env.SECRET_KEY, {
            expiresIn: 30000
        })

        return res.status(200).json({
            status: 200,
            auth: true,
            token: token,
            userId: id,
            ok: true,
            message: "Usuario Logado."
        })
    } catch (err) {
        console.log(err)
    }
})

router.post('/logout', (req, res) => {
    return res.status(200).json({
        status: 200,
        auth: false,
        token: null
    })
})

// router.post('/register', async(req, res) => {
//     try {
//         const username = req.body.name
//         const password = req.body.password

//         if (!password || !username) {
//             return res.status(400).json({
//                 status: 400,
//                 message: "Os campos foram preenchidos incorretamente."
//             })
//         }

//         const oldUser = await User.findOne({ username: username });

//         if (oldUser) {
//             return res.status(400).json({
//                 status: 400,
//                 message: "Usuario com esse nome já existe."
//             })
//         }

//         const hash = await bcrypt.hash(password, 10)
//         let newUser = new User({ username: username, password: hash })

//         standardDecks = await StandardDeck.find({})
//         standardDecks.forEach(stdDeck => {
//             const deck = new Deck({ 'user': newUser._id, 'name': stdDeck.name, 'cards': stdDeck.cards })
//             deck.save()
//         })

//         await newUser.save()

//         const id = newUser._id

//         const token = jwt.sign({ id }, process.env.SECRET_KEY, {
//             expiresIn: 30000
//         })

//         return res.status(202).json({
//             status: 202,
//             auth: true,
//             token: token,
//             userId: id,
//             message: "Usuario Criado.",
//             ok: true
//         })
//     } catch (err) {
//         console.log(err)
//     }
// })

// router.delete('/all', async(req, res) => {
//     try {
//         await Deck.remove()
//         await User.remove()
//         return res.status(200).json({
//             status: 200,
//             ok: true,
//             data: 'deleted'
//         })

//     } catch (err) {
//         console.log(err)
//     }
// })

module.exports = router