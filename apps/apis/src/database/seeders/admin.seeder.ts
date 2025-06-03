import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { config } from 'dotenv';
import { User, Permission, Role, Profile } from '../entities';
import {
  PermissionActionEnum,
  PermissionSubjectEnum,
  UserStatusEnum,
} from '@shared/enums';
import { ucWord } from '@shared/transformers';
import {
  COMMON_PERMISSION_ACTIONS,
  PERMISSION_SUBJECTS,
  DEFAULT_ROLES,
} from '@shared/constants';

config({ path: '.env' });

const mapPermissions = (
  actions: PermissionActionEnum[],
  subjects: PermissionSubjectEnum[],
): Pick<Permission, 'action' | 'subject' | 'description'>[] => {
  const values: Pick<Permission, 'action' | 'subject' | 'description'>[] = [];
  actions.forEach((action) => {
    subjects.forEach((subject) => {
      const description = ucWord(`${action} ${subject}`.replace('-', ' '));
      if (description) {
        values.push({
          action,
          subject,
          description,
        });
      }
    });
  });
  return values;
};

const commonPermissions = mapPermissions(
  Object.values(COMMON_PERMISSION_ACTIONS),
  Object.values(PERMISSION_SUBJECTS),
);

export default class AdminSeeder implements Seeder {
  track = true;

  public async run(dataSource: DataSource): Promise<any> {
    console.log('Starting AdminSeeder...');
    console.log(
      'Common Permissions:',
      JSON.stringify(commonPermissions, null, 2),
    );

    const permissionRepository = dataSource.getRepository(Permission);
    console.log('Inserting permissions...');
    try {
      await permissionRepository
        .createQueryBuilder()
        .insert()
        .values([...commonPermissions])
        .orIgnore()
        .execute();
      console.log('Permissions inserted');
    } catch (error) {
      console.error('Error inserting permissions:', error);
      throw error;
    }

    const roleRepository = dataSource.getRepository(Role);
    console.log('Inserting Super Admin role...');
    try {
      await roleRepository
        .createQueryBuilder()
        .insert()
        .values([
          {
            name: DEFAULT_ROLES.SUPER_ADMIN,
            description: 'Super Administrator',
          },
        ])
        .orIgnore()
        .execute();
      console.log('Super Admin role inserted');
    } catch (error) {
      console.error('Error inserting role:', error);
      throw error;
    }

    console.log('Fetching admin role...');
    const adminRole = await roleRepository.findOne({
      where: { name: DEFAULT_ROLES.SUPER_ADMIN },
      select: ['id'],
    });
    console.log('Admin role:', adminRole);

    if (adminRole) {
      console.log('Assigning permissions to role...');
      const rolesPermissions = (
        await permissionRepository.find({ select: ['id'] })
      ).map(({ id }) => ({
        rolesId: adminRole.id,
        permissionsId: id,
      }));
      try {
        await dataSource
          .createQueryBuilder()
          .insert()
          .into('roles_permissions')
          .values(rolesPermissions)
          .orIgnore()
          .execute();
        console.log('Permissions assigned to role');
      } catch (error) {
        console.error('Error assigning permissions to role:', error);
        throw error;
      }
    }

    const email = process.env.ADMIN_EMAIL || 'admin@hiemat.org';
    const userRepository = dataSource.getRepository(User);
    console.log('Inserting admin user...');
    try {
      await userRepository
        .createQueryBuilder()
        .insert()
        .values([
          {
            name: 'Super Admin',
            email,
            password: process.env.ADMIN_PASSWORD || 'password',
            isAdmin: true,
            status: UserStatusEnum.ACTIVE,
            disabled: false,
          },
        ])
        .orIgnore()
        .execute();
      console.log('Admin user inserted');
    } catch (error) {
      console.error('Error inserting admin user:', error);
      throw error;
    }

    console.log('Fetching admin user...');
    const adminUser = await userRepository.findOne({
      where: { email },
      select: ['id'],
    });
    console.log('Admin user:', adminUser);

    if (adminUser) {
      const profileRepository = dataSource.getRepository(Profile);
      console.log('Inserting admin profile...');
      try {
        await profileRepository
          .createQueryBuilder()
          .insert()
          .values([
            {
              userId: adminUser.id,
              title: 'Administrator',
              firstName: 'Super',
              lastName: 'Admin',
            },
          ])
          .orIgnore()
          .execute();
        console.log('Admin profile inserted');
      } catch (error) {
        console.error('Error inserting admin profile:', error);
        throw error;
      }

      if (adminRole) {
        console.log('Assigning role to user...');
        try {
          await dataSource
            .createQueryBuilder()
            .insert()
            .into('users_roles')
            .values([{ usersId: adminUser.id, rolesId: adminRole.id }])
            .orIgnore()
            .execute();
          console.log('Role assigned to user');
        } catch (error) {
          console.error('Error assigning role to user:', error);
          throw error;
        }
      }
    }
    console.log('AdminSeeder completed');
  }
}
