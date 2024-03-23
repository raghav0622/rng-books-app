'use client';

import AppLogo from '@/components/App/AppLogo';
import { useAuthAPI } from '@/db';
import { UserSignUpSchema } from '@/schema';
import { Anchor, Paper, Stack, Text } from '@mantine/core';
import { RNGForm } from '@rng-apps/forms';
import { useRouter } from 'next-nprogress-bar';

export default function SignUpPage() {
  const { signup } = useAuthAPI();
  const router = useRouter();

  return (
    <Paper radius="md" withBorder className="max-w-sm mx-auto mt-8">
      <Stack gap={'sm'} p="lg" justify="center" align="center">
        <AppLogo />

        <RNGForm
          name="sign-up-form"
          schema={UserSignUpSchema}
          defaultValues={{
            email: undefined,
            password: undefined,
            name: undefined,
          }}
          title="Welcome!"
          description="Please enter details to sign up."
          submitButton={{ label: 'Login', className: 'w-full' }}
          onSubmit={async (payload) => {
            await signup(payload);
            router.push('/');
          }}
          uiSchema={[
            {
              name: 'name',
              label: 'Name',
              autoFocus: true,
              type: 'text',
            },
            {
              name: 'email',
              label: 'Email',
              type: 'text',
            },
            {
              name: 'password',
              label: 'Password',
              type: 'password',
            },
          ]}
        />

        <Text>
          Already Have Account?&nbsp;
          <Anchor onClick={() => router.push('/auth/signin')}>Sign In</Anchor>
        </Text>
      </Stack>
    </Paper>
  );
}
