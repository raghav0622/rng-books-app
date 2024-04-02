import dynamic from 'next/dynamic';

const HomeScreen = dynamic(() => import('@/screens/HomeScreen'));

export default function Page() {
  return <HomeScreen />;
}
