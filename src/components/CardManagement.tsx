import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import Card from './Card';
import CardList from './CardList';

const client = generateClient<Schema>();

interface CardFormData {
  id?: string;
  name: string;
  description: string;
  tier: number;
  powerTop: number;
  powerRight: number;
  powerBottom: number;
  powerLeft: number;
}

const emptyFormData: CardFormData = {
  name: '',
  description: '',
  tier: 1,
  powerTop: 1,
  powerRight: 1,
  powerBottom: 1,
  powerLeft: 1
};

const CardManagement = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CardFormData>(emptyFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    if (['tier', 'powerTop', 'powerRight', 'powerBottom', 'powerLeft'].includes(name)) {
      parsedValue = parseInt(value) || 0;
    }

    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && formData.id) {
        await client.models.Card.update({
          id: formData.id,
          ...formData
        });
      } else {
        await client.models.Card.create(formData);
      }
      
      // Reset form and state
      setFormData(emptyFormData);
      setShowForm(false);
      setIsEditing(false);
      
    } catch (error) {
      console.error('Error saving card:', error);
      alert('Failed to save card');
    }
  };

  const handleEditCard = (card: Schema['Card']['type']) => {
    setFormData({
      id: card.id,
      name: card.name,
      description: card.description ?? '',
      tier: card.tier ?? 1,
      powerTop: card.powerTop ?? 1,
      powerRight: card.powerRight ?? 1,
      powerBottom: card.powerBottom ?? 1,
      powerLeft: card.powerLeft ?? 1
    });
    setIsEditing(true);
    setShowForm(true);
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      {!showForm && (
        <div className="flex justify-end">
          <button
            onClick={() => {
              setFormData(emptyFormData);
              setIsEditing(false);
              setShowForm(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Create New Card
          </button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="p-6 bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? 'Edit Card' : 'Create New Card'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setFormData(emptyFormData);
                setIsEditing(false);
              }}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">Tier</label>
                <input
                  type="number"
                  name="tier"
                  value={formData.tier}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  className="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200">Top Power</label>
                  <input
                    type="number"
                    name="powerTop"
                    value={formData.powerTop}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    className="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200">Right Power</label>
                  <input
                    type="number"
                    name="powerRight"
                    value={formData.powerRight}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    className="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200">Bottom Power</label>
                  <input
                    type="number"
                    name="powerBottom"
                    value={formData.powerBottom}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    className="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200">Left Power</label>
                  <input
                    type="number"
                    name="powerLeft"
                    value={formData.powerLeft}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    className="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {isEditing ? 'Update Card' : 'Create Card'}
              </button>
            </form>

            <div className="flex flex-col items-center">
              <h3 className="text-xl font-bold mb-4 text-white">Preview</h3>
              <div className="transform scale-150">
                <Card
                  name={formData.name}
                  ranks={{
                    top: formData.powerTop,
                    right: formData.powerRight,
                    bottom: formData.powerBottom,
                    left: formData.powerLeft
                  }}
                />
              </div>
              <div className="mt-4 text-sm text-gray-300">
                Tier: {formData.tier}
                {formData.description && (
                  <p className="mt-2 italic">{formData.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card List */}
      {!showForm && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Card Collection</h2>
          <CardList onEditCard={handleEditCard} />
        </div>
      )}
    </div>
  );
};

export default CardManagement;