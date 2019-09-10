const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

var ModelSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  created_at: Date
});

ModelSchema.pre('save', async function(next) {
  const saltRounds = 10
  const salt = bcrypt.genSaltSync(saltRounds)
  const passwordHash = bcrypt.hashSync(this.password, salt)
  this.password = passwordHash;
  next();
});

const Model = mongoose.model('Account', ModelSchema);

const Schema = [
   `
  type Account {
    id: ID
    username: String!
    name: String
    email: String!
    created_at: DateTime
  }
  `
]

export {
  Schema,
  Model
}
