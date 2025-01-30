import { defineConfig } from 'vitest/config.js'

export default defineConfig({
  test: {
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
})
