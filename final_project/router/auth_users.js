const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review= req.query.review
  const user= req.session.authorization['username']
  const reviewObj ={
    user: user,
    text: review
  }
  const book= books[req.params.isbn]

  for(const i in book.reviews){
    if(book.reviews[i].user===user){
      book.reviews[i].text= review
      return res.send("review updated")
    }
  }
  book.reviews.push(reviewObj)
  res.send("review posted")

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user= req.session.authorization['username']
  const book= books[req.params.isbn]

  for(const i in book.reviews){
    if(book.reviews[i].user===user){
      book.reviews.splice(i,1)
      //book.reviews= book.reviews.filter((review)=>review.user!==book.reviews[i].user)
      return res.send("review deleted")
    }
  }
  res.send("no review found by "+user)

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
