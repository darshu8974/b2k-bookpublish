package com.publishflow.domain.email;

import com.publishflow.config.MailProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * Sends a one-off test email on startup IF {@code app.mail.test-recipient}
 * (env var MAIL_TEST_TO) is set. Used to verify Goal 1 — the email foundation.
 * Leave MAIL_TEST_TO unset for normal runs and nothing happens.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class EmailTestRunner implements CommandLineRunner {

    private final EmailService emailService;
    private final MailProperties mailProperties;

    @Override
    public void run(String... args) {
        String to = mailProperties.getTestRecipient();
        if (!StringUtils.hasText(to)) {
            return; // no MAIL_TEST_TO configured — skip the startup test
        }
        log.info("MAIL_TEST_TO is set — sending startup test email to {} ...", to);
        try {
            String body = EmailTemplate.wrap(
                "Email is working 🎉",
                "<p>This is a test message from <strong>ProTrack</strong>.</p>"
                    + "<p>If you're reading this, the email foundation is set up correctly — "
                    + "your app can now send emails.</p>"
                    + "<p style=\"margin-top:24px;\">"
                    + "<a href=\"#\" style=\"background-color:#0052CC;color:#FFFFFF;text-decoration:none;"
                    + "padding:11px 22px;border-radius:6px;font-size:14px;font-weight:600;display:inline-block;\">"
                    + "Example Button</a></p>"
            );
            emailService.sendHtml(to, "ProTrack — Test Email (Goal 1)", body);
            log.info("✅ Test email sent successfully to {}", to);
        } catch (Exception e) {
            log.error("❌ Test email FAILED: {}", e.getMessage());
        }
    }
}
