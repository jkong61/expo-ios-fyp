module.exports = function(api) {
  api.cache(true);
  
  const presets = [
    "babel-preset-expo"
  ];

  const plugins = [
    [
      "module-resolver",
      {
        // need to clear cache when adding alias here "run expo start -c"
        // Mapping intellisense needs to be added to jsconfig.json
        "alias": {
          "@assets": "./assets",
          "@config": "./config",
          "@utilities" : "./utilities",
          "@components" : "./components",
          "@http" : "./http",
          "@screens": "./screens",
          "@navigation" : "./navigation",
          "@async_storage" : "./async_storage"
        }
      }
    ]
  ];

  // Used to build app without console.log for performance reasons
  if (process.env.NODE_ENV === "production" || process.env.BABEL_ENV === "production") {
    plugins.push(["transform-remove-console", {exclude: ["error", "warn"]}]);
  }

  return {
    presets,
    plugins
  };
};
