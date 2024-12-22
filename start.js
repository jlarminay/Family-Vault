import shell from 'shelljs';

const args = process.argv.slice(2);

function main() {
  // ----------------------------------------
  // for local development
  if (args.includes('--dev')) {
    shell.rm('-rf', './.tmp');
    shell.exec('npm run docker');
    shell.exec('npx prisma generate');
    shell.exec('npm run db:seed');
    shell.exec('npx concurrently -n "NUXT,STUDIO" -c "auto"  "npm run dev" "npm run db:studio"');
    return;
  }
}

main();
