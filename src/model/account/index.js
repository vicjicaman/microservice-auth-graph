import { request } from "graphql-request";

const ACCOUNT_GET = `query ACCOUNT_GET($username: String!) {
  viewer {
    id
    account {
      get(username: $username) {
        id
        username
        email
      }
    }
  }
}`;

const ACCOUNT_CREATE = `mutation ACCOUNT_CREATE($username: String!, $email: String!, $password: String!) {
  viewer {
    id
    account {
      add(username: $username, email: $email, password: $password) {
        id
        username
        email
      }
    }
  }
}`;

const Model = {
  get: async (viewer, { username }, cxt) => {
    const {
      viewer: {
        account: { get: user }
      }
    } = await request(cxt.services.accounts.url, ACCOUNT_GET, {
      username
    });

    return user;
  },
  register: async (viewer, { username, email, password }, cxt) => {
    const {
      viewer: {
        account: { add:user }
      }
    } = await request(cxt.services.accounts.url, ACCOUNT_CREATE, {
      username,
      email,
      password
    });

    return user;
  }
};

const Schema = [
  `
  type Account {
    id: ID
    username: String!
    name: String
    email: String!
    created_at: DateTime
  }
  `
];

export { Schema, Model };
