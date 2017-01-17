// Update with your config settings.

module.exports = {
  development: {
    client: 'postgresql',
    connection: 'postgres://localhost:5432/lok',
    migrations: {
      directory: __dirname + '/db/migrationsDev'
    },
    seeds: {
      directory: __dirname + '/db/seedsDev'
    }
  },
  production: {
    client: 'postgresql',
    connection:'postgres://mglrokmvahlvce:ab366b903926c5177e1c6080f869b639ac8e7e3cc67821528b9eef8a079f34da@ec2-54-163-240-7.compute-1.amazonaws.com:5432/d25ksgf5ka1e6a?ssl=true' ,
    migrations: {
      directory: __dirname + '/db/migrationsPro'
    },
    seeds: {
      directory: __dirname + '/db/seedsPro'
    }
  }
};
