const Recipe = require('../Models/Recipe');

const Recipe_index=(req,res)=>{
    Recipe.find({}, 'id title category foodPicture').then(recipes => {
        if (!recipes) {
            console.error('err');
        } else {
            res.render('Recipe/home',{recipes});
        }
        }).catch(err=>console.log(err));
    };
const Recipe_details=(req,res)=>{
    const id=req.params.id;
    if(id.length!=24){
        res.satus=404;
        res.render('404');
    }
    Recipe.findById(id).then(recipe=>{
        if(!recipe){
            res.satus=404;
            res.render('404');
        }else{
            res.render('./Recipe/SingleRecipe',{recipe});
        }
        }).catch(err=>{console.log(err)});
    };
const Recipe_create_get=(req,res)=>{
    res.render('Recipe/createRecipe');
    };
const Recipe_create_post=(req, res)=>{
    try {
        const title=req.body.title;
        const steps=req.body.steps;
        const category=req.body.category;
        const tags=req.body.tags;
        const foodPicture=req.body.foodPicture;
        const ingredients=req.body.ingredients;
        // Create a new recipe instance
        const newRecipe = new Recipe({
            title:title,
            ingredients:ingredients,
            steps:steps,
            category:category,
            tags:tags,
            foodPicture:foodPicture,
            ingredientsPhotoLink:'',
            createdBy:req.user.id
        });
    
        // Save the recipe to the database
        const createdRecipe =  newRecipe.save()
            .then(recipe=>{
            // console.log(recipe);
            res.redirect('/home');
            })
            .catch(err=>{
            console.log(err)});

            } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while creating the recipe' });
            }
    };
const Recipe_delete_get=(req,res)=>{
    const userId = req.user.id; 
    Recipe.find({ createdBy: userId })
        .populate('createdBy')
        .exec()
        .then(recipes=>{
            res.render('Recipe/deleteRecipe',{recipes});
        })
            .catch(err=>{ console.error(err)});
    };
const Recipe_delete_post=(req,res)=>{
    const recipeIds = req.body.id;
    Recipe.deleteMany({ _id: { $in: recipeIds } })
    .then((result) => {
        console.log(`${result.deletedCount} recipes deleted successfully.`);
        res.redirect('/delete-recipe');
    })
    .catch((error) => {
        console.error('Error deleting recipes:', error);
    });
    };
module.exports={Recipe_index,
    Recipe_details,
    Recipe_create_get,
    Recipe_create_post,
    Recipe_delete_get,
    Recipe_delete_post
}