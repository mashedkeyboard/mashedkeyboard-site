import type { RouteParams } from "./$types";

export function resolveSlug(params: RouteParams) {
    return decodeURIComponent([params.year, params.month, params.day, params.slug].join('/'));
}