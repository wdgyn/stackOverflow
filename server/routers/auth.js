import { Router } from "express";
import jwt from "jsonwebtoken";
import { hash, compare } from "bcrypt";
import { getUserByEmail, createUser, getUserByUsername, updateUser } from "../database/usersDb.js";
// import { sendResetEmail } from "../utils/mailer.js";


const router = Router();

//POST /api/auth/register - register new users
router.post("/register", async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ error: "Full Name, Username, Email, Password are required." });
    }

    let existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists. Please choose another username." });
    }

    const hashedPassword = await hash(password, 10);
    const newUserId = await createUser({ fullName, username, email, password: hashedPassword });

    const user = await getUserByEmail(email);

    const token = jwt.sign(
      { userId: user._id, fullName: user.fullName, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    // return token + user info
    return res.status(201).json({
      token,
      userId: user._id.toString(),
      username: user.username,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


//POST /api/auth/login - login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log("(auth.js)password", password); //debug

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, fullName: user.fullName, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );
    return res.status(200).json({
      token,
      userId: user._id.toString(), 
      username: user.username,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/*
// POST /api/auth/forgot-password - Forgot password (For not logged in users)
router.post("/forgot-password", async (req,res) => {
  try {
    const {email} = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(200).json({ message: "If email exists, a reset link has been sent." });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await sendResetEmail(user.email, token);
    res.status(200).json({ message: "If email exists, a reset link has been sent." });

    // console.log(`Reset link: http://localhost:3000/reset-password?token=${token}`);
    // res.status(200).json({ message: "Reset link sent", token }); // remove token in prod

  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ error: err.message });
  }
});


// POST /api/auth/reset-password - Reset password (For not logged in users)
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token and new password are required." });
  }

  try {
    // Verify token and extract userId
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = payload.userId;

    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);

    // Update user password in DB
    await updateUser(userId, { password: hashedPassword });

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("Reset error:", err);
    res.status(400).json({ error: "Invalid or expired token." });
  }
});
*/

export default router;
