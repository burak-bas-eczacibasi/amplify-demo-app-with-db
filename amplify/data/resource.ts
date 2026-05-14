import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Project: a.model({
    title: a.string().required(),
    description: a.string(),
    status: a.enum(['Not Started', 'In Progress', 'Completed']),
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
