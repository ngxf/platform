discovery.page.define("default", [
  'h1:"Regain"',
  {
    view: "list",
    data: `
      files()
    `,
    item: [
      {
        view: "ul",
        item: ["text:path"]
      }
    ]
  }
]);
