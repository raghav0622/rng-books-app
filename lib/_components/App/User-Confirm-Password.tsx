import { useCurrentUser } from '@/_schema';
import { modals } from '@mantine/modals';
import { FormError, RNGForm, string } from '@rng-apps/forms';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import React from 'react';
import { useAuth } from 'reactfire';
import { z } from 'zod';

const UserConfirmPassword: React.FC<{
  title: string;
  description?: string;
  children: (open: () => void) => React.ReactNode;
  onSuccess: () => void | Promise<void>;
}> = ({ onSuccess, title, description, children }) => {
  const { currentUser } = useAuth();
  const user = useCurrentUser();
  const openModal = () =>
    modals.open({
      modalId: 'confirm-password',
      title,
      children: (
        <RNGForm
          name="confirm-user-password"
          schema={z.object({ password: string })}
          defaultValues={{
            password: '',
          }}
          description={description}
          uiSchema={[
            {
              name: 'password',
              label: 'Enter your Password',
              type: 'password',
              autoFocus: true,
            },
          ]}
          submitButton={{ label: 'Confirm Password' }}
          onSubmit={async (payload) => {
            try {
              const credential = EmailAuthProvider.credential(
                user.email,
                payload.password
              );
              currentUser &&
                (await reauthenticateWithCredential(currentUser, credential));
              await onSuccess();
              modals.close('confirm-password');
            } catch (err: any) {
              if (err.code === 'auth/invalid-login-credentials') {
                throw new FormError('Invalid Password!!');
              } else {
                throw new FormError(err.message);
              }
            }
          }}
        />
      ),
    });
  return children(() => openModal());
};

export default UserConfirmPassword;
