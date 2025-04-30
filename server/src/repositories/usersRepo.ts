import userModel from '../models/usersModel';
// import { UserData } from '../../../shared';
import { UserData } from '@sraz-sw/fullstack-shared';
import * as QueryString from 'qs';


const usersRepo = {
  getAllUsers: (query: QueryString.ParsedQs): Promise<UserData[]> => {
    return userModel.findAll(query);
  },

  getUserById: (id: string): Promise<UserData | null> => {
    return userModel.findById(id);
  },

  createUser: (userData: Partial<UserData>): Promise<UserData> => {
    return userModel.create(userData);
  },

  getUserByEmail: (email: string): Promise<UserData | null> => {
    return userModel.findByEmail(email);
  },

  updateUser: (id: string, userData: Partial<UserData>): Promise<UserData> => {  
    return userModel.update(id, userData);
  },

  deleteUser: (id: string): Promise<UserData> => {
    return userModel.delete(id);
  },
};

export default usersRepo; 