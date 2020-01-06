const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

export const init = async cxt => {
  const {
    secrets: {
      mail: { client, clientid, refresh }
    }
  } = cxt;

  cxt.logger.debug("mailer.setup", { client, clientid, refresh });

  const oauth2Client = new OAuth2(
    clientid, // ClientID
    client, // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
  );

  oauth2Client.setCredentials({
    refresh_token: refresh
  });
  const accessToken = oauth2Client.getAccessToken();

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "no-reply@repoflow.com",
      clientId: clientid,
      clientSecret: client,
      refreshToken: refresh,
      accessToken: accessToken
    }
  });

  cxt.services.mail = { transport };
};

export const send = async (opts, cxt) => {
  cxt.services.mail.transport.sendMail(opts, (error, response) => {
    error
      ? cxt.logger.error("mail.send.error", { error: error.toString() })
      : cxt.logger.debug("mail.send.response", { response });
  });
};
