// src/pages/Home.tsx
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Tessera Trading Card Game</h1>
        <p className="text-xl mb-8">Just another Triple Triad Clone</p>
        <button 
          onClick={() => navigate('/game')}
          className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
        >
          Enter the Realm
        </button>
        <button 
            onClick={() => navigate('/admin')}
            className="block w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
          >
            Manage Cards
          </button>
      </main>
    </div>
  );
};

export default Home;