import {
  create,
  forgotPassword,
  getProfile,
  grantValid,
  reVerifyEmail,
  sendCallToken,
  signIn,
  updatePassword,
  updateProfile,
  verifyEmail,
} from '@/controllers/user';
import { isValidPassResetToken } from '@/middleware/auth';
import { validate } from '@/middleware/validator';
import {
  CreateUserSchema,
  EmailVerificationBody,
  SignInSchema,
} from '@/utils/validationSchema';
import { Router } from 'express';
///
const router = Router();

router.post('/create', validate(CreateUserSchema), create);
router.get('/profile/:id', getProfile);

router.post('/sign-in', validate(SignInSchema), signIn);
router.post('/verify-email', validate(EmailVerificationBody), verifyEmail);
router.post('/re-verify-email', reVerifyEmail);
router.post('/forgot-password', forgotPassword);
router.post(
  '/verify-password-reset-token',
  validate(EmailVerificationBody),
  isValidPassResetToken,
  grantValid
);

router.post(
  '/update-password',
  validate(EmailVerificationBody),
  isValidPassResetToken,
  updatePassword
);

router.post('/update-profile', updateProfile);
router.post('/send-mail', sendCallToken);

export default router;
