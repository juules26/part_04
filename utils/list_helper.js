import Blog from '/models/blog.js'

const blogsInDb = async() => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}


export default { blogsInDb }