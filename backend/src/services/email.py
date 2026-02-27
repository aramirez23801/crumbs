import resend
from src.core.config import settings


def send_password_reset_email(to_email: str, reset_link: str) -> None:
    resend.api_key = settings.resend_api_key

    resend.Emails.send({
        "from": settings.email_from,
        "to": to_email,
        "subject": "Reset your Crumbs password",
        "html": f"<p>Click the link below to reset your password:</p><p><a href=\"{reset_link}\">{reset_link}</a></p>",
    })
