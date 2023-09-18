import type { mf2 } from "microformats-parser";

export enum VALID_WEBMENTION_TARGET_TYPE {
    Repost = "repost-of",
    Reply = "in-reply-to",
    Like = "like-of"
}

export interface Webmention {
    url: string;
    date: string;
    mfItem: ReturnType<typeof mf2>['items'][number];
    type: VALID_WEBMENTION_TARGET_TYPE | 'link';
}