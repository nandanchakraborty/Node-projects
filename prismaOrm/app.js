require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// ===================== USER CRUD OPERATIONS =====================

// CREATE - Add a new user
app.post('/users', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    const user = await prisma.user.create({
      data: { email, name }
    });
    
    res.status(201).json({ success: true, message: 'User created', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { posts: true }
    });
    
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get a single user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { posts: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Update a user
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name } = req.body;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { 
        ...(email && { email }),
        ...(name && { name })
      }
    });

    res.json({ success: true, message: 'User updated', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete a user
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: 'User deleted', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===================== POST CRUD OPERATIONS =====================

// CREATE - Add a new post
app.post('/posts', async (req, res) => {
  try {
    const { title, content, authorId, published } = req.body;

    if (!title || !content || !authorId) {
      return res.status(400).json({ error: 'Title, content, and authorId are required' });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: published || false,
        author: { connect: { id: parseInt(authorId) } }
      },
      include: { author: true }
    });

    res.status(201).json({ success: true, message: 'Post created', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get all posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: true }
    });

    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get a single post by ID
app.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: { author: true }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Update a post
app.put('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, published } = req.body;

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(published !== undefined && { published })
      },
      include: { author: true }
    });

    res.json({ success: true, message: 'Post updated', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete a post
app.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: 'Post deleted', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===================== HEALTH CHECK =====================

app.get('/', (req, res) => {
  res.json({ message: 'Server is running! Use  /users or  /posts endpoints' });
});

// ===================== START SERVER =====================

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API Endpoints:`);
  console.log(`   Users: GET/POST  /users, GET/PUT/DELETE  /users/:id`);
  console.log(`   Posts: GET/POST  /posts, GET/PUT/DELETE  /posts/:id`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
