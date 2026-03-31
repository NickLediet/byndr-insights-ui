import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function resolveBasePath() {
  const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
  if (!repositoryName) {
    return '/'
  }

  // User/organization Pages repos (for example, <user>.github.io) deploy at root.
  if (repositoryName.endsWith('.github.io')) {
    return '/'
  }

  return `/${repositoryName}/`
}

export default defineConfig({
  // Build with the repository subpath when running in GitHub Actions for Pages.
  base: process.env.GITHUB_ACTIONS ? resolveBasePath() : '/',
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
