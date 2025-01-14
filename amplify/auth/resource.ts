import { defineAuth } from '@aws-amplify/backend';
import { postConfirmation } from './post-confirmation/resource';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  
  triggers: {
    postConfirmation
  },

  userAttributes: {
      preferredUsername: {
      mutable: false,
      required: true
    },
    "custom:display_name": {
      dataType: "String",
      maxLen: 32,
      minLen: 4,
      mutable: false,
    },
    "custom:subscription": {
      dataType: "Boolean",
      mutable: true,
    }
  }


});
