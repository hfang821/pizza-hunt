const { Comment, Pizza } = require('../models');

const commentController = {
    //add comment to pizza
    addComment({params,body},res){
        console.log(body);
        Comment.create(body)
            .then(({_id})=>{
                return Pizza.findOneAndUpdate(
                    {_id: params.pizzaId},
                    //use the $push method to add the comment's _id to the specific pizza we want to update. (add data to an array)
                    //ask Ta: difference btw push and pull
                    {$push: {comments: _id}},
                    {new: true}
                );
            })
            .then(dbPizzaData=> {
                if(!dbPizzaData){
                    res.status(404).json({message: 'No pizza found with this id'});
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err=> res.json(err));
    },

    //remove comment
    removeComment({params},res){
        Comment.findOneAndDelete({_id: params.commentId})
            .then(deletedComment => {
                if(!deletedComment) {
                    return res.status(404).json({message: 'No comment found with this id'});
                }
                return Pizza.findOneAndDelete(
                    {_id: params.pizzaId},
                    //ask Ta: difference btw push and pull
                    {$pull: {comments: params.commentId}},
                    {new: true}
                );
            })
            .then(dbPizzaData=>{
                if(!dbPizzaData){
                    res.status(404).json({message: 'No pizza found with this id'});
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    }
};

module.exports = commentController;