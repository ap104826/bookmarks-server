const express = require('express')
const bookmarksRouter = express.Router()
const bodyParser = express.json()
const logger = require('./logger')

const bookmarks = [
    {
        id: 0,
        title: 'Google',
        url: 'http://www.google.com',
        rating: '3',
        desc: 'Internet-related services and products.'
    },
    {
        id: 1,
        title: 'Thinkful',
        url: 'http://www.thinkful.com',
        rating: '5',
        desc: '1-on-1 learning to accelerate your way to a new high-growth tech career!'
    },
    {
        id: 2,
        title: 'Github',
        url: 'http://www.github.com',
        rating: '4',
        desc: 'brings together the world\'s largest community of developers.'
    }
];

bookmarksRouter
    .route('/bookmarks')
    .get((req, res) => {
        res.json(bookmarks);
    })
    .post(bodyParser, (req, res) => {
        const {url} = req.body;

        if (!url) {
            logger.error(`url is required`);
            return res
                .status(400)
                .send('Invalid data');
        }
        const bookmark= {
            id : bookmarks.length,
            title: req.body.title,
            url : req.body.url,
            rating: req.body.rating,
            desc: req.body.desc,
        }

        bookmarks.push(bookmark);

        res
        .status(201)
        .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
        .json({id: bookmark.id})
    })

bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
        const bookmark = bookmarks.find(b => b.id ===  parseInt(req.params.id))
        if(!bookmark){
            return res
            .status(404)
            .send('Bookmark Not Found');
        }
        res.json(bookmark)

    })
    .delete((req,res) => {
        const { id } = req.params;

        const bookmarkIndex = bookmarks.findIndex(li => li.id == id);

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