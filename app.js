const http = require('http'),
      Router = require('router'),
      finalhandler = require('finalhandler'),
      bodyParser = require('body-parser'),
      serveStatic = require('serve-static'),
      fs = require('fs'),
      nodemailer = require('nodemailer');
      //smtpPool = require('nodemailer-smtp-pool'),
      //Client = require('ftp'),
      //connect = require('./connect');
      //morgan = require('morgan');      

const port = parseInt(process.env.PORT, 10) || 3000,
      router = Router(),
      serve = serveStatic('dist'),
      jsonParser = bodyParser.json({limit: '3mb'});
      //logger = morgan('combined');

router.get('/', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'}); 
  res.end(fs.readFileSync(__dirname + '/dist/index.html'));
});

router.post('/', bodyParser.urlencoded({ extended: false, limit: '3mb' }), (req, res) => {
  const {timestamp, dataurl, filename, to, subject, html} = req.body;

  for (let i = 0; i < dataurl.length; i++) {
    const dataURL = dataurl[i];
    const fileName = filename[i];
    const base64Data = dataURL.replace(/^data:image\/png;base64,/, '');

    fs.mkdir(`temp/${timestamp}`, err => {
      fs.writeFile(`temp/${timestamp}/${fileName}.png`, base64Data, {flag: 'w', encoding: 'base64'}, err => {
        if (err) throw err;
        console.log(`${fileName} has been created!`);
      });
    })
  }

  //const ftp = new Client();  

  // ftp.on('ready', () => {
  //   ftp.mkdir(`${connect.path}/${timestamp}`, err => {
  //     if (err) throw err;

  //     for (let i = 0; i < dataurl.length; i++) {
  //       const dataURL = dataurl[i];
  //       const fileName = filename[i];
  //       const base64Data = dataURL.replace(/^data:image\/png;base64,/, '');

  //       fs.mkdir(`temp/${timestamp}`, err => {
  //         fs.writeFile(`temp/${timestamp}/${fileName}.png`, base64Data, {flag: 'w', encoding: 'base64'}, err => {
  //           if (err) throw err;
  //           console.log(`${fileName} has been created!`);
    
  //           ftp.put(`temp/${timestamp}/${fileName}.png`, `${connect.path}/${timestamp}/${fileName}`, err => {
  //             if (err) throw err;
  //             console.log(`${fileName} has been uploaded!`);
  //             ftp.end();
    
  //             // fs.unlink(`temp/${fileName}`, err => {
  //             //   if (err) throw err;
  //             // });
  //           });
  //         });
  //       })
  //     }
  //   });
  // });

  // const transporter = nodemailer.createTransport(smtpPool(connect.mail));

  // const mailOptions = {
  //   from: '파수닷컴 < newsletter@fasoo.com >',
  //   to,
  //   subject,
  //   html,
  //   //text: 'This is just text.'
  // };

  // transporter.sendMail(mailOptions, (err, res) => {
  //   if (err) console.log('failed... => ', err);
  //   else console.log('succeed... => ', res);
  //   transporter.close();
  // });

  // ftp.connect(connect.ftp);

  // ftp.on('error', err => {
  //   res.writeHead(200, {'Content-Type': 'application/json'});
  //   res.end(JSON.stringify({ err }));
  // });
  
  res.end();
});

router.use((req, res) => {
  serve(req, res, finalhandler(req, res))
});

const server = http.createServer((req, res) => {
  // logger(req, res, err => { if (err) return done(err) });
  router(req, res, finalhandler(req, res));  
});

server.listen(port);