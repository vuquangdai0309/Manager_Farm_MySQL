const express = require('express')
const app = express()
const port = 3000
const handlebars = require('express-handlebars')
const morgan = require('morgan')
const path = require('path');
const route = require('./src/routes')
const db = require('./src/config/db')
const striptags = require('striptags');
//change mathod
const methodOverride = require('method-override')
//const setCommonData = require('./src/app/middlewares/setDataVuMua')
var cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//cookies
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'src\\public')))
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())
//monggooes
db.connection;

//template 
app.engine('hbs', handlebars.engine({
  extname: '.hbs',
  helpers: {

    sum: (a, b) => a + b,
    truncateDescription: function (description) {
      if (description.length > 0) {
        return striptags(description.substring(0, 130) + '...');
      }
      return description;
    },
    formatNumber:function(number){
      return number.toLocaleString();
    }
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src\\resource\\views'));
//đường dẫn đến file ảnh
app.use('/uploads', express.static('uploads'))
//app.use(setCommonData)
//https://www.youtube.com/watch?v=YWyuzXyLg68
//change method
app.use(methodOverride('_method'))
//routes init
route(app)
//HTTP LOGGER
app.use(morgan('combined'))

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})