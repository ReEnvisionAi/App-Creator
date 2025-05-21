```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_OPENAI_API_URL: string
  readonly VITE_OPENAI_MODEL: string
  readonly VITE_HELICONE_API_KEY: string
  readonly VITE_DATABASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```