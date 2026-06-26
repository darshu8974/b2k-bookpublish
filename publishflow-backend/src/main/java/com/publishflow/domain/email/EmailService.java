package com.publishflow.domain.email;

/**
 * Sends emails from the application. Implemented by {@link SmtpEmailService}.
 * Kept as an interface so the delivery mechanism (SMTP today, an OAuth/API
 * provider later) can be swapped without touching the rest of the app.
 */
public interface EmailService {

    /**
     * Sends an HTML email.
     *
     * @param to       recipient address
     * @param subject  email subject line
     * @param htmlBody fully-rendered HTML body
     */
    void sendHtml(String to, String subject, String htmlBody);
}
