import * as React from "react";

interface EmailTemplateProps {
    name: string;
    email: string;
    content: string;
}

export const GeneralMessageTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    name,
    email,
    content,
}) => (
    <div>
        <p>
            Message from {name} at {email}.
        </p>
        <p>{content}</p>
    </div>
);
