import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),  // point d'entrée correct
      name: 'AutoComplete', // nom de la librairie
      fileName: 'autocomplete', // nom du fichier de sortie
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['react', 'react-dom'], // exclure les dépendances externes
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }

})
