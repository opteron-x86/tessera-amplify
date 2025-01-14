// src/components/PlayerCardManagement.tsx
import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../amplify/data/resource';
import Card from './Card';

const client = generateClient<Schema>();

interface UserType {
  id: string;
  username: string;
}

interface CardType {
  id: string;
  name: string;
  powerTop: number | null;
  powerRight: number | null;
  powerBottom: number | null;
  powerLeft: number | null;
}

interface PlayerCardType {
  id: string;
  cardId: string;
  ownerId: string;
  quantity: number;
  card?: CardType | null;
}

const PlayerCardManagement: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [cards, setCards] = useState<CardType[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [playerCards, setPlayerCards] = useState<PlayerCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users and cards on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, cardsResponse] = await Promise.all([
          client.models.UserProfile.list({
            selectionSet: ['id', 'profileOwner']
          }),
          client.models.Card.list({
            selectionSet: ['id', 'name', 'powerTop', 'powerRight', 'powerBottom', 'powerLeft']
          })
        ]);

        if (usersResponse.data) {
          setUsers(usersResponse.data.map(user => ({
            id: user.id,
            username: user.profileOwner ?? ''
          })));
        }

        if (cardsResponse.data) {
          setCards(cardsResponse.data.map(card => ({
            id: card.id,
            name: card.name,
            powerTop: card.powerTop ?? null,
            powerRight: card.powerRight ?? null,
            powerBottom: card.powerBottom ?? null,
            powerLeft: card.powerLeft ?? null
          })));
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch player cards when user is selected
  useEffect(() => {
    if (!selectedUser) {
      setPlayerCards([]);
      return;
    }

    const fetchPlayerCards = async () => {
      try {
        const response = await client.models.PlayerCard.list({
          filter: { ownerId: { eq: selectedUser } },
          selectionSet: [
            'id',
            'cardId',
            'ownerId',
            'quantity',
            'card.id',
            'card.name',
            'card.powerTop',
            'card.powerRight',
            'card.powerBottom',
            'card.powerLeft'
          ]
        });

        if (response.data) {
          const typedPlayerCards: PlayerCardType[] = response.data.map(pc => ({
            id: pc.id,
            cardId: pc.cardId,
            ownerId: pc.ownerId,
            quantity: pc.quantity ?? 0,
            card: pc.card ? {
              id: pc.card.id,
              name: pc.card.name,
              powerTop: pc.card.powerTop ?? null,
              powerRight: pc.card.powerRight ?? null,
              powerBottom: pc.card.powerBottom ?? null,
              powerLeft: pc.card.powerLeft ?? null
            } : null
          }));
          setPlayerCards(typedPlayerCards);
        }
      } catch (err) {
        console.error('Error fetching player cards:', err);
        setError('Failed to load player cards');
      }
    };

    fetchPlayerCards();
  }, [selectedUser]);

  const handleAddCard = async () => {
    if (!selectedUser || !selectedCard) return;

    try {
      // Check if player already has this card
      const existingCard = playerCards.find(pc => pc.cardId === selectedCard);

      if (existingCard) {
        // Update existing card quantity
        const updatedCard = await client.models.PlayerCard.update({
          id: existingCard.id,
          quantity: existingCard.quantity + quantity
        });

        if (updatedCard.data) {
          setPlayerCards(playerCards.map(pc => 
            pc.id === existingCard.id 
              ? { ...pc, quantity: (pc.quantity + quantity) }
              : pc
          ));
        }
      } else {
        // Create new player card
        const response = await client.models.PlayerCard.create({
          cardId: selectedCard,
          ownerId: selectedUser,
          quantity: quantity
        });

        if (response.data) {
          const card = cards.find(c => c.id === selectedCard);
          const newPlayerCard: PlayerCardType = {
            id: response.data.id,
            cardId: selectedCard,
            ownerId: selectedUser,
            quantity: quantity,
            card: card ?? null
          };
          setPlayerCards([...playerCards, newPlayerCard]);
        }
      }

      // Reset form
      setSelectedCard('');
      setQuantity(1);
    } catch (err) {
      console.error('Error adding card:', err);
      setError('Failed to add card to player');
    }
  };

  const handleRemoveCard = async (playerCardId: string) => {
    if (!window.confirm('Are you sure you want to remove this card?')) return;

    try {
      await client.models.PlayerCard.delete({
        id: playerCardId
      });
      setPlayerCards(playerCards.filter(pc => pc.id !== playerCardId));
    } catch (err) {
      console.error('Error removing card:', err);
      setError('Failed to remove card from player');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Manage Player Cards</h2>

      {/* User Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Select Player</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border-gray-600"
        >
          <option value="">Select a player...</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      {selectedUser && (
        <>
          {/* Add Card Form */}
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Add Card to Player</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={selectedCard}
                onChange={(e) => setSelectedCard(e.target.value)}
                className="p-2 rounded bg-gray-700 border-gray-600"
              >
                <option value="">Select a card...</option>
                {cards.map(card => (
                  <option key={card.id} value={card.id}>
                    {card.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className="p-2 rounded bg-gray-700 border-gray-600"
              />
              <button
                onClick={handleAddCard}
                disabled={!selectedCard}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Add Card
              </button>
            </div>
          </div>

          {/* Player's Card Collection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Player's Collection</h3>
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
                    <button
                      onClick={() => handleRemoveCard(playerCard.id)}
                      className="absolute bottom-0 right-0 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-tl"
                    >
                      Remove
                    </button>
                  </div>
                )
              ))}
            </div>
            {playerCards.length === 0 && (
              <div className="text-center text-gray-400 py-4">
                This player has no cards yet
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerCardManagement;