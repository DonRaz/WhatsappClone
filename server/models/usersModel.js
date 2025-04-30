const prisma = require('../configs/db');

const UserModel = {
	findAll: (options = {}) => {
		return prisma.user.findMany({
			where: options,
		});
	},

	findById: (id) => {
		return prisma.user.findUnique({
			where: { id },
		});
	},

	findByIdFromJsonPlaceHolder: (idFromJsonPlaceHolder) => {
		return prisma.user.findUnique({
			where: { idFromJsonPlaceHolder },
		});
	},

	findByEmail: (email) => {
		return prisma.user.findUnique({
			where: { email },
		});
	},

	create: (data) => {
		return prisma.user.create({
			data: data,
		});
	},

	update: async (id, data) => {		
		try {
			const result = await prisma.user.update({
				where: { id },
				data: data,
			});
			return result;
		} catch (error) {
			console.error('Error updating user:', error);
			throw error;
		}
	},

	delete: (id) => {
		return prisma.user.delete({
			where: { id },
		});
	},
};

module.exports = UserModel;
