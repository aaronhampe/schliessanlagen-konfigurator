import cors from 'cors'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('nitro:config', (config) => {
    config.plugins = config.plugins || []
    config.plugins.push((app) => {
      // Hier wird CORS für alle Endpunkte aktiviert. 
      // Du kannst die Optionen (z.B. origin) natürlich anpassen.
      app.use(cors({ origin: '*' }))
    })
  })
})
