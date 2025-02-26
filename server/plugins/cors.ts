export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('nitro:config', (config) => {
      config.plugins = config.plugins || [];
      config.plugins.push((app) => {
        app.use(cors({ origin: '*' }));
      });
    });
  });
  