import express, { Request, Response } from 'express';
import cors from 'cors';
import prisma from './src/lib/prisma'; // Ensure this exports PrismaClient
import authRouter from './src/routes/auth/auth';
import taskRouter from './src/routes/task/task';
import projectRouter from './src/routes/project/project';


const app = express();

// Enable CORS for frontend
app.use(cors({
    origin: 'http://localhost:3000', // Allow frontend domain
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true, // Allow cookies and authentication headers
}));

// Middleware to parse JSON requests
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRouter);
app.use('/api/task', taskRouter);
app.use('/api/project', projectRouter);

// Start the server
app.listen(9000, () => {
    console.log(`Server is running on port 9000`);
});
