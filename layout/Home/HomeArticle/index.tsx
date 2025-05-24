import { Flex } from '@chakra-ui/react';
import { useState } from 'react';

import HomeArticleBanner from './HomeArticleBanner';
import HomeArticleList from './HomeArticleList';

export default () => {
  const [hover, setHover] = useState<number>();

  return (
    <Flex
      gap={4}
      mt={12}
      mb="7.5rem"
      flexDirection={{
        base: 'column-reverse',
        lg: 'row',
      }}
    >
      <HomeArticleList hover={hover} setHover={setHover} />

      <HomeArticleBanner hover={hover} />
    </Flex>
  );
};
