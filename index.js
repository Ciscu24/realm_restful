const {app} = require('./express/expressApp')
const port = 3000
app.set('port', process.env.PORT || port)
app.listen(port, ()=> console.log(`Express app is listening on port ${port}`))
//Para ejecutar usar comando: nodemon index.js o npm run serve