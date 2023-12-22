import shell from 'shelljs';

const args = process.argv.slice(2);

function main() {
  // ----------------------------------------
  // for local development
  if (args.includes('--dev')) {
    shell.exec('npm run docker');
    shell.exec('npx prisma generate');
    shell.exec('npm run db:seed');
    shell.exec(
      'npx concurrently -n "NUXT,STUDIO" -c "auto"  "nuxt dev" "npx prisma studio --browser none"',
    );
    return;
  }
}

main();
