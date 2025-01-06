import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function sendWelcomeEmail(email, name) {

    const msg = {
        to: email,
        from: 'victormendes1993@live.com',
        subject: 'This is my first creation!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    }

    sgMail.send(msg).catch((error) => {
        error.response.body.errors.forEach((error) => {
            console.error(error.message)
        })
    })
}

function sendCancelationEmail(email, name) {
    const msg = {
        to: email,
        from: 'victormendes1993@live.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
    }

    sgMail.send(msg).catch((error) => {
        error.response.body.errors.forEach((error) => {
            console.error(error.message)
        })
    })
}

export { sendWelcomeEmail, sendCancelationEmail }
