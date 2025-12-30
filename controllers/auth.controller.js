import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const register = async (req, res) => {
  const { username, email, password } = req.body;
  console.log("REGISTERRRRRRRRR", req.body);
  
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    console.log("CN ENCRYPTED PASSWORD", encryptedPassword);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: encryptedPassword,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.log("CN ERROR", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  console.log("Login controller");
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const maxAge = 1000 * 60 * 60 * 24 * 7;
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: maxAge,
    });

    const { password: userPassword, ...userInfo } = user;
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        maxAge: maxAge,
      })
      .status(200)
      .json(userInfo);
  } catch (error) {
    console.log("CN ERROR", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout successful" });
  console.log("Logout controller");
};

export { register, login, logout };
