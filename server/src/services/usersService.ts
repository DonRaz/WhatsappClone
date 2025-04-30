import usersRepo from '../repositories/usersRepo';
import bcrypt from 'bcrypt';
import { UserData } from '@sraz-sw/fullstack-shared';
import * as QueryString from 'qs';

const saltRounds = 10;

const usersService = {
  getAllUsers: async (query: QueryString.ParsedQs): Promise<UserData[]> => {
    return usersRepo.getAllUsers(query);
  },

  getUserById: async (id: string): Promise<UserData | null> => {
    return usersRepo.getUserById(id);
  },

  getUserByEmail: async (email: string): Promise<UserData | null> => {
    return usersRepo.getUserByEmail(email);
  },

  getUserByEmailNPassword: async (email: string, password: string): Promise<UserData | null> => {
    const user = await usersRepo.getUserByEmail(email);
    if (!user || !user.hashedPassword) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!isMatch) {
      return null;
    }

    return user;
  },

  createUser: async (email: string, password: string, name?: string): Promise<UserData> => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const userData: Partial<UserData> = {
      email,
      hashedPassword,
      name
    };

    return usersRepo.createUser(userData);
  },

  updateUser: async (id: string, userData: Partial<UserData>): Promise<UserData> => {
    return usersRepo.updateUser(id, userData);
  },

  deleteUser: async (id: string): Promise<UserData> => {
    return usersRepo.deleteUser(id);
  },
};

export default usersService; 