/**
 * Post schema validation using Zod
 * Validates incoming post data
 */

import { z } from 'zod';

/**
 * Schema for creating a new post
 */
export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .trim(),

  content: z
    .string()
    .min(1, 'Content is required')
    .max(10000, 'Content must be less than 10000 characters')
    .trim(),

  imageUrl: z.string().url('Invalid image URL').optional(),
});

/**
 * Schema for pagination query parameters
 */
export const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0, 'Page must be greater than 0'),

  limit: z
    .string()
    .optional()
    .default('10')
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0 && val <= 50, 'Limit must be between 1 and 50'),
});

/**
 * Schema for post ID parameter
 */
export const postIdSchema = z.object({
  id: z
    .string()
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0, 'Post ID must be a positive integer'),
});

/**
 * Schema for user ID query parameter
 */
export const userIdQuerySchema = z.object({
  userId: z
    .string()
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0, 'User ID must be a positive integer'),
});
