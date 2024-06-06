import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { createClient } from "@supabase/supabase-js";
import * as jwt from "jose";
import { SiweMessage } from "siwe";

import { DEFAULT_CHAIN } from "consts/chains";
import { ETH_SIGNATURE_REGEX } from "consts/index";

import { netlifyUri, netlifyDeployUri, netlifyDeployPrimeUri } from "src/generatedNetlifyInfo.json";
import { Database } from "src/types/supabase-notification";

import config from "../config";

const authUser = async (event) => {
  try {
    if (!event.body) {
      throw new Error("No body provided");
    }

    const signature = event?.body?.signature;
    if (!signature) {
      throw new Error("Missing key : signature");
    }

    if (!ETH_SIGNATURE_REGEX.test(signature)) {
      throw new Error("Invalid signature");
    }

    const message = event?.body?.message;
    if (!message) {
      throw new Error("Missing key : message");
    }

    const address = event?.body?.address;
    if (!address) {
      throw new Error("Missing key : address");
    }

    const siweMessage = new SiweMessage(message);

    if (
      !(
        (netlifyUri && netlifyUri === siweMessage.uri) ||
        (netlifyDeployUri && netlifyDeployUri === siweMessage.uri) ||
        (netlifyDeployPrimeUri && netlifyDeployPrimeUri === siweMessage.uri)
      )
    ) {
      console.debug(
        `Invalid URI: expected one of [${netlifyUri} ${netlifyDeployUri} ${netlifyDeployPrimeUri}] but got ${siweMessage.uri}`
      );
      throw new Error(`Invalid URI`);
    }

    if (siweMessage.chainId !== DEFAULT_CHAIN) {
      console.debug(`Invalid chain ID: expected ${DEFAULT_CHAIN} but got ${siweMessage.chainId}`);
      throw new Error(`Invalid chain ID`);
    }

    const lowerCaseAddress = siweMessage.address.toLowerCase();
    if (lowerCaseAddress !== address.toLowerCase()) {
      throw new Error("Address mismatch in provided address and message");
    }

    if (!config.supabaseUrl || !config.supabaseApiKey) {
      throw new Error("Supabase URL or API key is undefined");
    }
    const supabase = createClient<Database>(config.supabaseUrl, config.supabaseApiKey);

    // get nonce from db, if its null that means it was already used
    const { error: nonceError, data: nonceData } = await supabase
      .from("user-nonce")
      .select("nonce")
      .eq("address", lowerCaseAddress)
      .single();

    if (nonceError || !nonceData?.nonce) {
      throw new Error("Unable to fetch nonce from DB");
    }

    try {
      await siweMessage.verify({ signature, nonce: nonceData.nonce, time: new Date().toISOString() });
    } catch (err) {
      throw new Error("Invalid signer");
    }

    const { error } = await supabase.from("user-nonce").delete().match({ address: lowerCaseAddress });

    if (error) {
      throw new Error("Error updating nonce in DB");
    }

    if (!config.jwtSecret) {
      throw new Error("Secret not set in environment");
    }
    // user verified, generate auth token
    const encodedSecret = new TextEncoder().encode(config.jwtSecret);

    const token = await new jwt.SignJWT({ id: address.toLowerCase() })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuer(config.jwtIssuer)
      .setAudience(config.jwtAudience)
      .setExpirationTime(config.jwtExpTime)
      .sign(encodedSecret);

    return { statusCode: 200, body: JSON.stringify({ message: "User authorised", token }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: `${err}` }) };
  }
};

export const handler = middy(authUser).use(jsonBodyParser());
