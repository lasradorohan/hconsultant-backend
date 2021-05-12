const express = require('express')
const chat = require('../controllers/chat')
const router = express.Router()
const isAuth = require('../middleware/isAuth')

router.use(isAuth)

router.get('/', chat.validate.getChats, chat.getChats)
router.get('/:email', chat.validate.getMessages, chat.getMessages)
router.post('/:email', chat.validate.post, chat.post)

module.exports = router