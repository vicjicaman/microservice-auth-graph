import jwt from "jsonwebtoken";

export const create = async (payload, cxt) => {
  const {
    secrets: {
      token: { private: privateKey }
    }
  } = cxt;

  return jwt.sign(payload, privateKey, {
    algorithm: "RS256"
  });
};

export const decrypt = async (token, cxt) => {
  try {
    return jwt.verify(token, publicKey(cxt), {
      algorithm: "RS256"
    });
  } catch (e) {
    cxt.logger.error("token.error", { error: e.toString(), token });
    return null;
  }
};

export const publicKey = ({
  secrets,
  secrets: {
    token: { public: publicKey }
  }
}) => publicKey;
