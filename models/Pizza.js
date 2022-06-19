const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

/* Data to be stored when user creates a new pizza:
1. The name of the pizza

2. The name of the user that created the pizza

3. A timestamp of when the pizza was created

4. A timestamp of any updates to the pizza's data

5. The pizza's suggested size

6. The pizza's toppings
*/

const PizzaSchema = new Schema(
  {
  pizzaName: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    //getter: transform the data by default every time its queried (but we can use the timestamp value for storage)
    get: (createdAtVal) => dateFormat(createdAtVal)
  },
  size: {
    type: String,
    default: "Large",
  },
  toppings: [],
  comments: [
    {
      //This is a method to refer the model you define on line 42 so that you can do things like (populate).
      type: Schema.Types.ObjectId,
      //ref property tells the Pizza model which documents to search to find the right comments
      ref: 'Comment'
    }
  ]
},
{
  //you can send the results of virtuals/getters in json format
  toJSON: {
    //allowing to use virtuals and getters
    virtuals: true,
    //getter: it transform whatever you are getting back from the database
    getters: true
  },
  //set to false because it is a virtual that mongoose needs, not us
  id: false
}
);

//Virtual: allow you to add virtual properties to a document that aren't stored in the database. 
//They're normally computed values that get evaluated when you try to access their properties. 
//get total count of comments and replies on retrieval

PizzaSchema.virtual('commentCount').get(function(){
//.reduce() walks through the array and passes the accumulating total and current value of comment into the function, returning the function revising the total for the next iteration through array
//Different with map: it uses the result of every computation as it goes through the array.
  return this.comments.reduce((total,comment) => total + comment.replies.length +1,0)
});

//create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

//export the Pizza model
module.exports = Pizza;