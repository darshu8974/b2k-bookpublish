package com.publishflow.domain.file;

/**
 * Must stay in sync with UPLOAD_CATEGORIES in src/utils/constants.js.
 */
public enum UploadCategory {
    CUSTOMER_BRIEF,
    SAMPLE_FILE,
    REVIEW_FEEDBACK,
    TYPESET_DRAFT,
    PAGINATED_FILE,
    QC_REPORT,
    FINAL_DELIVERABLE,
    OTHER
}
