import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import Card from './Card';

const client = generateClient<Schema>();

interface CardListProps {
  onEditCard: (card: Schema['Card']['type']) => void;
}

const CardList = ({ onEditCard }: CardListProps) => {
  const [cards, setCards] = useState<Array<Schema['Card']['type']>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const loadCards = async () => {
      try {
        const response = await client.models.Card.list();
        setCards(response.data);
      } catch (err) {
        console.error('Error loading cards:', err);
        setError('Failed to load cards');
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, []);

  const handleDeleteCard = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        await client.models.Card.delete({ id });
        setCards(cards.filter(card => card.id !== id));
      } catch (err) {
        console.error('Error deleting card:', err);
        alert('Failed to delete card');
      }
    }
  };

  if (loading) return <div className="text-white">Loading cards...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map(card => (
        <div key={card.id} className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-center mb-4">
            <Card
              name={card.name}
              ranks={{
                top: card.powerTop ?? 0,
                right: card.powerRight ?? 0,
                bottom: card.powerBottom ?? 0,
                left: card.powerLeft ?? 0
              }}
            />
          </div>
          <div className="text-white">
            <h3 className="font-bold">{card.name}</h3>
            <p className="text-sm text-gray-400 mb-2">{card.description}</p>
            <p className="text-sm">Tier: {card.tier}</p>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => onEditCard(card)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteCard(card.id)}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardList;