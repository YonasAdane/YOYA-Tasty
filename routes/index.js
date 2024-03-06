const express=require('express');
const router=express.Router();
const {ensureAuthenticated}=require('../config/auth');
const Recipe = require('../Models/Recipe');
const RecipeController=require('../controllers/RecipeController');
const SavedController=require('../controllers/SavedController');
//  Landing Page
router.get('/',(req,res)=>{
  res.render('welcome');
});
router.get('/dashboard',ensureAuthenticated,(req,res)=>{
  const userId = req.user.id; 

    Recipe.find({ createdBy: userId })
        .populate('createdBy')
        .exec()
        .then(recipes=>{
          // console.log(recipes);
        
          res.render('dashboard',{name:req.user.name,recipes});
        })
          .catch(err=>{ console.error(err)});
});
//  watch recipes to delete
router.get('/delete-recipe',ensureAuthenticated,RecipeController.Recipe_delete_get);
//  to delete Selected Recipes
router.post('/delete-recipe',ensureAuthenticated,RecipeController.Recipe_delete_post);
//  to watch all recipes (finished)
router.get('/home',ensureAuthenticated,RecipeController.Recipe_index);
//  contact Us
router.get('/contact-us',(req, res) => {
res.render('ContactUs');
});
//  About Us
router.get('/about-us',(req, res) => {
res.render('AboutUs');
});
//  to watch Single recipe (finished)
router.get('/recipe/:id',RecipeController.Recipe_details);
// to bookmark this Recipe 
router.post('/recipe/:id',ensureAuthenticated,SavedController.saved_add);
//  search recipe DB
router.get('/recipe/search',ensureAuthenticated,(req,res)=>{
  const query = req.query.q; // Assuming the search term is passed as a query parameter 'q'

  Recipe.find(
    { $text: { $search: query } }, // Using MongoDB text search to match the query
    'id title category foodPicture',
    (err, recipes) => {
      if (err) {
        console.error(err);
        // Handle the error
        res.status(500).json({ error: 'An error occurred' });
      } else {
        res.json(recipes);
      }
    }
  );
});
//  create recipe page POST
router.post('/create-recipe',ensureAuthenticated,RecipeController.Recipe_create_post);

















module.exports=router;