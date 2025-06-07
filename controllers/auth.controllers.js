import User from "../models/user.model.js";

// Mongoose kommer kontrollera "user" mot både schema och mot databasen för att se till så användaruppgifterna är riktiga och att man inte skapar en användare med samma namn
export async function registerUser(user) {
    try {
        const result = await User.create(user);
        return user;
    } catch (error) {
        console.log(error.message);
        return null;
    }
}

export async function getUser(username) {
    try {
        const user = await User.findOne({
            username: username,
        });
        if (user) return user;
        else throw new Error("No user found");
    } catch (error) {
        console.log(error.message);
        return null;
    }
}

export async function getUserByUserId(userId) {
    try {
        const user = await User.findOne({
            userId: userId,
        });
        if (user) return user;
        else throw new Error("No user found");
    } catch (error) {
        console.log(error.message);
        return null;
    }
}
