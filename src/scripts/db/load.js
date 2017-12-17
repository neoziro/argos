import { exec } from 'child_process'
import { promisify } from 'util'
import config from 'config'
import display from 'modules/scripts/display'

if (config.get('env') === 'production') {
  throw new Error('Not in production please!')
}

const execAsync = promisify(exec)
const CI = process.env.CI === 'true'

const command = CI
  ? `psql --host localhost -U argos ${config.get('env')} < src/server/db/structure.sql`
  : `docker exec -i \`docker-compose ps -q postgres\` psql -v ON_ERROR_STOP=1 -U argos ${config.get(
      'env'
    )} < src/server/db/structure.sql`

execAsync(command).catch(({ stderr }) => {
  display.error(`${stderr}`)
})
