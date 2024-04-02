'use client';

import AppLogo from '@/components/AppLogo';
import { useAuthAPI } from '@/db';
import { RNGForm } from '@/forms';
import { UserSignUpSchema } from '@/schema';
import { Container, Link, Paper, Typography } from '@mui/material';
import { useRouter } from 'next-nprogress-bar';

export default function SignUpPage() {
  const { signup } = useAuthAPI();
  const router = useRouter();

  return (
    <Container maxWidth="xs" className="mt-12">
      <Paper
        sx={{ boxShadow: 8 }}
        className="flex flex-col p-8 gap-4 items-center justify-center"
      >
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

        <Typography>
          Already Have Account?&nbsp;
          <Link
            className="cursor-pointer"
            onClick={() => router.push('/auth/signin')}
          >
            Sign In
          </Link>
        </Typography>
        {/* </Stack> */}
      </Paper>
    </Container>
  );
}
