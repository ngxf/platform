import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { join, dirname } from 'path';
import { readFileSync } from 'fs';
import * as glob from 'glob';

interface InputSchema {
  dirname: string;
  name: string;
  imports: string[];
  components: string[];
  bootstrap: string;
}

interface BoilerplateModule {
  path: string;
  ids: string[];
}
interface BoilerplateNgModule {
  imports: string[];
  exports: string[];
  declarations: string[];
  bootstrap: string;
}
interface BoilerplateSchema {
  modules: BoilerplateModule[];
  ngModule: BoilerplateNgModule;
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function examples(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    const inputPath = './src/app/examples';
    const inputMask = '**/*.example.json';

    const schemas = glob.sync(join(inputPath, inputMask)).map(readSchema);
    const parsed = schemas.map(parseSchema);

    console.log(parsed);

    return tree;
  };
}

function readSchema(path: string): InputSchema {
  const schema = JSON.parse(readFileSync(path, { encoding: 'utf-8' }));
  return { ...schema, dirname: dirname(path) };
}

function parseSchema(schema: InputSchema): BoilerplateSchema {
  const modules: BoilerplateModule[] = [ ...schema.imports, ...schema.components, schema.bootstrap ].map(parseModules);

  return { ...modules } as any;
}

function parseModules(module: string): BoilerplateModule {
  const [ path, ids ] = module.split('#');
  return { path, ids: ids.split(',') };
}
