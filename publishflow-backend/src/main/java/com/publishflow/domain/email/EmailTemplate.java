package com.publishflow.domain.email;

/**
 * Wraps email body content in a branded, inline-styled HTML shell.
 * Inline styles are used deliberately — most email clients strip {@code <style>} blocks.
 */
public final class EmailTemplate {

    private EmailTemplate() {
    }

    /**
     * @param heading  the title shown at the top of the email body
     * @param bodyHtml inner HTML (paragraphs, buttons, etc.)
     */
    public static String wrap(String heading, String bodyHtml) {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
            <body style="margin:0;padding:0;background-color:#F0F2F5;font-family:Arial,Helvetica,sans-serif;">
              <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background-color:#F0F2F5;padding:24px 0;">
                <tr>
                  <td align="center">
                    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%%;background-color:#FFFFFF;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
                      <tr>
                        <td style="background-color:#0A1929;padding:22px 32px;">
                          <span style="color:#FFFFFF;font-size:20px;font-weight:700;letter-spacing:-0.02em;">ProTrack</span>
                          <span style="color:#6B8CAE;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;display:block;margin-top:2px;">Workflow Manager</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:32px;">
                          <h1 style="margin:0 0 16px;color:#0A1929;font-size:22px;font-weight:700;">%s</h1>
                          <div style="color:#3A4A5A;font-size:15px;line-height:1.65;">%s</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:18px 32px;border-top:1px solid #ECEFF3;color:#9AA7B5;font-size:12px;">
                          This is an automated message from ProTrack. Please do not reply to this email.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """.formatted(heading, bodyHtml);
    }
}
