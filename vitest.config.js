import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    threads: false, // Desactiva los hilos paralelos
    silent: false,  // Asegúrate de que no esté en modo silencioso
  },
});
