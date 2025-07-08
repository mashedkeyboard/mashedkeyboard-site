import type { RouteParams } from '../../routes/blog/[year=BlogYear]/[month=BlogMonthOrDay]/[day=BlogMonthOrDay]/[slug=BlogPostSlug]/$types';

export type FullURLSlugString = String & `${RouteParams["year"]}/${RouteParams["month"]}/${RouteParams["day"]}/${RouteParams["slug"]}`;

/**
 * Converts route parameters to a string path-style slug.
 * @param params the route params to resolve from
 * @returns a 'year/month/day/slug' style slug
 */
export function resolveSlug(params: RouteParams) {
	return decodeURIComponent([params.year, params.month, params.day, params.slug].join('/')) as FullURLSlugString;
}

/**
 * Converts a path-style slug to its components in an array.
 * @param slug the full path-style slug to explode, in 'year/month/day/blogslug' format
 * 			   (n.b. this is too complex to represent fully as a TypeScript type)
 * @returns an array of [Year, Month, Day, slug for post]
 */
export function explodeSlug(slug: FullURLSlugString) {
	return slug.split('/');
}