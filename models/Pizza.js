const { Schema, model } = require("mongoose");

/* Data to be stored when user creates a new pizza:
1. The name of the pizza

2. The name of the user that created the pizza

3. A timestamp of when the pizza was created

4. A timestamp of any updates to the pizza's data

5. The pizza's suggested size

6. The pizza's toppings
*/

const PizzaSchema = new Schema({
  pizzaName: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  size: {
    type: String,
    default: "Large",
  },
  toppings: [],
});


//create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

//export the Pizza model
module.exports = Pizza;