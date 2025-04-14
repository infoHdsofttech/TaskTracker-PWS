import express, { Request, response, Response } from 'express';
import bcrypt from 'bcryptjs';  // Hashing passwords
import jwt from 'jsonwebtoken'; // Generating JWT token
import prisma from '../../lib/prisma';
import verifyToken from '../../middlewares/Authenticate';

const authRouter = express.Router();
const SECRET_KEY = "supersecretkey"; // Replace with env variable


authRouter.get("/user", verifyToken, async (req: Request, res: Response): Promise<void> => {
    try {
      // Assuming your verifyToken middleware attaches userId to req.
      const userId = (req as any).userId;
  
      // Fetch the user details from the database. You can include
      // related fields if needed.
      const user = await prisma.user.findUnique({
        where: { id: userId },
        // Optionally: include relationships, e.g.
        // include: { projects: true, societyMembers: true },
      });
  
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ message: "Error fetching user data", error });
    }
  });
  
authRouter.post('/signup', async (req: Request, res: Response): Promise<any>=> {
    const { name,email, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        });

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
});

authRouter.post('/login', async (req: Request, res: Response):Promise <any> => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, 
            // { expiresIn: "1h" }
        );

        res.json({ message: "Login successful", token,status: 200 });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
});

export default authRouter;
