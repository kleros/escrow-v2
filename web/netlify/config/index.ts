const config = {
  /***** jwt variables *****/
  jwtIssuer: process.env.JWT_ISSUER ?? "Kleros", // ex :- Kleros
  jwtAudience: process.env.JWT_AUDIENCE ?? "Escrow", // ex :- Court, Curate, Escrow
  jwtExpTime: process.env.JWT_EXP_TIME ?? "2h",
  jwtSecret: process.env.JWT_SECRET,

  /***** supabase variables *****/
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseApiKey: process.env.SUPABASE_CLIENT_API_KEY,

  /***** ipfs variables *****/
  filebaseToken: process.env.FILEBASE_TOKEN,
  rabbitMqUrl: process.env.RABBITMQ_URL,
};

export default config;
