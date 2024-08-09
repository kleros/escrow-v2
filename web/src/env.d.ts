/// <reference types="vite/client" />

interface ImportMetaEnv {
    ALCHEMY_API_KEY: string;
    WALLETCONNECT_PROJECT_ID: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }