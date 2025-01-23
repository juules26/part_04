import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user";
import Blog from "./models/blog";

// Cargar variables de entorno desde .env
dotenv.config();

// Usar la variable de entorno para la URI de MongoDB
const url = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;

// Comprobar si la URI de MongoDB está definida
if (!url) {
    console.error('MONGODB_URI o TEST_MONGODB_URI no está definida en .env');
    process.exit(1); // Salir si no está definida
}

// Conectar a MongoDB
mongoose.connect(url)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => {
        console.error('Error conectando a MongoDB', err.message);
        process.exit(1);
    });

// Definir esquema de Blog
const blogSchema = new mongoose.Schema({
    title: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    url: String,
    likes: Number
});

const Blog = mongoose.model('Blog', blogSchema);

const blogs = [
    {
        title: "React patterns",
        author: "", // Nombre del autor (se buscará en la base de datos)
        url: "https://reactpatterns.com/",
        likes: 7
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "michaelchan", // Nombre del autor (se buscará en la base de datos)
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5
    },
    {
        title: "Canonical string reduction",
        author: "michaelchan", // Nombre del autor (se buscará en la base de datos)
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12
    },
    {
        title: "First class tests",
        author: "jules", // Nombre del autor (se buscará en la base de datos)
        url: "http://blog.cleancoder.com/",
        likes: 10
    },
];

// Lista de usuarios a insertar (solo se insertarán si no existen)
const users = [
    { username: 'jules', name: 'Juan Pérez', passwordHash: 'someHash' },
    { username: 'michaelchan', name: 'Michael Chan', passwordHash: 'someHash' },
];

// Función para insertar usuarios si no existen
const insertUsers = async () => {
    try {
        for (let user of users) {
            const existingUser = await User.findOne({ username: user.username });
            if (!existingUser) {
                await User.create(user);
                console.log(`Usuario ${user.username} insertado.`);
            } else {
                console.log(`Usuario ${user.username} ya existe.`);
            }
        }
        console.log('Usuarios insertados o ya existentes.');
    } catch (error) {
        console.error('Error insertando usuarios:', error.message);
    }
};

// Función para insertar blogs y asignarles los autores correctos
const insertBlogs = async () => {
    try {
        for (let blog of blogs) {
            const user = await User.findOne({ username: blog.author });
            if (user) {
                blog.author = user._id;  // Actualiza el autor a su ObjectId
                await Blog.create(blog);  // Inserta el blog en la base de datos
                console.log(`Blog "${blog.title}" por ${user.username} insertado correctamente.`);
            } else {
                console.log(`Usuario no encontrado para el blog: ${blog.title}`);
            }
        }
        console.log('Blogs insertados correctamente.');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error insertando blogs:', error.message);
        mongoose.connection.close();
    }
};

// Ejecutar las funciones para insertar usuarios y blogs
const run = async () => {
    await insertUsers();  // Insertar usuarios
    await insertBlogs();  // Insertar blogs
};

// Iniciar el proceso
run();
