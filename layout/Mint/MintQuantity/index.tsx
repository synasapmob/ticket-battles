import {
  Icon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';

import MinusIcon from 'public/line/minus.svg';
import PlusIcon from 'public/line/plus.svg';

interface PoolQuantityProps {
  quantity: string;
  setQuantity: React.Dispatch<React.SetStateAction<string>>;
}

export default ({ quantity, setQuantity }: PoolQuantityProps) => {
  return (
    <NumberInput
      flex={1}
      variant="solid"
      min={1}
      defaultValue={quantity}
      value={quantity}
      onChange={event => setQuantity(event)}
    >
      <NumberDecrementStepper>
        <Icon as={MinusIcon} />
      </NumberDecrementStepper>

      <NumberInputField />

      <NumberIncrementStepper>
        <Icon as={PlusIcon} />
      </NumberIncrementStepper>
    </NumberInput>
  );
};
