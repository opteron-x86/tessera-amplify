import Card from './Card';

interface HandProps {
  cards: Array<{
    id: string;
    name: string;
    ranks: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  }>;
  onCardSelect: (cardId: string) => void;
  selectedCardId?: string;
  owner: 'player1' | 'player2';
}

const Hand = ({ cards, onCardSelect, selectedCardId, owner }: HandProps) => {
  return (
    <div className="flex gap-4 p-4 bg-gray-800 rounded-lg overflow-x-auto">
      {cards.map((card) => (
        <div 
          key={card.id}
          className={`
            transition-transform duration-200
            ${selectedCardId === card.id ? 'transform -translate-y-4' : ''}
          `}
        >
          <Card
            name={card.name}
            ranks={card.ranks}
            isPlayable={true}
            owner={owner}
            onClick={() => onCardSelect(card.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default Hand;