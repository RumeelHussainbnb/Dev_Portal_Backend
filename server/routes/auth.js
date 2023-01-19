import express from "express";
// controllers
import auth from "../controllers/auth.js";

const router = express.Router();

router.post("/", auth.onFindOneAndUpdateUser);

// check if email exists or not
router.post("/emailExists", auth.onEmailExists);

// check if email exists or not
router.post("/login", auth.onLogin);

// Register User
router.post("/register", auth.onRegister);

// forget password
router.post("/forgetPassword", auth.onForgetPassword);

// Change password
router.post("/changePassword", auth.onChangePassword);

export default router;
