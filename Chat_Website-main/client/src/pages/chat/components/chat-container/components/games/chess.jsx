// ChessGame.jsx
import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

const ChessGame = ({ sendMove, opponentMove }) => {
  const [game, setGame] = useState(new Chess());

  const onDrop = (sourceSquare, targetSquare) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Always promote to a queen for simplicity
    });

    if (move === null) return false; // Invalid move

    sendMove(move);
    setGame(new Chess(game.fen())); // Update the game state
    return true;
  };

  useEffect(() => {
    if (opponentMove) {
      game.move(opponentMove);
      setGame(new Chess(game.fen()));
    }
  }, [opponentMove]);

  return (
    <div className="chess-game-container">
      <Chessboard position={game.fen()} onPieceDrop={onDrop} />
    </div>
  );
};

export default ChessGame;
