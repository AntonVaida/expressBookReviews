const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    // Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if the username already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists. Please choose another one." });
    }

    // Add new user to the users array
    users.push({ username, password });
    res.status(201).json({ message: "User registered successfully." });
});

public_users.get('/', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:5000/books'); // Replace with actual URL if necessary
      const booksList = response.data;
      return res.status(200).json(booksList);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books list", error: error.message });
    }
  });

  public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
  
    try {
      const response = await axios.get(`http://localhost:5000/books/${isbn}`); // Adjust URL if necessary
      const bookDetails = response.data;
      
      if (bookDetails) {
        return res.status(200).json(bookDetails);
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
  })
  
  public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
  
    try {
      const response = await axios.get(`http://localhost:5000/books?author=${author}`); // Adjust URL if needed
      const booksByAuthor = response.data;
  
      if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
      } else {
        return res.status(404).json({ message: "No books found by this author" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
  });

  public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
  
    try {
      const response = await axios.get(`http://localhost:5000/books?title=${title}`); // Adjust URL if needed
      const booksByTitle = response.data;
  
      if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
      } else {
        return res.status(404).json({ message: "No books found with this title" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books by title", error: error.message });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const booksList = books.filter(b => b.isbn === isbn)?.map(b => b?.reviews);
  
    if (booksList) {
      return res.status(200).send(JSON.stringify(booksList, null, 4));
    } else {
      return res.status(404).json({ message: "Book reviews not found" });
    }
});

module.exports.general = public_users;
