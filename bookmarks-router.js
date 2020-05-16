const express = require('express')
const bookmarksRouter = express.Router()
const bodyParser = express.json()
const logger = require('./logger')
const bookmarksService = require('./bookmarks-service')


bookmarksRouter
    .route('/bookmarks')
    .get((req, res) => {
        const db = req.app.get('db')
        const bookmarks = bookmarksService.getAllBookmarks(db)
        res.json(bookmarks);
    })
    .post(bodyParser, (req, res) => {
        const db = req.app.get('db')
        const { url } = req.body;

        if (!url) {
            logger.error(`url is required`);
            return res
                .status(400)
                .send('Invalid data');
        }
        const bookmark = {
            id: bookmarks.length,
            title: req.body.title,
            url: req.body.url,
            rating: req.body.rating,
            desc: req.body.desc,
        }

        bookmarksService.insertBookmark(db, bookmark)
            .then(() => {
                res
                    .status(201)
                    .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
                    .json({ id: bookmark.id })
            })


    })

bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
        const db = req.app.get('db')

        bookmarksService.getById(db, req.params.id)
            .then((bookmark) => {
                if (!bookmark) {
                    return res
                        .status(404)
                        .send('Bookmark Not Found');
                }
                res.json(bookmark)
            })


    })
    .delete((req, res) => {
        const { id } = req.params;
        const db = req.app.get('db')

        bookmarksService.deleteBookmark(db, id)


        if (bookmarkIndex === -1) {
            logger.error(`Bookmark with id ${id} not found.`);
            return res
                .status(404)
                .send('Not Found');
        }

        bookmarks.splice(bookmarkIndex, 1);

        logger.info(`bookmarks with id ${id} deleted.`);
        res
            .status(204)
            .end();
    })


module.exports = bookmarksRouter