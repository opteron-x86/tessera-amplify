import Card from './Card';

interface BoardProps {
  // 3x3 grid of card data or null for empty spaces
  grid: Array<{
    id: string;
    name: string;
    ranks: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    owner?: 'player1' | 'player2';
  } | null>;
  onCellClick?: (index: number) => void;
  currentPlayer: 'player1' | 'player2';
}

const Board = ({ grid, onCellClick }: BoardProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800 rounded-lg">
      {grid.map((card, index) => (
        <div 
          key={index}
          className="w-24 h-32 flex items-center justify-center"
          onClick={() => !card && onCellClick?.(index)}
        >
          {card ? (
            <Card
              name={card.name}
              ranks={card.ranks}
              owner={card.owner}
            />
          ) : (
            // Empty cell placeholder
            <div className="w-full h-full border-2 border-dashed border-gray-600 rounded-lg" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Board;