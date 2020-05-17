const express = require('express')
const bookmarksRouter = express.Router()
const bodyParser = express.json()
const logger = require('./logger')
const bookmarksService = require('./bookmarks-service')


bookmarksRouter
    .route('/bookmarks')
    .get(async (req, res) => {
        const db = req.app.get('db')
        const bookmarks = await bookmarksService.getAllBookmarks(db)
        res.json(bookmarks);
    })
    .post(bodyParser, async (req, res) => {
        const db = req.app.get('db')
        const { url } = req.body;

        if (!url) {
            logger.error(`url is required`);
            return res
                .status(400)
                .send('Invalid data');
        }
        const bookmark = {
            title: req.body.title,
            url: req.body.url,
            rating: req.body.rating,
            description: req.body.description,
        }

        const newBookmark = await bookmarksService.insertBookmark(db, bookmark)
        res
            .status(201)
            .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
            .json(newBookmark)
    })

bookmarksRouter
    .route('/bookmarks/:id')
    .get(async (req, res) => {
        const db = req.app.get('db')

        const bookmark = await bookmarksService.getById(db, req.params.id)

        if (!bookmark) {
            return res
                .status(404)
                .send('Bookmark Not Found');
        }
        res.json(bookmark)
    })
    .delete(async (req, res) => {
        const { id } = req.params;
        const db = req.app.get('db')

        await bookmarksService.deleteBookmark(db, id)

        logger.info(`bookmarks with id ${id} deleted.`);
        res
            .status(204)
            .end();
    })


module.exports = bookmarksRouter