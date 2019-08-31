const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport(
   {
      service: 'gmail',
      auth: {
         type: 'OAuth2',
         user: 'dennyangesti@gmail.com',
         clientId: '1005841426351-mlkrjhpogfpeb9pdmphb28s2n80trhgg.apps.googleusercontent.com',
         clientSecret: '9rt2aQpGIXeycv2Vvrg8WVCK',
         refreshToken: '1/DntFU_XnUJVeCDRx_VbSyQ2dvlRWSgtrXQEeUIO6WyU'
      }
   }
)

const mailVerify = (user) => {
   var { id, username, email } = user

   const mail = {
      from: 'Motoka <dennyangesti@gmail.com>',
      to: email,
      subject: '[MOTOKA] Please verify your email adress',
      html: `
        <p>Almost done, <b>@${username}</b>! To complete your registration, we just need to verify your email address:</p>
        <h3>${email}</h3>
        <br>
        <b><a href="http://localhost:2019/verify/${id}"> Verify Email </a></b>
        <br>
        <br>
        <p>After verified, you can login and see our products</p>`
   }

   transporter.sendMail(mail, (err, result) => {
      if (err) return console.log(err.message)
      console.log(result)
      console.log('Email sent!')
   })
}

module.exports = mailVerify