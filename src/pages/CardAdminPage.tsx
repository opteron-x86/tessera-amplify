// src/pages/CardAdminPage.tsx
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CardManagement from '../components/CardManagement';
import PlayerCardManagement from '../components/PlayerCardManagement';

const CardAdminPage = () => {
  const { user, signOut } = useAuthenticator();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'cards' | 'players'>('cards');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl">Tessera Card Admin - {user?.username}</h1>
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/game')}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
            >
              Back to Game
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
            onClick={() => setActiveTab('cards')}
            className={`px-4 py-2 rounded ${
              activeTab === 'cards' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Manage Cards
          </button>
          <button
            onClick={() => setActiveTab('players')}
            className={`px-4 py-2 rounded ${
              activeTab === 'players' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Manage Player Cards
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-gray-800 rounded-lg p-6">
          {activeTab === 'cards' ? (
            <CardManagement />
          ) : (
            <PlayerCardManagement />
          )}
        </div>
      </div>
    </div>
  );
};

export default CardAdminPage;