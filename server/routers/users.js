import express from "express";
import { compare, hash } from "bcrypt";

import {
    getUserById,
    getAllUsers,
    updateUser,
} from "../database/usersDb.js";


import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();


/*
//GET /api/users/:userId - View user's profile ( OR should i do /api/users/:userId/:username  router.get("/:userId/:username", async(req,res) => {    ) w
router.get("/:userId", async(req,res) => {
    // console.log("(users.js) request params:", req.params); //debug (w)
    const userId = req.params.userId;
    const user = await getUserById(userId);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({error: "User not found"});
    }
});
*/

//GET /api/users/:userId/:username - View user's profile 
router.get("/:userId/:username", async(req,res) => {
    // console.log("(users.js) request params:", req.params); //debug (w)

    const reqUser = req.params;
    // console.log("(users.js) request params of userId:", reqUser.userId); //debug (w)
    // console.log("(users.js) request params of username:", reqUser.username); //debug (w)
    const user = await getUserById(reqUser.userId);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({error: "User not found"});
    }
});


//PATCH /api/users/:userId - Update user's profile
router.patch("/:userId", requireAuth, async(req,res) => {
    const userId = req.params.userId;
    const userData = req.body;

    try {
        await updateUser(userId, userData);
        res.status(200).json("User profile has been successfully updated.");
    } catch (error) {
        res.status(400).json({error: "Update of user profile failed."})
    }

}); 




// PATCH /api/users/:userId/change-password
router.patch("/:userId/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
//   console.log("(users.js)currentPassword:", currentPassword); //debug
//   console.log("(users.js)newPassword:", newPassword); //debug
  const userId = req.params.userId;

  if (currentPassword === newPassword) {
    return res.status(400).json({ error: "New password must be different from the current one." });
  }

  const user = await getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const isMatch = await compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Current password is incorrect" });
  }

  await updateUser(userId, { password : newPassword } ); //line a

  res.status(200).json({ message: "Password updated successfully." });
});



//GET /api/users/ - Get all users
router.get("/", async(req,res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(400).json("tiger not running fast enuf.");
    }
});


    
export default router;
