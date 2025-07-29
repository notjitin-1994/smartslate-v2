/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly MODE: 'development' | 'production' | 'test';
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  // add more environment variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
