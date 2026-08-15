import { z } from 'zod'
 
export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})
 
export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
})
 
export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
 
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
 
export const profileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80),
})
 
export const blogSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(150),
  excerpt: z.string().trim().max(300).optional().or(z.literal('')),
  content: z.string().trim().min(1, 'Content is required'),
  category: z.string().optional().or(z.literal('')),
  tags: z.string().optional().or(z.literal('')), // comma-separated in the form, split before submit
  status: z.enum(['draft', 'published', 'archived']),
  metaTitle: z.string().trim().max(70).optional().or(z.literal('')),
  metaDescription: z.string().trim().max(160).optional().or(z.literal('')),
})
 
export const projectSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(150),
  description: z.string().trim().min(1, 'Description is required'),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  completionDate: z.string().optional().or(z.literal('')),
  status: z.enum(['draft', 'published']),
  customerName: z.string().optional().or(z.literal('')),
  customerRating: z.coerce.number().min(1).max(5).optional(),
  customerReview: z.string().optional().or(z.literal('')),
})
 
export const serviceSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120),
  shortDescription: z.string().trim().max(250).optional().or(z.literal('')),
  description: z.string().trim().min(1, 'Description is required'),
  icon: z.string().trim().min(1, 'Pick an icon'),
  pricingType: z.enum(['fixed', 'range', 'quote']),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  status: z.enum(['draft', 'published']),
})
 
export const testimonialSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80),
  location: z.string().optional().or(z.literal('')),
  rating: z.coerce.number().min(1).max(5),
  text: z.string().trim().min(1, 'Testimonial text is required').max(1000),
  videoUrl: z.union([z.literal(''), z.string().trim().url('Enter a valid video URL')]).optional(),
  isFeatured: z.boolean().optional(),
})
 
export const faqSchema = z.object({
  question: z.string().trim().min(1, 'Question is required').max(250),
  answer: z.string().trim().min(1, 'Answer is required').max(2000),
  category: z.string().optional().or(z.literal('')),
  isPublished: z.boolean().optional(),
})
 
export const albumSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(150),
  description: z.string().optional().or(z.literal('')),
  status: z.enum(['draft', 'published']),
})
 