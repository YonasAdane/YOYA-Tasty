const express=require('express');
const router=express.Router();
const {ensureAuthenticated}=require('../config/auth');
const RecipeController=require('../controllers/RecipeController');
const UserController=require('../controllers/UserController');
const SavedController=require('../controllers/SavedController');
// Login Page
router.get('/login', UserController.login_get);
//      login handle
router.post('/login',UserController.login_post);
//      logout handle
router.get('/logout',UserController.logout_get);
//      registration page
router.get('/register', UserController.register_get);
//      registration Proccesor
router.post('/register', UserController.register_post);
//      display saved recipes
router.get('/saved',ensureAuthenticated,SavedController.saved_list);
//      display the saved pages to delete
router.get('/delete-saved',ensureAuthenticated,SavedController.saved_delete_get);
//      Delete Selected saved Recipes
router.post('/delete-saved',ensureAuthenticated,SavedController.saved_delete_post);
//  create recipe page
router.get('/create-recipe',ensureAuthenticated,RecipeController.Recipe_create_get);

module.exports=router;