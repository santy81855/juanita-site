"use server";
import { GeneralMessageTemplate } from "@/lib/EmailTemplate";
import { Resend } from "resend";

export async function send(data: {
    name: string;
    email: string;
    content: string;
}) {
    const { email, name, content } = data;
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
        let from = "";
        const template = await GeneralMessageTemplate({
            name: name,
            email: email,
            content: content,
        });
        from = "Website Inquiry <general-message@latebis.com>";

        await resend.emails.send({
            from: from,
            to: "juanaparejaj@gmail.com",
            subject: "Website Inquiry from " + name,
            react: template,
            text: "",
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return { success: "Email sent" };
    } catch (error) {
        console.log(error);
        return { error: "Error sending email" };
    }
}
