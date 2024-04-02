import dynamic from 'next/dynamic';

const SignUpScreen = dynamic(() => import('@/screens/SignUpScreen'));

export default function SignUpPage() {
  return <SignUpScreen />;
}
