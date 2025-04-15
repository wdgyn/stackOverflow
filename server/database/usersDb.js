import { ObjectId } from "mongodb";
import { initDBIfNecessary } from "./utils.js";
import { hash } from "bcrypt";


export async function createUser(userData) {
    const db = await initDBIfNecessary();
    const user = {
        fullName: userData.fullName,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        profilePicture: "",
        bio: "",
        createdAt: new Date(),
    };
    return db.collection("users").insertOne(user);
}

export async function getUserById(userId) {
    const db = await initDBIfNecessary();
    try {
        return db.collection("users").findOne({ _id: ObjectId.createFromHexString(userId) });
    } catch (error) {
        console.error("(usersDb.js)Error fetching user:", error);
    }
}

export async function getUserByUsername(username) {
    const db = await initDBIfNecessary();
    try {
        return db.collection("users").findOne({ username });
    } catch (error) {
        console.error("(usersDb.js)Error fetching user:", error);
    }
}

export async function getUserByEmail(email) {
    const db = await initDBIfNecessary();
    try {
        return db.collection("users").findOne({ email });
    } catch (error) {
        console.error("Error fetching user:", error);
    }
}

export async function getAllUsers() {
    const db = await initDBIfNecessary();
    return db.collection("users").find().toArray();
}




export async function updateUser(userId, userData) {
    const db = await initDBIfNecessary();

    const user = await getUserById(userId);
    const oldUsername = user.username;
  
    const updateFields = {};
    if (userData.fullName) {
        updateFields.fullName = userData.fullName;
    }
    if (userData.username) {
        updateFields.username = userData.username;
    }
    if (userData.email) {
      updateFields.email = userData.email;
    }
    if (userData.password) {
        const hashedPassword = await hash(userData.password,10);
        updateFields.password = hashedPassword;
    }
    if (userData.profilePicture) {
        updateFields.profilePicture = userData.profilePicture;
    }
    if (userData.bio) {
        updateFields.bio = userData.bio;
    }
  
    await db.collection("users").updateOne(
      {_id: ObjectId.createFromHexString(userId)}, 
      {$set: updateFields}
    );


    // this is to update createdBy attributes of quesitons and answers, if there is a change in username
    if (userData.username && userData.username !== oldUsername) {
        // console.log(`[DEBUG] Changing username from ${oldUsername} → ${userData.username}`); //debug
    
        const qResult = await db.collection("questions").updateMany(
            { createdBy: oldUsername },
            { $set: { createdBy: userData.username } }
        );
        // console.log(`[DEBUG] Questions modified: ${qResult.modifiedCount}`);  //debug
    
        const aResult = await db.collection("answers").updateMany(
            { createdBy: oldUsername },
            { $set: { createdBy: userData.username } }
        );
        // console.log(`[DEBUG] Answers modified: ${aResult.modifiedCount}`);  //debug
    }
}





