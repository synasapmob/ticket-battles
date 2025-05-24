import Profile from 'layout/Profile';

export interface ProfilePageProps {
  params: {
    address: string;
  };
}

export default async ({ params }: ProfilePageProps) => {
  return <Profile params={params} />;
};
