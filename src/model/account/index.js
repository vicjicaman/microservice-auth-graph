import { request } from "graphql-request";

const ACCOUNT_GET = `query ACCOUNT_GET($username: String!) {
  viewer {
    id
    account {
      get(username: $username) {
        id
        username
        email
        created_at
      }
    }
  }
}`;

const ACCOUNT_CREATE = `mutation ACCOUNT_CREATE($username: String!, $email: String!, $password: String!) {
  viewer {
    id
    account {
      create(username: $username, email: $email, password: $password) {
        id
        username
        email
      }
    }
  }
}`;


const ACCOUNT_DELETE = `mutation ACCOUNT_DELETE($username: String!) {
  viewer {
    id
    account {
      delete(username: $username)
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
        account: { create: user }
      }
    } = await request(cxt.services.accounts.url, ACCOUNT_CREATE, {
      username,
      email,
      password
    });

    return user;
  },
  unregister: async ({ username }, args, cxt) => {
    if (!username) {
      throw new Error("NO_AUTH_USER");
    }

    const {
      viewer: {
        account: { delete: delres }
      }
    } = await request(cxt.services.accounts.url, ACCOUNT_DELETE, {
      username
    });

    return delres;
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
