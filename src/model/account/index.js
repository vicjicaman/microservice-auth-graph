import * as AccountApi from "Api/account";
import * as AuthApi from "Api/auth";
import * as GraphCommon from "@nebulario/microservice-graph-common";
import * as TokenApi from "PKG/microservice-token";
import * as EmailModel from "Model/email";

export const get = async (username, cxt) => {
  return await AccountApi.get(username, cxt);
};

export const register = async ({ username, email, password }, cxt) => {
  const curr = await AccountApi.get(username, cxt);

  if (curr) {
    throw new Error("account.exists");
  }

  const token = await TokenApi.create(
    { type: "validation", user: { username, email } },
    cxt
  );

  try {
    const user = await AccountApi.create({ username, email, password }, cxt);
    await AuthApi.login(user, cxt);

    cxt.logger.debug("auth.register.token", { username, token });

    const emailOpts = {
      from: "Repoflow validation <no-reply@repoflow.com>",
      to: email,
      subject: "Repoflow Linker validation",
      generateTextFromHTML: true,
      html:
        '<html><body><p>To validate your account click on the next link: <a href="https://blog.repoflow.com/auth/backend/validate?token=' +
        token +
        '" >validate</a> </p> <p>Or go to https://blog.repoflow.com/auth and use the next token:<br/>' +
        token +
        "</p></body></html>",
      text:
        "To validate your account go to https://blog.repoflow.com/auth and use the next token:\n" +
        token
    };

    await EmailModel.send(emailOpts, cxt);
    return user;
  } catch (e) {
    cxt.logger.error("auth.create.error", { username, error: e.toString() });
    throw new Error("account.issue.exists");
  }
};

export const validate = async (viewer, token, cxt) => {
  const payload = await TokenApi.decrypt(token, cxt);
  cxt.logger.debug("auth.validate", { token, payload });

  if (payload) {
    const { type, user } = payload;
    if (type === "validation") {
      await GraphCommon.Queue.sendPayload(
        cxt.services.queue,
        cxt.services.events.queue,
        {
          event: "register",
          user: { username: user.username, email: user.email }
        },
        {},
        cxt
      );

      const valAccount = await AccountApi.get(user.username, cxt);
      await AccountApi.update(valAccount, { status: "active" }, cxt);

      return viewer;
    }
  }

  throw new Error("auth.invalid.token");
};

export const unregister = async (viewer, cxt) => {
  if (!viewer) {
    throw new Error("auth.viewer");
  }

  const { username } = viewer;

  await GraphCommon.Queue.sendPayload(
    cxt.services.queue,
    cxt.services.events.queue,
    {
      event: "unregister",
      user: { username }
    },
    {},
    cxt
  );

  await AuthApi.logout(cxt);
  return await AccountApi.remove(username, cxt);
};

export const login = async cxt => {
  cxt.logger.debug("login");
  return await AuthApi.authenticate(cxt);
};

export const logout = async cxt => {
  return await AuthApi.logout(cxt);
};
