
const userRoutes = (app, fs) => {

    const { check, validationResult } = require('express-validator');
    // variables
    const dataPath = './data/books.json';

    // helper methods
    const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    // READ
    app.get('/books', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    // CREATE
    app.post('/books', [
        check('title').notEmpty(),
        check('category').notEmpty(),
        check('description').notEmpty(),
        check('id').notEmpty()
    ], (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

        readFile(data => {
            const newBooksId = Object.keys(data).length + 1;
            
            data[newBooksId.toString()] = req.body;
            res.setHeader('Content-Type', 'application/json');
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('new book added');
            });
            return res.json({
                "code": 200,
                "message" : "success"
            });
        },
            true);
    });


    // UPDATE
    app.put('/books/:id', (req, res) => {

        readFile(data => {

            // add the new book
           
            
            const bookId = req.params["id"];
            data[bookId] = req.body;

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`books id:${bookId} updated`);
            });
        },
            true);
    });


    // DELETE
    app.delete('/books/:id', (req, res) => {

        readFile(data => {

            // add the new book
            const bookId = req.query.id;
            delete data[bookId];
            
            res.setHeader('Content-Type', 'application/json');
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`book id:${bookId} removed`);
            });
            return res.json({
                "code": 200,
                "message": "success"
            });
        },
            true);
        return res.json({
            "code": 500,
            "message": "fail"
        });
    });
};

module.exports = userRoutes;