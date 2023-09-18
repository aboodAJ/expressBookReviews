const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const _ = require('lodash');
const axios = require('axios');




const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", async (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  await res.send(JSON.stringify(books,null,4))
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  await res.send(books[req.params.isbn])
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  

// Get book details based on author

const getBooksByAuthor= (auth)=>{
  const booksByAuthor =[]
  return new Promise((resolve,reject)=>{
    for(const i in books){
      if(books[i].author==auth){
          booksByAuthor.push(books[i])
      }
    }
    if(!_.isEmpty(booksByAuthor)){
      resolve("books by "+auth+": \n"+ JSON.stringify(booksByAuthor,null,4))
    }else{
      reject("no books by "+auth+" was found ):")
    }
  })   
}

public_users.get('/author/:author',function (req, res) {
  //Write your code here
  getBooksByAuthor(req.params.author)
    .then((result)=>{
      res.send(result)
    })
    .catch((error)=>{
      res.send(error)
    })

    

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
const getBooksByTitle= (title)=>{
  const booksByTitle =[]
  return new Promise((resolve,reject)=>{
    for(const i in books){
      if(books[i].title==title){
          booksByTitle.push(books[i])
      }
    }
    if(!_.isEmpty(booksByTitle)){
      resolve("books with "+title+": \n"+ JSON.stringify(booksByTitle,null,4))
    }else{
      reject("no books with this title \""+auth+"\" was found ):")
    }
  })   
}
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  getBooksByTitle(req.params.title)
    .then((result)=>{
      res.send(result)
    }).catch((error)=>{
      res.send(error)
    })
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
  //Write your code here
  await res.send(JSON.stringify(books[req.params.isbn].reviews,null,4))
});

module.exports.general = public_users;
