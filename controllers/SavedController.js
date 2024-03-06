const User=require("../Models/User")
const Recipe = require('../Models/Recipe');
const Bookmark=require('../Models/Bookmark');
const saved_list=(req, res) => {
    const userId = req.user.id; 
    User.findById(userId)
    .populate('bookmarks') 
    .then((user) => {
        if (!user) {
        throw new Error('User not found');
        }
        // Extract recipe IDs from bookmarks
        const bookmarkedRecipeIds = user.bookmarks.map((bookmark) => bookmark.recipe);
        // Retrieve the recipe objects based on the IDs
        return Recipe.find({ _id: { $in: bookmarkedRecipeIds } }); 
    })
    .then((bookmarkedRecipes) => {
        res.render('Recipe/savedRecipe',{recipes:bookmarkedRecipes});
    })
    .catch((error) => {
        res.status(500).json({
        message: 'Error displaying bookmarked recipes',
        error: error.message,
        });
    });
    };
const saved_delete_get=(req, res) => {
    const userId = req.user.id; 
        User.findById(userId)
        .populate('bookmarks') 
        .then((user) => {
            if (!user) {
            throw new Error('User not found');
            }
            // Extract recipe IDs from bookmarks
            const bookmarkedRecipeIds = user.bookmarks.map((bookmark) => bookmark.recipe);
            // Retrieve the recipe objects based on the IDs
            return Recipe.find({ _id: { $in: bookmarkedRecipeIds } }); 
        })
        .then((bookmarkedRecipes) => {
            res.render('Recipe/deleteSavedRecipe',{recipes:bookmarkedRecipes});
        })
        .catch((error) => {
            res.status(500).json({
            message: 'Error displaying bookmarked recipes',
            error: error.message,
            });
        });
    };
const saved_add=(req,res)=>{
    const userId = req.user.id;
    const recipeId = req.params.id;
    User.findById(userId)
        .then((user) => {
        if (!user) {
            throw new Error('User not found');
        }
        return Recipe.findById(recipeId);
        })
        .then((recipe) => {
        if (!recipe) {
            throw new Error('Recipe not found');
        }
        // Check if the recipe is already bookmarked by the user
        return Bookmark.findOne({ user: userId, recipe: recipeId });
        })
        .then((existingBookmark) => {
        if (existingBookmark) {
            return res.status(400).json({ error: 'Recipe already bookmarked' });
        }
        const bookmark = new Bookmark({
            user: userId,
            recipe: recipeId,
        });
        return bookmark.save();
        })
        .then((bookmark) => {
        return User.findByIdAndUpdate(userId, { $push: { bookmarks: bookmark._id } }, { new: true });
        })
        .then((user) => {
        console.log('Bookmark added successfully:');
        res.redirect('/home');
        })
        .catch((error) => {
        console.error('Error adding bookmark:', error);
        });
    };
const saved_delete_post=(req, res) => {
    const recipeIds = req.body.id;
    const userId = req.user.id;
    User.findById(userId)
    .populate('bookmarks')
    .then((user) => {
        if (!user) {
        throw new Error('User not found');
        }
        // Find and remove the bookmark entries for the specified recipe IDs
        user.bookmarks = user.bookmarks.filter((bookmark) => !recipeIds.includes(bookmark.recipe.toString()));
        return user.save();
    })
    .then((user) => {
        console.log('Recipes removed from bookmarks successfully');
        // console.log(user);
        res.redirect('/users/delete-saved');
    })
    .catch((error) => {
        console.error('Error removing recipes from bookmarks:', error);
        res.status(500).json({ error: 'Internal server error' });
    });
    };

module.exports={
    saved_add,
    saved_list,
    saved_delete_get,
    saved_delete_post
    };