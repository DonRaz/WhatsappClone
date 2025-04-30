// Let's the service layer to use the database operations

const userModel = require('../models/usersModel');

const usersRepo = {

  getAllUsers: (filters = {}) => {
    return userModel.findAll(filters);
  },

  getUserById: (id)  => {
    return userModel.findById(id);
  },

  getUserByIdFromJsonPlaceHolder: (idFromJsonPlaceHolder) => {
    return userModel.findByIdFromJsonPlaceHolder(idFromJsonPlaceHolder);
  },

  createUser: (userData) => {
    return userModel.create(userData);
  },

  getUserByEmail: (email) => {
    return userModel.findByEmail(email);
  },

  updateUser: (id, userData) => {  
    if (userData.id) {
      delete userData.id; // Remove the id field from the update data if it exists
    }
    
    return userModel.update(id, userData);
  },

  deleteUser: (id) => {
    return userModel.delete(id);
  },
};

module.exports = usersRepo;