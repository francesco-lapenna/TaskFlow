import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';

/**
 * Active datasource for the app. Picks between an in-memory store and a
 * real MySQL connection at boot time based on `DB_CONNECTOR`.
 *
 *   DB_CONNECTOR=memory  → no DB needed, data lives in process memory
 *   DB_CONNECTOR=mysql   → connect to MySQL using DB_HOST / DB_PORT / DB_USER / DB_PASSWORD / DB_DATABASE
 *
 * Repositories bind to `datasources.db` regardless, so swapping between the
 * two is a single env-var change.
 */
const useMysql = process.env.DB_CONNECTOR === 'mysql';

const config = useMysql
  ? {
      name: 'db',
      connector: 'mysql',
      host: process.env.DB_HOST ?? 'localhost',
      port: +(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER ?? 'taskflow',
      password: process.env.DB_PASSWORD ?? 'taskflow',
      database: process.env.DB_DATABASE ?? 'taskflow',
    }
  : {
      name: 'db',
      connector: 'memory',
      // localStorage keeps data inside the process for the lifetime of the app
    };

@lifeCycleObserver('datasource')
export class DbDataSource extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'db';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.db', { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
