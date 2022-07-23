module.exports = {
    staging: {
      client: 'pg',
      connection: {
        database: 'happy',
        user:     'postgres',
        password: '123'
        
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'users'
      }
    },   
  };