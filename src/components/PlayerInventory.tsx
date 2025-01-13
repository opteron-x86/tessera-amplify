// src/components/PlayerInventory.tsx
import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from '../../amplify/data/resource';
import Card from './Card';

const client = generateClient<Schema>();

// Define interfaces for our data structures
interface CardType {
  id: string;
  name: string;
  description?: string;
  tier?: number;
  powerTop?: number;
  powerRight?: number;
  powerBottom?: number;
  powerLeft?: number;
}

interface PlayerCardType {
  id: string;
  cardId: string;
  quantity: number;
  card?: CardType;
}

const PlayerInventory: React.FC = () => {
  const { user } = useAuthenticator();
  const [playerCards, setPlayerCards] = useState<PlayerCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerCards = async () => {
      try {
        // Fetch player's cards with related card data
        const response = await client.models.PlayerCard.list({
          selectionSet: [
            'id', 
            'cardId', 
            'quantity',
            'card.id',
            'card.name',
            'card.description',
            'card.tier',
            'card.powerTop',
            'card.powerRight',
            'card.powerBottom',
            'card.powerLeft'
          ]
        });

        if (response.data) {
          setPlayerCards(response.data as PlayerCardType[]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching player cards:', err);
        setError('Failed to load your card collection');
        setLoading(false);
      }
    };

    fetchPlayerCards();
  }, [user]);

  if (loading) {
    return <div className="text-center p-4">Loading your collection...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!playerCards.length) {
    return (
      <div className="text-center p-4">
        <p>You don't have any cards yet!</p>
        {/* We'll add a button/link to card acquisition here later */}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your Collection</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {playerCards.map((playerCard) => (
          playerCard.card && (
            <div key={playerCard.id} className="relative">
              <Card
                name={playerCard.card.name}
                ranks={{
                  top: playerCard.card.powerTop ?? 1,
                  right: playerCard.card.powerRight ?? 1,
                  bottom: playerCard.card.powerBottom ?? 1,
                  left: playerCard.card.powerLeft ?? 1
                }}
              />
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-2 py-1 rounded-bl">
                x{playerCard.quantity}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default PlayerInventory;