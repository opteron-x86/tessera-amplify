import { ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // User model
  User: a
    .model({
      username: a.string().required(),
      createdAt: a.timestamp(), // "createdAt" or "a.timestamp()" could be used if you store time in a string
      cards: a.hasMany('PlayerCard', 'playerId'),
      decks: a.hasMany('Deck', 'playerId'),

    }).authorization(allow => [allow.owner()]),
    
  // 2) A Card model referencing the master card list
  Card: a
    .model({
      name: a.string().required(),
      description: a.string(),
      tier: a.integer(),
      powerTop: a.integer(),
      powerRight: a.integer(),
      powerBottom: a.integer(),
      powerLeft: a.integer(),
      playerCard: a.hasMany('PlayerCard', 'cardId'),
      Deck: a.hasMany('Deck', 'cardId'),


      }).authorization(allow => [allow.guest()]),

  // 3) A PlayerCard model (join-like model: which user owns which card, quantity, etc.)
  PlayerCard: a
    .model({
      playerId: a.id(),
      player: a.belongsTo('User', 'playerId'),
      cardId: a.id(),
      card: a.belongsTo('Card', 'cardId'),

      // Additional fields
      quantity: a.integer(),
      
    }).authorization(allow => [allow.owner()]),

  // 4) A Deck model referencing a User
  Deck: a
    .model({
      name: a.string().required().default('My New Deck'),
      playerId: a.id(),
      player: a.belongsTo('User', 'playerId'),
      cardId: a.id(),
      card: a.belongsTo('Card', 'cardId'),

    }).authorization(allow => [allow.owner()]),


});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  // Typically, you'd have something like:
  // authorizationModes: { defaultAuthorizationMode: 'userPool', ... }
  // And optionally add an API key mode for 'public()' usage
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    // Must declare an additional mode if you're using .public() or .apiKey() for read/list
    // additionalAuthorizationModes: [{ mode: 'apiKey' }],
  },
});
