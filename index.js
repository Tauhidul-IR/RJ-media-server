const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 4000;


require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wh7nz7n.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })

async function run() {
    try {
        const allPostCollection = client.db('RJ-media').collection('allPost');
        const allUsersCollection = client.db('RJ-media').collection('users');

        app.get('/allPosts', async (req, res) => {
            const query = {}
            const options = await allPostCollection.find(query).toArray()
            res.send(options);
        })

        app.get('/topPost', async (req, res) => {
            const query = {}
            const result = await allPostCollection.find(query).toArray()
            res.send(result);
        })

        app.post('/addPost', async (req, res) => {
            const post = req.body
            const result = await allPostCollection.insertOne(post)
            res.send(result)
        })

        app.put('/allPosts/:id', async (req, res) => {
            const id = req.params.id;
            const unique = { _id: ObjectId(id) };
            const oldPost = req.body;
            console.log(oldPost);
            const option = { upsert: true };
            const updatelove = {
                $set: {
                    post: oldPost.post,
                    title: oldPost.title,
                    email: oldPost.email,
                    img: oldPost.img,
                    love: oldPost.love

                }
            }
            const result = await allPostCollection.updateOne(unique, updatelove, option);
            res.send(result);
        })


        app.put('/posts/:id', async (req, res) => {
            const id = req.params.id;
            const unique = { _id: ObjectId(id) };
            const oldPost = req.body;
            console.log(oldPost);
            const option = { upsert: true };
            const updatelove = {
                $set: {
                    post: oldPost.post,
                    title: oldPost.title,
                    email: oldPost.email,
                    img: oldPost.img,
                    love: oldPost.love,
                    comments: oldPost.comments

                }
            }
            const result = await allPostCollection.updateOne(unique, updatelove, option);
            res.send(result);
        })

        //User information -----------
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await allUsersCollection.insertOne(user)
            res.send(result);

        })

        app.get('/user', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const user = await allUsersCollection.findOne(query)
            res.send(user)
        })

        app.delete('/post/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await allPostCollection.deleteOne(filter);
            res.send(result);
        })

        app.get('/posts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const post = await allPostCollection.findOne(query)
            res.send(post)
        })

        app.get('/posts', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const result = await allPostCollection.find(query).toArray();
            res.send(result);
        })







    }
    finally {

    }

}
run().catch(error => console.log(error))




app.get('/', async (req, res) => {
    res.send('RJ-media book server is running')
})
app.listen(port, () => {
    console.log(`Rj-media book server running on port ${port}`);
})