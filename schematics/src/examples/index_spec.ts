import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';


const collectionPath = path.join(__dirname, '../collection.json');


describe('examples', () => {
  it('works', () => {
    const runner = new SchematicTestRunner('examples', collectionPath);
    const tree = runner.runSchematic('examples', {}, Tree.empty());

    expect(tree.files).toEqual([]);
  });
});
