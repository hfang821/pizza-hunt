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
                    //its pushing a new comment with the comment_id to the pizza you selected
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

    addReply({params,body},res) {
        Comment.findOneAndUpdate(
            {_id: params.commentId},
            {$push: {replies:body}},
            //When true, returns the modified document rather than the original.
            {new: true, runValidators: true}
        )
        .then(dbPizzaData=>{
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
                    //delete comment with a unique id (or it will remove all identical comments)
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
    },

    removeReply({params}, res){
        Comment.findOneAndUpdate(
            {__id: params.commentId},
            {$pull: {replies: {replyId: params.replyId}}},
            {new: true}
        )
        .then(dbPizzaData=> res.json(dbPizzaData))
        .catch(err => res.json(err));
    }
};

module.exports = commentController;