// src/amplify/data/resolvers/createUser.ts
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../resource';

const client = generateClient<Schema>();

/**
 * Creates a user record if it doesn't exist
 * This function should be called after successful authentication
 */
export const createUserIfNotExists = async (
  userId: string,
  username: string
) => {
  try {
    // Check if user already exists
    const existingUser = await client.models.User.get({ id: userId });

    // If user doesn't exist, create new user record
    if (!existingUser.data) {
      await client.models.User.create({
        id: userId,
        username: username,
        createdAt: Date.now()
      });
    }

    return true;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};