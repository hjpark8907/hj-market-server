const express = require('express');
const cors = require('cors');
const app = express();
const models = require('./models');
const multer = require('multer');
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    })
});

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get('/banners', (req, res) => { // 배너를 주는 API
    models.Banner.findAll({
        limit: 3
    }).then((result) => {
        res.send({
            banners: result,
        });
    }).catch((error) => {
        console.error(error);
        res.status(500).send('error happens!');
    })
})
app.get("/products", (req, res) => {
    models.Product.findAll(
        {
            limit: 10,
            order: [
                ['createdAt', 'DESC'],
            ],
            attributes: [
                'id',
                'name',
                'price',
                'createdAt',
                'seller',
                'imageUrl',
                'soldout',
            ] // 보여줄것만 선택적으로 보여줌
        }
    ).then((result) => {
        console.log("PRODUCTS : ", result);
        res.send({
            products: result
        })
    }).catch((error) => {
        console.error(error);
        res.status(400).send("errer happens!");
    })
});

app.post("/products", (req, res) => {
    const body = req.body;
    const { name, description, price, seller, imageUrl } = body;
    if (!name || !description || !price || !seller || !imageUrl) {
        res.status(400).send("All field should be write!!")
    }
    models.Product.create({
        name,
        description,
        price,
        seller,
        imageUrl,
    }).then((result) => {
        console.log("Product Creation result : ", result);
        res.send({
            result,
        });
    }).catch((error) => {
        console.error(error);
        res.status(400).send("Problems happen when products is uploading!")
    })
})

app.get("/products/:id", (req, res) => {
    const params = req.params;
    const { id, eventid } = params;
    models.Product.findOne({
        where: {
            id: id
        }
    }).then((result) => {
        console.log("PRODUCT : ", result);
        res.send({
            product: result,
        });
    }).catch((error) => {
        console.error(error);
        res.status(400).send("find products error!");
    })
})

app.post('/image', upload.single('image'), (req, res) => {
    const file = req.file;
    console.log(file);
    res.send({
        imageUrl: file.path,
    })
})

app.post("/purchase/:id", (req, res) => {
    const { id } = req.params;
    models.Product.update(
        {
            soldout: 1
        },
        {
            where: {
                id
            }
        }
    ).then((result) => {
        res.send({
            result: true
        })
    }).catch((error) => {
        console.error(error);
        res.status(500).send("error happens!");
    })
});


app.listen(port, () => {
    console.log("Hj showpping mall server is acting.");
    models.sequelize.sync().then(() => {
        console.log('DB connection success!');
    }).catch((error) => {
        console.error(error);
        console.log("DB connection error!");
        process.exit();
    })
})