/// <reference types="vite/client" />

interface ImportMetaEnv {
    ALCHEMY_API_KEY: string;
    INFURA_API_KEY?: string; //optional, fallback RPC
    WALLETCONNECT_PROJECT_ID: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }