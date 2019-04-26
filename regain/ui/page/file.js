discovery.page.define(
  "file",
  {
    view: "context",
    data: "..children.pick(<(path=#.id)>)",
    content: {
      view: "switch",
      content: [
        {
          when: "no $",
          content: 'alert-warning:"File not found: " + #.id'
        },
        {
          content: [
            "h1:name",
            "h3:'inputs'",
            {
              view: 'list',
              data: `
                $directive: $.ast.directives().pick(0);
                $publicProperties: $directive.properties().[accessibility != "private"];
                $inputs: $publicProperties.[decorators().name().[$ = "Input"]];
                $inputs.name()
              `,
              items: ''
            },
            "h3:'outputs'",
            {
              view: 'list',
              data: `
                $directive: $.ast.directives().pick(0);
                $publicProperties: $directive.properties().[accessibility != "private"];
                $outputs: $publicProperties.[decorators().name().[$ = "Output"]];
                $outputs.name()
              `,
              items: ''
            },
            "h3:'source'",
            {
              view: 'source',
              data: '({ content: content, syntax: "javascript" })'
            }
          ]
        }
      ]
    }
  },
  {
    resolveLink: "file"
  }
);
