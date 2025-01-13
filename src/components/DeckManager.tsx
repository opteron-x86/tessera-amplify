// src/components/DeckManager.tsx
import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

// Define interfaces for our data structures
interface CardType {
  id: string;
  name: string;
  powerTop: number | null;
  powerRight: number | null;
  powerBottom: number | null;
  powerLeft: number | null;
}

interface DeckCardType {
  id: string;
  cardId: string;
  deckId: string;
  quantityInDeck: number | null;
  card?: CardType | null;
}

interface DeckType {
  id: string;
  name: string;
  ownerId: string;
  deckCards?: DeckCardType[];
}

const DeckManager: React.FC = () => {
  const { user } = useAuthenticator();
  const [decks, setDecks] = useState<DeckType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newDeckName, setNewDeckName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Fetch user's decks
  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await client.models.Deck.list({
          selectionSet: [
            'id',
            'name', 
            'ownerId',
            'deckCards.id',
            'deckCards.cardId',
            'deckCards.quantityInDeck',
            'deckCards.card.id',
            'deckCards.card.name',
            'deckCards.card.powerTop',
            'deckCards.card.powerRight',
            'deckCards.card.powerBottom',
            'deckCards.card.powerLeft'
          ]
        });

        if (response.data) {
          const typedDecks: DeckType[] = response.data.map(deck => ({
            id: deck.id,
            name: deck.name,
            ownerId: deck.ownerId,
            deckCards: deck.deckCards?.map((dc: { 
              id: string;
              cardId: string;
              quantityInDeck: number | null;
              card?: {
                id: string;
                name: string;
                powerTop: number | null;
                powerRight: number | null;
                powerBottom: number | null;
                powerLeft: number | null;
              } | null;
            }) => ({
              id: dc.id,
              cardId: dc.cardId,
              deckId: deck.id,
              quantityInDeck: dc.quantityInDeck ?? null,
              card: dc.card ? {
                id: dc.card.id,
                name: dc.card.name,
                powerTop: dc.card.powerTop ?? null,
                powerRight: dc.card.powerRight ?? null,
                powerBottom: dc.card.powerBottom ?? null,
                powerLeft: dc.card.powerLeft ?? null
              } : null
            }))
          }));
          setDecks(typedDecks);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching decks:', err);
        setError('Failed to load your decks');
        setLoading(false);
      }
    };

    fetchDecks();
  }, []);

  // Create new deck
  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckName.trim() || !user) return;

    setIsCreating(true);
    try {
      const response = await client.models.Deck.create({
        name: newDeckName.trim(),
        ownerId: user.userId
      });
      
      if (response.data) {
        const newDeck: DeckType = {
          id: response.data.id,
          name: response.data.name,
          ownerId: response.data.ownerId,
          deckCards: []
        };
        setDecks([...decks, newDeck]);
      }
      setNewDeckName('');
      setIsCreating(false);
    } catch (err) {
      console.error('Error creating deck:', err);
      setError('Failed to create deck');
      setIsCreating(false);
    }
  };

  // Delete deck
  const handleDeleteDeck = async (deckId: string) => {
    if (!window.confirm('Are you sure you want to delete this deck?')) return;

    try {
      await client.models.Deck.delete({
        id: deckId
      });
      setDecks(decks.filter(deck => deck.id !== deckId));
    } catch (err) {
      console.error('Error deleting deck:', err);
      setError('Failed to delete deck');
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading your decks...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Decks</h2>
        
        {/* New Deck Form */}
        <form onSubmit={handleCreateDeck} className="flex gap-2">
          <input
            type="text"
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
            placeholder="New Deck Name"
            className="px-3 py-2 border rounded bg-gray-700 text-white"
            disabled={isCreating}
          />
          <button
            type="submit"
            disabled={isCreating || !newDeckName.trim()}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Create Deck
          </button>
        </form>
      </div>

      {/* Deck List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.map((deck) => (
          <div key={deck.id} className="p-4 bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold">{deck.name}</h3>
              <div className="space-x-2">
                <button
                  onClick={() => {/* TODO: Open DeckBuilder */}}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteDeck(deck.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="text-gray-300">
              {deck.deckCards?.length 
                ? `${deck.deckCards.length} cards`
                : 'No cards yet'}
            </div>
          </div>
        ))}
      </div>

      {decks.length === 0 && (
        <div className="text-center p-4 text-gray-400">
          You haven't created any decks yet. Create your first deck to get started!
        </div>
      )}
    </div>
  );
};

export default DeckManager;