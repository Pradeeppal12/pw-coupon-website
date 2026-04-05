// /api/send-whatsapp.js
import twilio from 'twilio';

export default async function handler(req, res) {
    // Allow only POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { to, name, link } = req.body;

    // Validate phone number
    if (!to || to.length !== 10) {
        return res.status(400).json({ error: 'Invalid phone number' });
    }

    try {
        const client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );

        const message = await client.messages.create({
            body: `🎓 *Physics Wallah* 🎓\n\nNamaste ${name}! 👋\n\nAapka exclusive discount link taiyar hai:\n\n🔗 ${link}\n\n✅ Limited time offer!\n📚 Best of luck for your preparation!\n\n- PW Team`,
            from: 'whatsapp:+14155238886',
            to: `whatsapp:+91${to}`
        });

        console.log(`✅ WhatsApp message sent to ${to}: ${message.sid}`);
        
        res.status(200).json({ success: true, sid: message.sid });
    } catch (error) {
        console.error('❌ Twilio Error:', error);
        res.status(500).json({ error: error.message });
    }
}