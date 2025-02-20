<h2>Implementando um Formulário de Envio de E-mail com Node.js</h2>


No desenvolvimento web, uma funcionalidade comum é a implementação de um formulário de contato que permite o envio de e-mails diretamente pelo site. Neste mini artigo, descrevo uma rotina que criei para essa funcionalidade, utilizando HTML, CSS, JavaScript no frontend e Node.js no backend, com configuração de um servidor SMTP para envio de mensagens.

<h2>1. Criação da Tela com Formulário</h2>

O primeiro passo foi desenvolver uma tela simples em HTML e CSS contendo um formulário com campos essenciais como nome, e-mail e mensagem. Um botão de envio aciona um script em JavaScript, que captura os dados inseridos e os envia para o backend via requisição HTTP/HTTPS.

Exemplo de código HTML:

```
<form id="contactForm">
     <div class="container">
          <h2 class="tituloH2 flexCenter txtAzul">Fale Conosco</h2>
          <input type="text" id="name" placeholder="Nome Completo" required />
          <input type="email" id="email" placeholder="E-mail" required />
          <input type="tel" id="whatsapp" placeholder="WhatsApp" required />
          <textarea
            id="message"
            placeholder="Digite sua mensagem..."
            rows="4"
            required
          ></textarea>
          <button type="submit">Enviar Mensagem</button>
     </div>
</form>
```

E um script JavaScript para capturar e enviar os dados ao backend:

```
<script>
      document
        .getElementById("contactForm")
        .addEventListener("submit", async function (event) {
        event.preventDefault(); // Impede o envio tradicional do formulário

          const name = document.getElementById("name").value;
          const email = document.getElementById("email").value;
          const whatsapp = document.getElementById("whatsapp").value;
          const message = document.getElementById("message").value;

          // Expressão regular para validar e-mail
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          // Expressão regular para validar telefone (aceita DDD e número com 9 dígitos)
          const whatsappRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;

          // Valida se todos os campos estão preenchidos
          if (!name || !email || !whatsapp || !message) {
            alert("Por favor, preencha todos os campos!");
            return;
          }

          // Valida o formato do e-mail
          if (!emailRegex.test(email)) {
            alert("Por favor, insira um e-mail válido!");
            return;
          }

          // Valida o formato do número de WhatsApp
          if (!whatsappRegex.test(whatsapp)) {
            alert(
              "Por favor, insira um número de WhatsApp válido! Exemplo: (11) 91234-5678"
            );
            return;
          }

          const data = { name, email, whatsapp, message };

          try {
            const response = await fetch(
              "https://urlBackEnd/send-email", // URL do backend
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              }
            );

            const result = await response.json();
            alert(result.message); // Exibe mensagem de sucesso ou erro
            document.getElementById("contactForm").reset();
            window.location.href = "../index.html";
          } catch (error) {
            alert("Erro ao enviar mensagem. Tente novamente.");
          }
        });
</script>
```

<h2>2. Backend em Node.js</h2>

Para receber os dados enviados pelo formulário, criei um backend em Node.js utilizando o framework Express. Ele recebe os dados do frontend e os encaminha para o servidor SMTP configurado.

```
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
```

<h2>3. Configuração do Servidor SMTP</h2> 

O servidor SMTP utilizado foi um provedor externo da Kinghost, configurado no Node.js por meio da biblioteca Nodemailer. Ele gerencia a autenticação e envio das mensagens, garantindo segurança e confiabilidade.

<h2>4. OBS:</h2>

Para garantir segurança na aplicação, é fundamental nunca expor credenciais sensíveis diretamente no código. O uso de variáveis de ambiente (“.env”) permite armazenar informações como usuário e senha do SMTP de forma segura, evitando riscos de vazamento de dados.
Para o projeto ficar mais próximo de um cenário real, é possível publicar a aplicação em sites como Vercel (https://vercel.com/) e o backend em sites como Render (https://render.com/).

<h2>5. Recebimento do E-mail e Conclusão</h2>

Após o envio, o destinatário recebe o e-mail com as informações preenchidas no formulário. Essa rotina foi essencial para implementar um contato rápido e automatizado entre os visitantes do site e a administração.
Com essa estrutura simples e eficiente, é possível integrar formulários de contato em qualquer projeto web, oferecendo uma comunicação direta e eficaz via e-mail.
