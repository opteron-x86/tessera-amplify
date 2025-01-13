// src/pages/PlayerDashboard.tsx
import React, { useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import PlayerInventory from '../components/PlayerInventory';
import DeckManager from '../components/DeckManager';

const PlayerDashboard: React.FC = () => {
  const { user, signOut } = useAuthenticator();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'inventory' | 'decks'>('inventory');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl">Player Dashboard - {user?.signInDetails?.loginId}</h1>
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/game')}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
            >
              Play Game
            </button>
            <button 
              onClick={handleSignOut}
              className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded ${
              activeTab === 'inventory' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Card Collection
          </button>
          <button
            onClick={() => setActiveTab('decks')}
            className={`px-4 py-2 rounded ${
              activeTab === 'decks' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Deck Manager
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-gray-800 rounded-lg p-6">
          {activeTab === 'inventory' ? (
            <PlayerInventory />
          ) : (
            <DeckManager />
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerDashboard;