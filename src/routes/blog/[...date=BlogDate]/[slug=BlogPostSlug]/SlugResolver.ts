import type { RouteParams } from "./$types";

export function resolveSlug(params: RouteParams) {
    return decodeURIComponent(params.date + '/' + params.slug);
}