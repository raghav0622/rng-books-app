import { Title, TitleProps } from '@mantine/core';

const AppLogo: React.FC<TitleProps> = ({ children, ...rest }) => {
  return (
    <Title order={4} {...rest}>
      RNG&bull;<span className="font-semibold">Books</span>
    </Title>
  );
};

export default AppLogo;
