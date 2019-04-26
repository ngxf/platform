discovery.view.define('sidebar', [
  'h1:"NGXF"',
  {
    view: 'content-filter',
    content: {
      view: 'list',
      limit: 100,
      data: `
      files().({ path, name: ast.directives().name() + ast.pipes().name() })
      .[name].group(<name>, <path>).({ name: key, path: value.pick(0) })
      .[no #.filter or name~=#.filter]
    `,
      item: {
        view: 'list',
        item: ['link:{ href: "#file:" + path, text: name }']
      }
    }
  }
]);

// discovery.view.define("sidebar", [
//   'h1:"NGXF"',
//   'h2:"Directives"',
//   {
//     view: "list",
//     data: `
//       files().({ path, name: ast.directives().name() }).[name].group(<name>, <path>).({ name: key, path: value.pick(0) })
//     `,
//     item: [
//       {
//         view: "ul",
//         item: ['link:{ href: "#file:" + path, text: name }']
//       }
//     ]
//   },
//   'h2:"Pipes"',
//   {
//     view: "list",
//     data: `
//       files().({ path, name: ast.pipes().name() }).[name].group(<name>, <path>).({ name: key, path: value.pick(0) })
//     `,
//     item: [
//       {
//         view: "ul",
//         item: ['link:{ href: "#file:" + path, text: name }']
//       }
//     ]
//   }
// ]);
