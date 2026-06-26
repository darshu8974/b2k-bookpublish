package com.publishflow.domain.email;

import com.publishflow.config.MailProperties;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

@Slf4j
@Service
@RequiredArgsConstructor
public class SmtpEmailService implements EmailService {

    private final JavaMailSender mailSender;
    private final MailProperties mailProperties;

    @Override
    public void sendHtml(String to, String subject, String htmlBody) {
        if (!mailProperties.isEnabled()) {
            log.warn("Email is disabled (app.mail.enabled=false) — skipping send to {}", to);
            return;
        }
        String from = StringUtils.hasText(mailProperties.getFromAddress())
            ? mailProperties.getFromAddress()
            : null;
        if (from == null) {
            log.error("No from-address configured (MAIL_FROM_ADDRESS / MAIL_USERNAME) — cannot send to {}", to);
            throw new IllegalStateException("Email from-address is not configured");
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
            helper.setFrom(from, mailProperties.getFromName());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("Email sent to {} — subject: \"{}\"", to, subject);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send email to " + to, e);
        }
    }
}
