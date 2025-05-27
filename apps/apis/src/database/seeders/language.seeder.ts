import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Language } from '../entities';

export default class LanguageSeeder implements Seeder {
  track = true;

  public async run(dataSource: DataSource): Promise<void> {
    console.log('Starting LanguageSeeder...');

    const languageRepository = dataSource.getRepository(Language);

    const languages = [
      {
        code: 'en',
        name: 'English',
        native: 'English',
      },
      {
        code: 'fr',
        name: 'French',
        native: 'Français',
      },
      {
        code: 'am',
        name: 'Amharic',
        native: 'አማርኛ',
      },
    ];

    console.log('Inserting languages:', JSON.stringify(languages, null, 2));

    try {
      await languageRepository
        .createQueryBuilder()
        .insert()
        .values(languages)
        .orIgnore()
        .execute();
      console.log('Languages inserted');
    } catch (error) {
      console.error('Error inserting languages:', error);
      throw error;
    }

    console.log('LanguageSeeder completed');
  }
}
