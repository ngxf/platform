module.exports = {
  name: "Regain",
  data: () => {
      return require("./regain/crawler").default("./projects/platform", {
          exclude: /(node_modules|tests)/,
          extensions: /\.(ts|js|json)$/
      });
  },
  cache: false,
  //cache: __dirname + "/regain/.cache",
  prepare: __dirname + "/regain/prepare.js",
  view: {
      basedir: __dirname,
      assets: [
          "./regain/ui/page/default.js",
          "./regain/ui/page/file.js",
          "./regain/ui/sidebar.js"
      ]
  }
};
