const {Pizza}= require('../models');

const pizzaController = {
    //get all pizzas
    getAllPizza (req,res) {
        Pizza.find({})
        //Populate: basically allows to show/populate the content of the comments instead of just the comment_id
        .populate({
            path: 'comments', 
            //Note that we also used the select option inside of populate(), so that we can tell Mongoose that we don't care about the __v field on comments either. The minus sign - in front of the field indicates that we don't want it to be returned. If we didn't have it, it would mean that it would return only the __v field.
            select: '-__v'
        })
        //to not include the __v field in the query either
        .select('-__v')
        //use .sort({ _id: -1 }) to sort in DESC order by the _id value.
        .sort({_id:-1})
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err=>{
            console.log(err);
            res.status(400).json(err);
        });
    },

    //get one pizza by id
    getPizzaById({params},res){
        Pizza.findOne({_id: params.id})
        .populate({
            path: 'comments', 
            select: '-__v'
        })
        .select('-__v')
        .then(dbPizzaData =>{
            if(!dbPizzaData){
                res.status(404).json({message: 'No pizza found with this id'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err =>{
            console.log(err);
            res.status(400).json(err);
        });
    },

    //create pizza
    //destructured the body out of the req object because don't need to interface with the other data
    createPizza({body}, res) {
        Pizza.create(body)
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.json(err));
    },

    //change pizza by id
    updatePizza({params, body}, res) {
        Pizza.findOneAndUpdate({_id: params.id}, body, {new: true})
        .then(dbPizzaData => {
            if(!dbPizzaData){
                res.status(404).json({message: 'No pizza found with this id'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    },

    deletePizza({params}, res){
        Pizza.findOneAndDelete({_id: params.id})
        .then(dbPizzaData=>{
            if(!dbPizzaData){
                res.status(404).json({message: 'No pizza found with this id'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err=>res.status(400).json(err));
    }
};

module.exports = pizzaController;