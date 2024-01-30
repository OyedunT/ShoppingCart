const express = require ("express");
const app = express()
const ejs = require ('ejs')
const mongoose = require("mongoose");
const env = require("dotenv").config()
app.use(express.urlencoded({extended: true}))


app.set("view engine", "ejs")
const ShoppingSchema = new mongoose.Schema({
    title : {type : String, required : [true, "Title field is required"]},
    description : {type : String, required : [true, "Title field is required"]},
    price : {type : String, required : [true, "Title field is required"]},
    quantity : {type : String, required : [true, "Title field is required"]},
    subtotal : {type: String, required :[true]}


})

let shoppingModel = mongoose.model("shoppingmodel", ShoppingSchema)


const port = process.env.PORT || 5000;


// Posting to database
app.post("/shoppingcart", async (req, res)=>{
    try {
     const {title, description,price,quantity} = req.body;
     const subtotal = req.body.price * req.body.quantity
    if (!title || !description || !price || !quantity){
        res.status(400).json({message : "All Inputs are mandatory"})
    }else{
         try {
            console.log(req.body);
            console.log(subtotal);
        
         const shop = await shoppingModel.create({
            title,
            description,
            price,
            quantity,
            subtotal
         })
         } catch (error) {
            console.log("Error saving to database", error);
         }

    }
    console.log("Shopping Posted Successfully");
    res.redirect("/shoppingcart")

    } catch (error) {
     console.log("Error saving to database", error);
     
    }
 })
 

 app.get("/shoppingcart", async (req, res)=>{
    try {
    const getShopping = await shoppingModel.find();
      if (getShopping) {
        console.log(`Shop Fetched Successfully , ${getShopping}`);
  
      }else{
        console.log("Unable to fetch Shop");
      }
      res.render("index", {UsersArray : getShopping});
  
    } catch (error) {
      console.log("Server error, error fetching Shop", error);
    }
   })
  
  //  To delete 
   app.post("/delete/:id", async (req, res) => {
    const id = req.params.id;
   
    console.log("Received Id : ", id);
  
    if (!id) {
      console.log("No id found");
    } else {
      try {
        const deletedProduct = await shoppingModel.findByIdAndDelete(id);
        if (!deletedProduct) {
          console.log("Error deleting product");
        } else {
          console.log("Deleted Product: ", deletedProduct);
          res.redirect("/shoppingcart"); 
        }
      } catch (error) {
        console.log("Error deleting Product:", error);
        res.status(400).send("Error");
      }
    }
  });

  //  To Edit Content
 app.post("/edit/:id", async(req, res)=>{
  const id = req.params.id;
  console.log("Recieved Id : ",id)

  if (!id) {
    console.log("No id found");
  }else{
    try {
      const getShopping = await shoppingModel.findById(id)
      if (!getShopping) {
        console.log("Error Getting product");
      }else
      console.log("Recieved Product : ", getShopping)
      res.render("edit", {shoppingcart : getShopping})
      
    } catch (error) {
      console.log("Error editing product")
    }
  }
 

});

  //  Update Content
app.post("/updateshoppingcart/:id", async(req, res)=>{
  const Id = req.params.id

  if (!Id) {
    console.log("Id Not Provided");
  }
  const {title, description,price,quantity} = req.body;
  const subtotal = req.body.price * req.body.quantity


  if (!title || !description || !price || !quantity) {
    console.log("All Input are required");
    res.status(400).send({message : "All Input are required"});
  }

  try {
    const getShopping = await shoppingModel.findById(Id);
    if (!getShopping) {
      console.log(" Not Found");
    }else{
      const updateshopping = await shoppingModel.findByIdAndUpdate(
        Id,
        { title,
          description,
          price,
          quantity,
          subtotal},
        {new: true}
      );
      console.log("Product Updated Successfully", updateshopping)
      res.redirect("/shoppingcart");
    }
  } catch (error) {
    console.log("Error Updating Product", error);
  }
 

  
})

// Adding up the total
app.post('/total/:id', (req, res) => {
  if (UsersArray && UsersArray.length > 0) {
    const total = UsersArray.reduce((shoppingcart, user) => shoppingcart + user.subtotal, 0);
    res.send(`Total: ${total}`);
  } else {
    res.send('No users found');
  }
});





const connectionString = process.env.CONNECTION_STRING

 const connect = async()=>{
    try {
      let connect =  await mongoose.connect(connectionString)
      if (connect){
        console.log("Database connected successfully")
      }else{
        console.log("error connecting top database")
      }
    } catch (error) {
        console.log("error", error);
    }
 } 
 connect()


app.listen(port, ()=>{
    console.log(`app is running on ${port}`);
})
