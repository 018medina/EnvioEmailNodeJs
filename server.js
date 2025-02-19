require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do transporte de e-mail para KingHost
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true", // true para SSL (465), false para TLS (587)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Rota para envio de e-mail
app.post("/send-email", async (req, res) => {
    const { name, email, whatsapp, message } = req.body;

    const mailOptions = {
        from: `"Contato Site" <${process.env.EMAIL_USER}>`,
        to: process.env.RECEIVER_EMAIL,
        subject: "Novo contato pelo site",
        text: `Nome: ${name}\nE-mail: ${email}\nWhatsApp: ${whatsapp}\nMensagem: ${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "E-mail enviado com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao enviar e-mail." });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
