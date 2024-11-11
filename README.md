# part_04
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
(password: sX8zezc7kFjf)
- .env add MONGOURI:'mongodb+srv://juules26:sX8zezc7kFjf@cluster0.cvvzf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

6. npm install dotenv

7. Modify index.js to load env variables
dotenv.config();
const mongoUrl = process.env.MONGODB_URI;

8. model/blog.js and add schema