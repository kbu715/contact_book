var express = require('express'); //설치한 express module을 불러와서 변수(express)에 담습니다.
var app = express(); //express를 실행하여 app object를 초기화 합니다.
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify',false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;

db.once('open', function() {
    console.log('DB connected');
});
db.on('error', function(err){
    console.log('DB ERROR : ', err);
});



//OTHER SETTINGS
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


// DB schema
var contactSchema = mongoose.Schema({
    name : {type:String, required:true, unique:true},
    email : {type:String},
    phone : {tpye:String}
});
var Contact = mongoose.model('contact', contactSchema);

// Routes
// Home 
app.get('/', function(req, res){
    res.redirect('/contacts');
});

// Contacts - Index 
app.get('/contacts', function(req, res){
    Contact.find({}, function(err, contacts){
        if(err) return res.json(err);
        res.render('contacts/index', {contacts:contacts});
    });
});
//Contacts - New
app.get('/contacts/new', function(req, res){
    res.render('contacts/new');
});

// Contacts - create
app.post('/contacts', function(req, res){
    Contact.create(req.bodym function(err, contact){
        if(err) return res.json(err);
        res.redirect('/contacts');
    });
});

//PORT SETTING
var port = 3000; //사용할 포트 번호를 port 변수에 넣습니다.
app.listen(port, function(){ //port 변수를 이용하여 3000번 포트에 node.js 서버를 연결합니다.
    console.log('server on! http://localhost'+port); //서버가 실행되면 콘솔창에 표시될 메시지입니다.
    
});