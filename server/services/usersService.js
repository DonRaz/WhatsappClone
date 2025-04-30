
const usersRepo = require('../repositories/usersRepo');
const NUMBER_OF_ACTIONS_PER_DAY_DEFATULT = 30;

const usersService = {
	getAllUsers: async () => {
		const users = await usersRepo.getAllUsers();

		return users;
	},

	getUserById: async (id) => {
		return await usersRepo.getUserById(id);
	},

	updateUser: async (id, userData) => {
		// If userData is a complete user object, extract only the fields we want to update
		if (!userData || !typeof userData === 'object') {
			throw new Error('Invalid user data');
		}
		// Create a new object with only the fields to update
		const updateData = {};

		// Only include specific fields that should be updated
		if (userData.fullName !== undefined) {
			updateData.fullName = userData.fullName;
		}

		if (userData.email !== undefined) {
			updateData.email = userData.email;
		}

		console.log('Final updateData:', updateData);
		return await usersRepo.updateUser(id, updateData);
	},

	// Specific method to update just numOfActionsLeft
	updateNumOfActionsLeft: async (id, numOfActionsLeft) => {
		return await usersRepo.updateUser(id, { numOfActionsLeft, lastActionAt: new Date() });
	},

	deleteUser: async (id) => {
		return await usersRepo.deleteUser(id);
	},

	getUserByEmailNPassword: async (email, password) => {
		// validate username and password
		// const users_jsonPlaceHolder = await users_jsonPlaceHolderRepo.getAllUsers();
		// const user_jsonPlaceHolder = users_jsonPlaceHolder.find((user) => user.username === username && user.email === password);
		// if (!user_jsonPlaceHolder) {
		// 	throw new Error('Invalid username or password');
		// }
		// const idFromJsonPlaceHolder = `${user_jsonPlaceHolder.username}_${user_jsonPlaceHolder.email}`;
		const user = await usersRepo.getUserByEmail(email);
		if (!user) {
			throw new Error('Invalid email');
		}

		// check if password is correct (note - it is hashed in the database) // TODO - verify it works
		const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);
		if (!isPasswordCorrect) {
			throw new Error('Invalid password');
		}

		return user;
		// see if user exists in our database
		try {
			const existingUserInOurDB = await usersRepo.getUserByIdFromJsonPlaceHolder(idFromJsonPlaceHolder);
			if (existingUserInOurDB) {
				return existingUserInOurDB;
			}
			throw new Error('User not found in our database');
			// // creating the user in our database (Violating requirements (comment-out before submitting))
			// const userObject = {
			// 	idFromJsonPlaceHolder: idFromJsonPlaceHolder,
			// 	fullName: user.name,
			// 	numOfActions: NUMBER_OF_ACTIONS_PER_DAY_DEFATULT, // actions he can do each day
			// 	numOfActionsLeft: NUMBER_OF_ACTIONS_PER_DAY_DEFATULT,
			// 	email: user.email,
			// 	lastActionAt: new Date(),
			// };
			// const userInOurDB = await usersRepo.createUser(userObject);
			// return userInOurDB;
		} catch (error) {
			throw new Error(`Error creating user: ${error.message}`);
		}
	},
};

module.exports = usersService;
