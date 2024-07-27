const config = {
  /***** jwt variables *****/
  jwtIssuer: import.meta.env.JWT_ISSUER ?? "Kleros", // ex :- Kleros
  jwtAudience: import.meta.env.JWT_AUDIENCE ?? "Escrow", // ex :- Court, Curate, Escrow
  jwtExpTime: import.meta.env.JWT_EXP_TIME ?? "2h",
  jwtSecret: import.meta.env.JWT_SECRET,

  /***** supabase variables *****/
  supabaseUrl: import.meta.env.SUPABASE_URL,
  supabaseApiKey: import.meta.env.SUPABASE_CLIENT_API_KEY,

  /***** ipfs variables *****/
  filebaseToken: import.meta.env.FILEBASE_TOKEN,
  rabbitMqUrl: import.meta.env.RABBITMQ_URL,
};

export default config;
