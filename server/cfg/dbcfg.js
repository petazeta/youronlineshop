const dbConfigList=new Map(Object.entries({
  'default':
  {
    host: "localhost",
    user: "user_name",
    password: "mypassword",
    database: "mydb",
    dbsys: "pgsql",
  },
}));
export default dbConfigList;