import { Button, ButtonProps } from '@chakra-ui/react';

export default (props?: Partial<ButtonProps>) => {
  return (
    <Button
      color="accents.green"
      justifyContent="center"
      loadingText="Max"
      width={14}
      height={6}
      {...props}
    >
      Max
    </Button>
  );
};
