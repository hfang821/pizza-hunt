const {Pizza}= require('../models');

const pizzaController = {
    //get all pizzas
    getAllPizza (req,res) {
        Pizza.find({})
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err=>{
            console.log(err);
            res.status(400).json(err);
        });
    },

    //get one pizza by id
    getPizzaById({params},res){
        Pizza.findOne({_id: params.id})
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
        .catch(err => res.status(400).json(err));
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