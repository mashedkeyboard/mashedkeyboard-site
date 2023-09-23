-- Migration number: 0000 	 2023-09-23T13:49:58.577Z
DROP TABLE IF EXISTS mentions;

CREATE TABLE IF NOT EXISTS mentions (
    slug TEXT NOT NULL,
    url TEXT NOT NULL,
    date TEXT,
    type TEXT,
    mfItem TEXT,
    replyTo as (json_extract(mfItem, '$.properties.in-reply-to')) STORED,
    PRIMARY KEY (slug, url)
);

CREATE INDEX reply_idx ON mentions(replyTo);