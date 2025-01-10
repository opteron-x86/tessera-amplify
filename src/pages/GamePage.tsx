// src/pages/GamePage.tsx
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Board from '../components/GameBoard';
import Hand from '../components/PlayerHand';

// Temporary mock data until we connect to the backend
const MOCK_PLAYER_HAND = [
  {
    id: '1',
    name: 'Dragon',
    ranks: { top: 8, right: 4, bottom: 7, left: 1 }
  },
  {
    id: '2',
    name: 'Knight',
    ranks: { top: 6, right: 6, bottom: 6, left: 6 }
  },
  {
    id: '3',
    name: 'Wizard',
    ranks: { top: 9, right: 2, bottom: 3, left: 7 }
  },
  {
    id: '4',
    name: 'Goblin',
    ranks: { top: 3, right: 5, bottom: 8, left: 4 }
  },
];

const GamePage = () => {
  const { user, signOut } = useAuthenticator();
  const navigate = useNavigate();
  
  // Game state
  const [selectedCardId, setSelectedCardId] = useState<string>();
  const [board, setBoard] = useState<Array<{
    id: string;
    name: string;
    ranks: { top: number; right: number; bottom: number; left: number };
    owner: 'player1' | 'player2';
  } | null>>(Array(9).fill(null));

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleCellClick = (index: number) => {
    if (!selectedCardId) return;
    
    const selectedCard = MOCK_PLAYER_HAND.find(card => card.id === selectedCardId);
    if (!selectedCard) return;

    // Place card on board
    const newBoard = [...board];
    newBoard[index] = {
      ...selectedCard,
      owner: 'player1'  // Current player
    };
    setBoard(newBoard);
    setSelectedCardId(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl">Tessera - {user?.signInDetails?.loginId}</h1>
          <button 
            onClick={handleSignOut}
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
          >
            Sign out
          </button>
        </header>

        {/* Game Area */}
        <div className="flex flex-col items-center gap-8">
          {/* Score display placeholder */}
          <div className="flex justify-between w-full px-4">
            <div>Player 1: 0</div>
            <div>Player 2: 0</div>
          </div>

          {/* Game board */}
          <Board 
            grid={board}
            onCellClick={handleCellClick}
            currentPlayer="player1"
          />

          {/* Player's hand */}
          <div className="w-full">
            <h2 className="text-xl mb-4">Your Cards</h2>
            <Hand
              cards={MOCK_PLAYER_HAND}
              onCardSelect={setSelectedCardId}
              selectedCardId={selectedCardId}
              owner="player1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;