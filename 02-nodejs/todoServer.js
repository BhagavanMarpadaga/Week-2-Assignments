/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */
  const express = require('express');
  const bodyParser = require('body-parser');
  
  const app = express();
  const { uuid } = require('uuidv4');
  
  app.use(bodyParser.json());
  
  let todos=[]
  
  function createTodo(req,res){
  
    const id=uuid()
    let body=req.body
    body={...body,id:id}
    todos.push(body)
  
    // console.log("body is ",body)
    res.status(201).send({id:id})
  
  }
  function getAllTodos(req,res){
  
    return res.status(200).send(todos)
  
  }
  function updateTodo(req,res){
  
    // console.log(req.params)
    if(!req.params.id){
      return res.status(400).send("Invalid request id is required")
    }
    const index=todos.findIndex((todo)=> todo.id=req.params.id)
    // console.log("todo to update ",index)
  
    if(index!=0&&(!index|| index <0)){
      return res.status(404).send("No todo found with the mathcing id")
      
    }
    todos[index]={...todos[index],...req.body,id:req.params.id}
  
    // console.log("updated todos are ",todos)
    return res.status(200).send("updated successfully")
    
  
  }
  
  function getTodo(req,res){
    const index=todos.findIndex(todo=>todo.id===req.params.id)
    if(index!=0&&(!index|| index <0)){
      return res.status(404).send("No todo found with the matching id")
    }
    else{
      return res.status(200).send(todos[index])
    }
  }
  function deleteTodo(req,res){
    const index=todos.findIndex((todo)=>todo.id===req.params.id)
    // console.log("index is ",index)
    if(index!=0 && (!index|| index <0)){
      return res.status(404).send("Not Found")
    }
    todos=todos.filter(todo=>todo.id!=req.params.id)
    // console.log("updated items after deleting ",todos)
    return res.status(200).send("Item found and deleted")
  }
  
  app.post('/todos',createTodo)
  app.get('/todos',getAllTodos)
  app.put('/todos/:id',updateTodo)
  app.get('/todos/:id',getTodo)
  app.delete('/todos/:id',deleteTodo)
  app.get('/',(req,res)=>{
    res.send("cool")
  })
  app.all("*",(req,res)=>{
    return res.status(404).send("Invalid path mentioned")
  })
  
  
  app.listen(4000,(err)=>{
    if(err){
      // console.log("failed to start server");
      return
    }
    // console.log("up and running")
  
  })
  
  module.exports = app;