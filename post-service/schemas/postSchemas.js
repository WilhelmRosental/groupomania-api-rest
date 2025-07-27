/**
 * Post validation schemas using Zod
 * Defines validation rules for post-related operations
 */

const { z } = require('zod');

/**
 * Schema for post creation validation
 */
const createPostSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .trim(),
  
  content: z.string()
    .min(1, 'Content is required')
    .max(5000, 'Content must be less than 5000 characters')
    .trim(),
  
  imageUrl: z.string()
    .url('Invalid image URL')
    .optional()
});

/**
 * Schema for pagination query parameters validation
 */
const paginationQuerySchema = z.object({
  page: z.string()
    .regex(/^\d+$/, 'Page must be a valid number')
    .transform(val => parseInt(val, 10))
    .refine(val => val >= 1, 'Page must be 1 or greater')
    .optional()
    .default('1'),
  
  limit: z.string()
    .regex(/^\d+$/, 'Limit must be a valid number')
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0 && val <= 50, 'Limit must be between 1 and 50')
    .optional()
    .default('10')
});

module.exports = {
  createPostSchema,
  paginationQuerySchema
};