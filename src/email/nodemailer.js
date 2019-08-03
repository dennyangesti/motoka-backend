const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport(
   {
      service: 'gmail',
      auth: {
         type: 'OAuth2',
         user: 'dennyangesti@gmail.com',
         clientId: '1005841426351-mlkrjhpogfpeb9pdmphb28s2n80trhgg.apps.googleusercontent.com',
         clientSecret: '9rt2aQpGIXeycv2Vvrg8WVCK',
         refreshToken: '1/659WA3GZEU-wJOWKuXZNc4KrIGW9tumTILpEFQyoL0g'
      }
   }
)

const mailVerify = (user) => {
   var { name, username, email } = user

   const mail = {
      from: 'Alvin Rochafi <alvinrochafi@gmail.com>',
      to: email,
      subject: 'Hello from the other side',
      html: `<h1>HELLO ${name}, ITS MEH</h1>
        <a href='http://localhost:2019/verify?uname=${username}' >Klik untuk verifikasi</a>`
   }

   transporter.sendMail(mail, (err, result) => {
      if (err) return console.log(err.message)

      console.log('Alhamdulillah ya berhasil')
   })
}

module.exports = mailVerify