import { HStack, Icon, Text } from '@chakra-ui/react';

import ETHIcon from 'public/fill/eth.svg';
import SuiIcon from 'public/fill/sui.svg';
import { TypeCurrencyEnum } from 'types';

interface CurrencyProps {
  price: number | string | undefined;
  symbol: string | undefined;
}

export default ({ price, symbol }: CurrencyProps) => {
  const ListIcon = [
    {
      key: TypeCurrencyEnum.SUI,
      icon: SuiIcon,
    },
    {
      key: TypeCurrencyEnum.ETH,
      icon: ETHIcon,
    },
  ];

  return (
    <HStack>
      <Text color="shader.a.100" fontWeight="bold">
        {price || 0} {symbol}
      </Text>

      <Icon
        as={ListIcon.find(meta => meta.key === symbol)?.icon}
        width={4}
        height={4}
      />
    </HStack>
  );
};
