import express from 'express';
import Game from '../models/Game.js'; // Make sure this path is correct
import { verifyToken } from '../middlewares/AuthMiddleware.js'; // Ensure you have token verification

const router = express.Router();

// Create a new game
router.post('/', verifyToken, async (req, res) => {
  try {
    const { sender, recipient, gameName } = req.body;

    const newGame = new Game({
      sender,
      recipient,
      gameName,
    });

    const savedGame = await newGame.save();
    return res.status(201).json(savedGame);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
});

export default router;
