/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  readonly VITE_OVERPASS_API_URL: string
  readonly VITE_OPENSTREETMAP_BASE_URL: string
  readonly VITE_OLLAMA_BASE_URL: string
  readonly VITE_OLLAMA_MODEL: string
  readonly VITE_RECIPE_MODEL: string
  readonly VITE_SEARCH_MODEL: string
  readonly VITE_DEFAULT_SEARCH_RADIUS: string
  readonly VITE_MAX_RESTAURANTS: string
  readonly VITE_GEOLOCATION_TIMEOUT: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_ENABLE_MOCK_FALLBACK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
