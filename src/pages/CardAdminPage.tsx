// src/pages/CardAdminPage.tsx
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import CardManagement from '../components/CardManagement';

const CardAdminPage = () => {
  const { user, signOut } = useAuthenticator();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl">Tessera Card Admin - {user?.signInDetails?.loginId}</h1>
          <button 
            onClick={handleSignOut}
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
          >
            Sign out
          </button>
        </header>
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/game')}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
            >
              Back to Game
            </button>
          </div>

        <CardManagement />
      </div>
    </div>
  );
};

export default CardAdminPage;