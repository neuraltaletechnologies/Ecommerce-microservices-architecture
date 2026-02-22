/**
 * Cloudinary Image Utilities
 * 
 * Helper functions for working with Cloudinary images in the frontend
 */

/**
 * Get optimized Cloudinary URL with transformations
 * 
 * @param url - Original Cloudinary URL
 * @param options - Transformation options
 * @returns Optimized URL with transformations
 */
export function getCloudinaryUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale' | 'limit';
  } = {}
): string {
  // If not a Cloudinary URL, return as-is
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'limit',
  } = options;

  // Build transformation string
  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  const transformString = transformations.join(',');

  // Support both /image/upload and /upload
  const uploadPattern = /\/(image\/upload|upload)\//;

  if (uploadPattern.test(url)) {
    // Check if there are already transformations (usually between /upload/ and /v123.../ or publicId)
    // Cloudinary URLs: .../upload/[transformations]/[version]/[public_id]

    const parts = url.split(uploadPattern);
    // split with capturing group returns: [before, captured_group, after]
    if (parts.length >= 3) {
      const before = parts[0];
      const upload = parts[1];
      const after = parts.slice(2).join('/'); // In case there are more / (unlikely with this regex)

      // If 'after' starts with a version (v123) or doesn't have a transformation block,
      // we insert our transformations.
      if (after.startsWith('v') && /v\d+\//.test(after)) {
        return `${before}/${upload}/${transformString}/${after}`;
      }

      // If there's already a transformation block (doesn't start with v+digit), 
      // replace it or prepend to it. For simplicity, we'll replace or just insert.
      // Cloudinary allows chaining: /upload/w_100/v1/... or /upload/w_100,c_fill/v1/...
      return `${before}/${upload}/${transformString}/${after}`;
    }
  }

  return url;
}

/**
 * Get thumbnail version of image
 */
export function getThumbnail(url: string, size: number = 200): string {
  return getCloudinaryUrl(url, {
    width: size,
    height: size,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  });
}

/**
 * Get responsive image URLs for srcset
 */
export function getResponsiveUrls(url: string): {
  srcSet: string;
  sizes: string;
} {
  const widths = [320, 640, 768, 1024, 1280, 1536];

  const srcSet = widths
    .map(width => {
      const optimizedUrl = getCloudinaryUrl(url, {
        width,
        quality: 'auto',
        format: 'auto',
      });
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');

  const sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  return { srcSet, sizes };
}

/**
 * Preload critical images
 */
export function preloadImage(url: string, options?: Parameters<typeof getCloudinaryUrl>[1]) {
  const optimizedUrl = getCloudinaryUrl(url, options);

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = optimizedUrl;

  document.head.appendChild(link);
}

/**
 * Cloudinary Image Component Props Helper
 */
export function getImageProps(
  url: string,
  alt: string,
  options?: Parameters<typeof getCloudinaryUrl>[1]
) {
  const optimizedUrl = getCloudinaryUrl(url, options);
  const { srcSet, sizes } = getResponsiveUrls(url);

  return {
    src: optimizedUrl,
    srcSet,
    sizes,
    alt,
    loading: 'lazy' as const,
  };
}

// Example usage:
//
// import { getCloudinaryUrl, getThumbnail, getImageProps } from '@/lib/utils/cloudinary';
//
// // Basic optimization
// const optimizedUrl = getCloudinaryUrl(imageUrl, { width: 800, quality: 'auto' });
//
// // Thumbnail
// const thumbUrl = getThumbnail(imageUrl, 200);
//
// // Responsive image
// const imgProps = getImageProps(imageUrl, 'Product image', { width: 1200 });
// <img {...imgProps} />
