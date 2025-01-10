interface CardProps {
  // Card data
  name?: string;
  ranks?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  // Display options
  faceDown?: boolean;
  isPlayable?: boolean;
  owner?: 'player1' | 'player2';
  onClick?: () => void;
}

const Card = ({ 
  name = 'Unknown',
  ranks = { top: 0, right: 0, bottom: 0, left: 0 },
  faceDown = false,
  isPlayable = false,
  owner,
  onClick 
}: CardProps) => {
  // Determine card background color based on owner
  const bgColor = owner === 'player1' 
    ? 'bg-blue-600'
    : owner === 'player2'
      ? 'bg-red-600'
      : 'bg-gray-700';

  return (
    <div 
      onClick={isPlayable ? onClick : undefined}
      className={`
        relative w-24 h-32 
        ${bgColor}
        rounded-lg shadow-lg 
        ${isPlayable ? 'cursor-pointer hover:scale-105 transition-transform' : ''}
        ${faceDown ? 'bg-gray-800' : ''}
      `}
    >
      {!faceDown && (
        <>
          {/* Card Name */}
          <div className="absolute top-2 left-2 right-2 text-center text-xs text-white font-bold truncate">
            {name}
          </div>

          {/* Rank Numbers */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Top rank */}
            <div className="absolute top-6 text-white font-bold">
              {ranks.top}
            </div>
            
            {/* Right rank */}
            <div className="absolute right-2 text-white font-bold">
              {ranks.right}
            </div>
            
            {/* Bottom rank */}
            <div className="absolute bottom-6 text-white font-bold">
              {ranks.bottom}
            </div>
            
            {/* Left rank */}
            <div className="absolute left-2 text-white font-bold">
              {ranks.left}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Card;