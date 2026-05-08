import { TaskFlowApplication } from './application';

/**
 * Run with `npm run migrate` after switching DB_CONNECTOR=mysql.
 * Creates tables based on the model decorators. Pass `--existing` to
 * preserve existing rows; default rebuilds the schema.
 */
export async function migrate(args: string[]) {
  const existingSchema = args.includes('--existing') ? 'alter' : 'drop';
  console.log('Migrating schemas (%s existing schema)', existingSchema);

  const app = new TaskFlowApplication();
  await app.boot();
  await app.migrateSchema({ existingSchema });

  process.exit(0);
}

migrate(process.argv).catch((err) => {
  console.error('Cannot migrate database schema', err);
  process.exit(1);
});
