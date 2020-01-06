import { request } from "graphql-request";

const ACCOUNT_GET = `query ACCOUNT_GET($username: String!) {
  viewer {
    id
    accounts {
      get(username: $username) {
        id
        username
        email
        status
        created_at
      }
    }
  }
}`;

const ACCOUNT_CREATE = `mutation ACCOUNT_CREATE($username: String!, $email: String!, $password: String!) {
  viewer {
    id
    accounts {
      create(username: $username, email: $email, password: $password) {
        id
        username
        email
        status
      }
    }
  }
}`;

const ACCOUNT_UPDATE_STATUS = `mutation ACCOUNT_UPDATE_STATUS($username: String!, $status: String!) {
  viewer {
    id
    accounts {
      account (username: $username) {
        update (status: $status) {
          id
          username
          email
          status
        }
      }
    }
  }
}`;

const ACCOUNT_DELETE = `mutation ACCOUNT_DELETE($username: String!) {
  viewer {
    id
    accounts {
      account (username: $username) {
        remove
      }
    }
  }
}`;

export const get = async (username, cxt) => {
  const {
    viewer: {
      accounts: { get: user }
    }
  } = await request(cxt.services.accounts.url, ACCOUNT_GET, {
    username
  });

  return user;
};

export const create = async ({ username, email, password }, cxt) => {
  const {
    viewer: {
      accounts: { create: user }
    }
  } = await request(cxt.services.accounts.url, ACCOUNT_CREATE, {
    username,
    email,
    password
  });

  return user;
};

export const update = async (account, { status }, cxt) => {
  const {
    viewer: {
      accounts: {
        account: { update: updated }
      }
    }
  } = await request(cxt.services.accounts.url, ACCOUNT_UPDATE_STATUS, {
    username: account.username,
    status
  });

  return updated;
};

export const remove = async (username, cxt) => {
  const {
    viewer: {
      accounts: {
        account: { remove: delres }
      }
    }
  } = await request(cxt.services.accounts.url, ACCOUNT_DELETE, {
    username
  });

  return delres;
};
