package com.publishflow.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.mail")
public class MailProperties {

    /** Master switch — when false, the app logs instead of sending. */
    private boolean enabled = true;

    /** The "from" address shown to recipients (defaults to the SMTP username). */
    private String fromAddress;

    /** The display name shown as the sender. */
    private String fromName = "ProTrack";

    /** If set, a test email is sent to this address on startup (dev only). */
    private String testRecipient;

    /** Settings for reading an inbox and importing attachments. */
    private Inbound inbound = new Inbound();

    @Getter
    @Setter
    public static class Inbound {
        /** When false, the inbox is never polled. */
        private boolean enabled = false;
        private String host = "imap.gmail.com";
        private int port = 993;
        /** Defaults to the SMTP username/password if not separately set. */
        private String username;
        private String password;
        private long pollIntervalMs = 120000;
        private String folder = "INBOX";
    }
}
