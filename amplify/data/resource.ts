import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Project: a.model({
    title: a.string().required(),
    description: a.string(),
    status: a.string().required(),
  })
  .authorization(allow => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
