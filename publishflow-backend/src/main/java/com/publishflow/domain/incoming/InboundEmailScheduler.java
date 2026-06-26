package com.publishflow.domain.incoming;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Periodically checks the inbox for new attachments. The actual work no-ops
 * when {@code app.mail.inbound.enabled=false}, so this is always safe to run.
 */
@Component
@RequiredArgsConstructor
public class InboundEmailScheduler {

    private final IncomingService incomingService;

    @Scheduled(
        fixedDelayString = "${app.mail.inbound.poll-interval-ms:120000}",
        initialDelay = 20000
    )
    public void poll() {
        incomingService.importFromInbox();
    }
}
