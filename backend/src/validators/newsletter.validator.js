import { body } from 'express-validator'

// See auth.validator.js for why plain lowercase is used instead of
// express-validator's `.normalizeEmail()` (it strips dots from Gmail
// addresses, which would silently store a different email than the
// user typed and break later exact-match lookups, e.g. unsubscribe-by-email).
export const subscribeValidator = [
  body('email').trim().isEmail().withMessage('A valid email is required').customSanitizer((v) => v.toLowerCase()),
]
