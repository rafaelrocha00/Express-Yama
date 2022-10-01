var express = require('express')
const Deck = require('../schemas/deck')
const User = require('../schemas/user')

var router = express.Router()

router.get('/month/total/:month', async(req, res) => {

    const month = req.params.month
    const user = res.locals.userID

    if (!user.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            status: 400,
            data: "User Id is not valid"
        })
    }

    try {
        const foundUser = await User.findById(user)
        const monthArry = foundUser.revisions.filter(x => x.date.getMonth() + 1 == month)
        console.log(monthArry)
        const days = new Array(new Date().getDate()).fill(0)

        for (let i = 0; i < days.length - 1; i++) {
            const dayInAnswer = monthArry.find(x => x.date.getDate() == i)
            if (dayInAnswer) {
                days[i + 1] = dayInAnswer.total
            }
        }

        return res.status(202).json({
            status: 202,
            ok: true,
            data: days
        })

    } catch (err) {
        const errArry = []
        if (err.name == 'ValidationError') {
            for (field in err.errors) {
                errArry.push({ error: err.errors[field].message })
            }
            return res.status(400).json(errArry)
        }

        return res.status(400).json(err)
    }
})

router.post('/', async(req, res) => {
    const revisions = req.body.revisions
    const day = req.body.day
    const month = req.body.month
    const year = req.body.year

    const user = res.locals.userID
    console.log(req.body)
    try {

        if (!user) {
            return res.status(400).json({
                status: 400,
                data: "Requires Authentification"
            })
        }

        if (!user.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                status: 400,
                data: "User Id is not valid"
            })
        }

        if (!revisions) {
            return res.status(400).json({
                status: 400,
                data: "Revision is required"
            })
        }
        const foundUser = await User.findById(user)
        revisions.forEach(revision => {
            const oldRevision = foundUser.revisions.find(x => {
                return x.date.getMonth() == month && x.date.getDate() == day && x.date.getFullYear() == year
            })
            if (oldRevision) {
                foundUser.revisions[foundUser.revisions.indexOf(oldRevision)].total += revision.total
                return;
            }

            foundUser.revisions.push({ date: new Date(year + '-' + month + '-' + day), total: revision.total })
        })

        foundUser.totalRevisions += 1
        foundUser.save()

        return res.status(202).json({
            status: 202,
            ok: true,
            data: foundUser.revisions
        })
    } catch (err) {
        return res.status(500).json(err)
    }
})


module.exports = router