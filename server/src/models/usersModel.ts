import prisma from '../configs/db';
import { Prisma } from '@prisma/client';
// import { UserData } from '../../../shared';
import { UserData } from '@sraz-sw/fullstack-shared';
import { toPrismaUser, toUserData } from '../services/typesConverter';




const UserModel = {
  findAll: async (options: any = {}): Promise<UserData[]> => {
    const users = await prisma.user.findMany({
      where: options,
    });
    return users.map(toUserData);
  },

  findById: async (id: string): Promise<UserData | null> => {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user ? toUserData(user) : null;
  },

  findByEmail: async (email: string): Promise<UserData | null> => {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user ? toUserData(user) : null;
  },

  create: async (data: Partial<UserData>): Promise<UserData> => {
    // Convert from our type to Prisma compatible input
    const prismaData = toPrismaUser(data);
    
    const user = await prisma.user.create({
      data: prismaData as Prisma.UserCreateInput,
    });
    
    return toUserData(user);
  },

  update: async (id: string, data: Partial<UserData>): Promise<UserData> => {    
    try {
      // Convert from our type to Prisma compatible input
      const prismaData = toPrismaUser(data);
      
      const user = await prisma.user.update({
        where: { id },
        data: prismaData as Prisma.UserUpdateInput,
      });
      
      return toUserData(user);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<UserData> => {
    const user = await prisma.user.delete({
      where: { id },
    });
    
    return toUserData(user);
  },
};

export default UserModel; 