var express = require("express")
var app = express()
var imageMap = [];
var mkdirp = require('mkdirp');

/// Include the express body parser
app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.static(__dirname+"/uploads"));
});

var form = "<!DOCTYPE HTML><html><body>" +
    "<form method='post' action='/uploads' enctype='multipart/form-data'>" +
    "Pic <input type='file' name='image'/>" +
    "e-mail: <input type='text' name='email_id'/>" +
    "<input type='submit' /></form>" +
    "</body></html>";

app.get('/', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html' });
    res.end(form);

});

/// Include the node file module
var fs = require('fs');
var upload = function (req, res) {
    var emailId = req.params.email_id ? req.params.email_id : req.body.email_id;
    emailId = emailId.substr(0, emailId.indexOf("@"));
    fs.readFile(req.files.image.path, function (err, data) {

        var imageName = req.files.image.name

        /// If there's an error
        if (!imageName) {

            console.log("There was an error")
            res.redirect("/");
            res.end();

        } else {
            console.log(__dirname + "/uploads/" + emailId)
            var userDir = __dirname + "/uploads/" + emailId;

            mkdirp(userDir, function (err) {
                if (err)
                    res.send(err)

            });
            var newPath = userDir + "/" + imageName;
            /// write file to uploads/fullsize folder
            fs.writeFile(newPath, data, function (err) {
                imageMap[emailId] = newPath;
                res.redirect("/");
            });
        }
    });
}
/// Post files
app.post('/uploads/:email_id', upload);
app.post('/uploads', upload);


/// Show files
app.get('/download/:email_id', function (req, res) {
   // file = req.params.file;
    var folder = __dirname + "/uploads/"+req.params.email_id;
    var email = req.params.email_id;
    var imgs = fs.readdirSync(folder);
    for(index in imgs){
        imgs[index]= req.params.email_id+"/"+imgs[index];
    }
    //var img = fs.readFileSync(imageMap[req.params.email_id]);
    //res.writeHead(200, {'Content-Type': 'image/jpg' });
    console.log(imgs)
    res.send(imgs);

});
app.listen(9999)