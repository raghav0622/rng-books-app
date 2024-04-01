'use client';

import AppLogo from '@/components/AppLogo';
import { useAuthAPI } from '@/db';
import { RNGForm } from '@/forms';
import { UserSignInSchema } from '@/schema';
import { Container, Link, Paper, Typography } from '@mui/material';
import { useRouter } from 'next-nprogress-bar';

export default function SignInPage() {
  const { signin } = useAuthAPI();
  const router = useRouter();

  return (
    <Container maxWidth="xs" className="mt-12">
      <Paper
        sx={{ boxShadow: 8 }}
        className="flex flex-col p-8 gap-4 items-center justify-center"
      >
        {/* <Stack justify="center" align="center"> */}
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
              type: 'text',
            },
          ]}
        />

        <Typography>
          Don&apos;t Have Account?&nbsp;
          <Link
            className="cursor-pointer"
            onClick={() => router.push('/auth/signup')}
          >
            Sign Up
          </Link>
        </Typography>
        {/* </Stack> */}
      </Paper>
    </Container>
  );
}
