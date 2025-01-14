// src/amplify/data/resource.ts
import { ClientSchema, a, defineData } from '@aws-amplify/backend';
import { postConfirmation } from "../auth/post-confirmation/resource";

const schema = a
  .schema({
    // 1. User Model
    UserProfile: a
      .model({
        email: a.string(),
        profileOwner: a.string(),
        createdAt: a.timestamp(),
        // Relationships
        ownedCards: a.hasMany('PlayerCard', 'ownerId'), // References PlayerCard.ownerId
        decks: a.hasMany('Deck', 'ownerId'),           // References Deck.ownerId
      })
      .authorization((allow) => [
        allow.ownerDefinedIn("profileOwner"),
      ]),

    // 2. Card Model (Master List)
    Card: a
      .model({
        name: a.string().required(),
        description: a.string(),
        tier: a.integer(),
        powerTop: a.integer(),
        powerRight: a.integer(),
        powerBottom: a.integer(),
        powerLeft: a.integer(),
        // Relationships
        playerCards: a.hasMany('PlayerCard', 'cardId'), // References PlayerCard.cardId
        deckCards: a.hasMany('DeckCard', 'cardId'),     // References DeckCard.cardId
      })
      .authorization((allow) => [
        allow.guest().to(['read']),
        allow.groups(['admin']).to(['create', 'read', 'update', 'delete']),
      ]),

    // 3. PlayerCard Model (User's Owned Cards)
    PlayerCard: a
      .model({
        ownerId: a.id().required(), // References User.id
        cardId: a.id().required(),  // References Card.id
        quantity: a.integer(),
        // Relationships
        player: a.belongsTo('UserProfile', 'ownerId'), // Belongs to User via ownerId
        card: a.belongsTo('Card', 'cardId'),   // Belongs to Card via cardId
      })
      .authorization((allow) => [
        allow.groups(['admin']).to(['create', 'read', 'update', 'delete']),
        allow.owner()
      ]),

    // 4. Deck Model
    Deck: a
      .model({
        name: a.string().required().default('My New Deck'),
        ownerId: a.id().required(), // References User.id
        // Relationships
        player: a.belongsTo('UserProfile', 'ownerId'),          // Belongs to User via ownerId
        deckCards: a.hasMany('DeckCard', 'deckId'),     // References DeckCard.deckId
      })
      .authorization((allow) => [allow.owner()]),

    // 5. DeckCard Model (Join Table for Deck and Card)
    DeckCard: a
      .model({
        deckId: a.id().required(), // References Deck.id
        cardId: a.id().required(), // References Card.id
        quantityInDeck: a.integer(),
        // Relationships
        deck: a.belongsTo('Deck', 'deckId'), // Belongs to Deck via deckId
        card: a.belongsTo('Card', 'cardId'), // Belongs to Card via cardId
      })
      .authorization((allow) => [allow.owner()]),
  })
  .authorization((allow) => [allow.resource(postConfirmation)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
