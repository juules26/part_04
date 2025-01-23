import mongoose from "mongoose"
import listHelper from "../utils/list_helper.js"
import { test, expect, afterAll, beforeEach, describe } from "vitest"
import Blog from "../models/blog.js"
import supertest from "supertest"
import app from "./app.js"
import User from "../models/user.js"
import bcrypt from 'bcryptjs'

const api = supertest(app)

const initialBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
  ]

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
    await User.deleteMany({})
})

test('there are a few blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
})

test('test using supertest', async() => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    const blogsAtEnd = response.body
    expect(blogsAtEnd).toHaveLength(6)
})

test('the unique identifier is called id, not _id', async() => {
    const response = await api
    .get('/api/blogs')
    .expect(200)
    response.body.forEach((blog) => {
        expect(blog.id).toBeDefined()
        expect(blog._id).toBeUndefined()
    })
})

test('test that creates a new blog', async() => {
    const user = await User.create({
        username: "Jules",
        name: "Jules",
        passwordHash: await bcrypt.hash("password123", 10)
    });
    const newBlog = {
        title: "New blog hello there",
        author: user.username,
        url: "https://ok.com/",
        likes: 666,
        __v: 0
    }
    const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    // Verify the new blog's content
    expect(response.body.title).toBe(newBlog.title)
    expect(response.body.author).toBe(user._id.toString())
    expect(response.body.url).toBe(newBlog.url)
    expect(response.body.likes).toBe(newBlog.likes)

    const blogsAtEnd = await listHelper.blogsInDb()
    expect(blogsAtEnd.length).toBe(initialBlogs.length + 1)
})

test('crear nuevo blog sin likes', async() => {
    const user = new User({
        username: 'Jules',
        passwordHash: await bcrypt.hash('password123', 10) // Asegúrate de hashear la contraseña
    })
    await user.save()
    const newBlog = {
        title: "New blog no likes",
        author: "Jules",
        url: "https://ok.com/",
        likes: 0
    }
    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    console.log(response.body)
    expect(response.body.likes).toBe(0)
})

test('no title o url devuelve 400', async() => {
    const newBlog = {
        author: "Jules",
        likes: 666
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe('Title, URL or Author missing')
})

describe('deletion functionality of blogs', async() => {
    test('deletes blog successfully', async() => {
        const blogsAtStart = await api.get('/api/blogs')
        const blogToDelete = blogsAtStart.body[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204) //no content
        
            const blogAtEnd = await api.get('/api/blogs')
            expect(blogAtEnd.body).toHaveLength(blogsAtStart.body.length - 1)
    })

    test('blog to delete doesnt exist', async() => {
        const nonExistingId = '5a422a851b54a676234d17ff' //funct to generate a non existing id

        await api
            .delete(`/api/blogs/${nonExistingId}`)
            .expect(404) //not found
    })

    test('invalid id', async() => {
        const invalidId = 'invalidid31414'

        await api
            .delete(`/api/blogs/${invalidId}`)
            .expect(400) //bad request
    })
})

test('updates likes for a blog post', async() => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const updatedData = { likes: blogToUpdate.likes + 10 }

    const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body.likes).toBe(updatedData.likes)

    const blogsAtEnd = await api.get('/api/blogs')
    const updatedBlog = blogsAtEnd.body.find((b) => b.id === blogToUpdate.id)

    expect(updatedBlog.likes).toBe(updatedData.likes)
})

test('returns 404 if blog to update doesnt exist', async() => {
    const invalidId = '5a422a851b54a676234d17ff'
    const updatedData = { likes: 10 }

    await api
        .put(`/api/blogs/${invalidId}`)
        .send(updatedData)
        .expect(404)
})

test('returns 400 if vslue is missing', async() => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({})
        .expect(400)
})
describe('POST /api/users', () => {
    test('should return error if username or password is too short', async() => {
        const newUser = { username: 'ab', name: 'test User', password: '12' }
        const result = await api.post('/api/users').send(newUser).expect(400)
        expect(result.body.error).toBe('Username and password must be at least 3 characters long')
    })
    test('should return error if username already exists', async() => {
        const initialUser = { username: 'existinguser', name: 'test User', password: '123456'}
        await api.post('/api/users').send(initialUser).expect(201)

        const newUser = { username: 'existinguser', name: 'another user', password: '42545425'}
        const result = await api.post('/api/users').send(newUser).expect(400)
        expect(result.body.error).toBe('Username already exists')
    })
})


afterAll(async () => {
    await mongoose.connection.close()
    console.log('MongoDB connection closed after tests')
})