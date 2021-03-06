import { join } from 'path';
import * as writeFile from 'write';
import { items as simpleData } from '../../test-data/mock/sample-2';
import { builder } from './builder';
import { IMap, IOptions, Sitecore } from './models';
import { writer } from './writer';

const convertDataToMap = (data, item) => {
  data[item.ID] = item;

  return data;
};

describe('Writer', () => {

  // Read more about fake timers: http://facebook.github.io/jest/docs/en/timer-mocks.html#content
  jest.useFakeTimers();

  // Act before assertions
  beforeAll(async () => {
    // do nothing
  });

  test('Match generated C# class content', () => {
    const options: IOptions = {
      cwd: '', // not used
      pattern: '', // not used
      Using: [
        'Epam.Sc.EngX.CodeGeneration.Domain',
        'TestYo.Foundation.MyModule',
      ],
    };

    const items: IMap<Sitecore.Rainbow.IItem> = simpleData.reduce(convertDataToMap, {});

    const templates = builder(items, options);
    const result = writer(templates, options);

    expect(result).toEqual(expect.stringMatching(/using Epam\.Sc\.EngX\.CodeGeneration\.Domain;/));
    expect(result).toEqual(expect.stringMatching(/\[SitecoreType\(TemplateId\=\"b716d128-a28e-4093-a917-d12a1a639ae1\"\)\]/));
    expect(result).toEqual(expect.stringMatching(/IEnumerable\<Guid\> ListField \{get; set;\}/));
    expect(result).toEqual(expect.stringMatching(/Image Image \{get; set;\}/));

    writeFile('./tmp/tmp.writer.spec.cs', result, () => null);
  });
});
