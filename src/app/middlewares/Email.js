'use strict';
const Mailjet = require('node-mailjet')
function sendForgotPasswordMail(data, host, resetLink) {

    const mailjet = Mailjet.apiConnect(
        process.env.MJ_APIKEY_PUBLIC,
        process.env.MJ_APIKEY_PRIVATE,

    );
    const request = mailjet
        .post('send', { version: 'v3.1' })
        .request({
            Messages: [
                {
                    From: {
                        Email: "vudinhdai03092001@gmail.com",
                        Name: "Quan Ly Vung Trong"
                    },
                    To: [
                        {
                            Email: data.email,
                            Name: `${data.username}`
                        }
                    ],
                    Subject: "Quan Ly Vung Trong Reset PassWord",
                    HTMLPart: `
                  <p>Hi ${data.username},</p>  
                    
                 <p> You recently requested to reset the password for your ${host} account. Click the button below to proceed.</P>  
                    
                <p> <a href = "${resetLink}">resetpass</a></p>
                    
                  <p>  If you did not request a password reset, please ignore this email or reply to let us know. This password reset link is only valid for the next 30 minutes.
                    </p>
                    Thanks, 
                    Quan Ly Vung Trong
                    `
                }
            ]
        })

   return request
       
}
module.exports = { sendForgotPasswordMail };