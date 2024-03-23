import { FormError } from '@rng-apps/forms';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useAuth } from 'reactfire';
import { User, UserSignIn, UserSignUp } from '../1-schema';
import { useUserDB } from './0-user';

export const useAuthAPI = () => {
  const auth = useAuth();
  const { createUser } = useUserDB();
  const signin = async (payload: UserSignIn): Promise<void> => {
    await signInWithEmailAndPassword(auth, payload.email, payload.password);
  };

  const signup = async (payload: UserSignUp): Promise<User> => {
    try {
      const {
        user: { uid },
      } = await createUserWithEmailAndPassword(
        auth,
        payload.email,
        payload.password
      );

      const user = await createUser({
        emailVerified: false,
        id: uid,
        email: payload.email,
        name: payload.name,
        photoUrl: '',
        companies: [],
        autoCompleteKeys: [],
      });

      return user;
    } catch (err) {
      //@ts-ignore
      if (err.code === AuthErrorCodes.EMAIL_EXISTS) {
        throw new FormError('Email is already linked with another account');
      } else {
        //@ts-ignore
        throw new APIError(err.code);
      }
    }
  };

  const signout = async () => {
    await auth.signOut();
  };

  return { signin, signup, signout };
};
