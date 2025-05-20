import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Country } from '../entities';
import * as countriesDataRaw from '../../data/countries.json';

interface CountryJson {
  name: string;
  iso2: string;
  numeric_code: string;
  phonecode: string;
  native: string;
  translations: { fr: string } | undefined;
  latitude: string;
  longitude: string;
  emoji: string;
  emojiU: string;
}

export default class CountrySeeder implements Seeder {
  track = true;

  public async run(dataSource: DataSource): Promise<void> {
    console.log('Starting CountrySeeder...');

    // Handle CommonJS JSON import
    const countriesData = (countriesDataRaw as any).default || countriesDataRaw;

    // Debug the imported data
    console.log('Type of countriesData:', typeof countriesData);
    console.log(
      'countriesData content:',
      JSON.stringify(countriesData, null, 2),
    );
    console.log('Is countriesData an array?', Array.isArray(countriesData));

    if (!Array.isArray(countriesData)) {
      throw new Error(
        'countriesData is not an array. Check the JSON file content or import.',
      );
    }

    const countryRepository = dataSource.getRepository(Country);
    console.log('Inserting African countries from countries.json...');

    const countriesToInsert = countriesData
      .map((country: CountryJson) => {
        // Validate country data
        if (!country.iso2 || !country.name) {
          console.warn(`Skipping invalid country: ${JSON.stringify(country)}`);
          return null;
        }

        // Use translations.fr if available, otherwise fallback to name
        const frenchTranslation = country.translations?.fr || country.name;

        return {
          iso2: country.iso2,
          name: country.name,
          numericCode: country.numeric_code,
          phoneCode: country.phonecode,
          native: country.native,
          frenchTranslation, // Ensures NOT NULL
          latitude: country.latitude,
          longitude: country.longitude,
          emoji: country.emoji,
          emojiU: country.emojiU,
          description: null,
        };
      })
      .filter((country) => country !== null); // Remove invalid entries

    if (countriesToInsert.length === 0) {
      throw new Error('No valid countries to insert.');
    }

    try {
      await countryRepository
        .createQueryBuilder()
        .insert()
        .values(countriesToInsert)
        .orIgnore()
        .execute();
      console.log(
        `Inserted ${countriesToInsert.length} African countries successfully`,
      );
    } catch (error) {
      console.error('Error inserting African countries:', error);
      throw error;
    }

    console.log('CountrySeeder completed');
  }
}
