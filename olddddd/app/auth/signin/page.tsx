'use client';

import AppLogo from '@/components/App/AppLogo';
import { useAuthAPI } from '@/db';
import { UserSignInSchema } from '@/schema';
import { Anchor, Paper, Stack, Text } from '@mantine/core';
import { RNGForm } from '@rng-apps/forms';
import { useRouter } from 'next-nprogress-bar';

export default function SignInPage() {
  const { signin } = useAuthAPI();
  const router = useRouter();

  return (
    <Paper radius="md" withBorder className="max-w-sm mx-auto mt-8">
      <Stack gap={'sm'} p="lg" justify="center" align="center">
        <AppLogo />

        <RNGForm
          name="sign-in-form"
          schema={UserSignInSchema}
          defaultValues={{ email: undefined, password: undefined }}
          title="Welcome Back!"
          description="Please enter details to sign in."
          submitButton={{ label: 'Login', className: 'w-full' }}
          onSubmit={async (payload) => {
            await signin(payload);
            router.push('/');
          }}
          uiSchema={[
            {
              name: 'email',
              label: 'Email',
              autoFocus: true,
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
          Don&apos;t Have Account?&nbsp;
          <Anchor onClick={() => router.push('/auth/signup')}>Sign Up</Anchor>
        </Text>
      </Stack>
    </Paper>
  );
}
