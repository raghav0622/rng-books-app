import dynamic from 'next/dynamic';

const SignInScreen = dynamic(() => import('@/screens/SignInScreen'));

export default function SignInPage() {
  return <SignInScreen />;
}
