import nodemailer from 'nodemailer';
import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import path from 'path';

interface EmailRequest {
    title: string;
    email: string;
    message: string;
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'tu_correo@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'tu_contraseña_aplicacion'
    }
});


const createEmailTemplate = (message: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <!-- Header -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td style="padding: 20px 0; text-align: center; background-color: #006699;">
                <h1 style="color: #f0f0f0">
                VITAMED
                </h1>
            </td>
        </tr>
    </table>

    <!-- Content -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td style="padding: 40px 30px; background-color: #ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                        <td style="padding-bottom: 20px; color: #153643; font-size: 24px;">
                            ${title}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 0; color: #153643; font-size: 16px; line-height: 24px;">
                            ${message}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- Footer -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td style="padding: 30px; background-color: #006699; color: #ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                        <td style="padding-bottom: 20px; text-align: center;">
                            <p style="margin: 0; font-size: 16px;">Vitamed IPS</p>
                            <p style="margin: 5px 0; font-size: 14px;">Cuidando tu salud, cuidando tu vida</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">
                            <p style="margin: 0; font-size: 14px;">📞 Línea de atención: (123) 456-7890</p>
                            <p style="margin: 5px 0; font-size: 14px;">📧 contacto@vitamedips.com</p>
                            <p style="margin: 5px 0; font-size: 14px;">🏥 Dirección: Calle Principal #123</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-top: 20px; text-align: center;">
                            <p style="margin: 0; font-size: 12px;">© 2024 Vitamed IPS. Todos los derechos reservados.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

export const sendEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, email, message }: EmailRequest = req.body;

        if (!title || !email || !message) {
            res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
            return;
        }

        const mailOptions: nodemailer.SendMailOptions = {
            from: process.env.EMAIL_USER || 'tu_correo@gmail.com',
            to: email,
            subject: title,
            html: createEmailTemplate(message, title)  // Cambiamos text por html
        };

        const info = await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'Email enviado correctamente',
            info
        });

    } catch (error) {
        console.error('Error al enviar email:', error);
        res.status(500).json({
            success: false,
            message: 'Error al enviar el email',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
