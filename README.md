# part_04 (working npm project)
#   4.1
1. Initialize my project:
- nmp init -y

2. Install dependencies:
- npm install express mongoose cors
- npm install --save-dev nodemon

3. Configure nodemon:
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
    - this allows npm run dev (nodemon) for development or npm start for production

4. Create index.js file

5. Set up MongoDB connection
- create new databsae and collection
- connect application
- copy URI + add to index.js

- .env add MONGOURI:'mongodb+srv://juules26:<password>@cluster0.cvvzf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

6. npm install dotenv

7. Modify index.js to load env variables
dotenv.config();
const mongoUrl = process.env.MONGODB_URI;

8. model/blog.js and add schema

#   4.2 (Refactor)

1. New structure for my project:

part_04/
|-- controllers/
|   |-- blogs.js
|-- models/
|   |-- blog.js
|-- node_modules --- x
|-- utils/
|   |-- config.js
|   |-- logger.js
|   |-- middleware.js
|-- .env --- x
|-- .gitignore
|-- app.js
|-- index.js
|-- package-lock.json
|-- package.json
|-- README.md

2. model/blog.js
(the Schema)

3. Router in controllers/blogs.js
(get, post routes)

4. app.js to handle Middlewares and Routes
(all the imports, connect mongoose, app.use)

5. index.js to start server
(import app, config, logger + PORT)

6. set up utils/congif.js
(PORT + MONGO_URI)

7. utils/logger.js for Logging
