import * as jwt from "jose";
import config from "../config";

export const authMiddleware = () => {
  return {
    before: async (request) => {
      const { event } = request;

      const authToken = event?.headers?.["x-auth-token"];
      if (!authToken) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Error : Missing x-auth-token in Header" }),
        };
      }

      try {
        if (!config.jwtSecret) {
          throw new Error("Secret not set in environment");
        }

        const encodedSecret = new TextEncoder().encode(config.jwtSecret);

        const { payload } = await jwt.jwtVerify(authToken, encodedSecret, {
          issuer: config.jwtIssuer,
          audience: config.jwtAudience,
        });

        // add auth details to event
        request.event.auth = payload;
      } catch (err) {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: `Error : ${err?.message ?? "Not Authorised"}` }),
        };
      }
    },
  };
};
