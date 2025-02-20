import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import uploadRoutes from './routes/upload';
import filesRoutes from './routes/files';
import { socketHandler } from './socket';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: { origin: '*' }
});

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
app.use('/uploads', filesRoutes);

io.on('connection', socketHandler);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || '';


mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
