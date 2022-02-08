// For mongodb we just use the url data
const dbConfigList=new Map(Object.entries({
  'sample':
  {
    host: "localhost",
    user: "user_name",
    password: "mypassword",
    database: "mydb",
    dbsys: "mongodb",
    url: "mongodb://admin:password@localhost/testdb?authSource=admin"
  },
}));
export default dbConfigList;