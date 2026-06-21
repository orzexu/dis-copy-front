/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SOCKET_PERSONAL_CHAT_URL: string;
  readonly VITE_SOCKET_SERVER_CHAT_URL: string;
  readonly VITE_DOMEN_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}