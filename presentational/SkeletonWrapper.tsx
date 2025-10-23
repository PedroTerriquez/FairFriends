import React from 'react';
import { Skeleton } from 'moti/skeleton';

const SkeletonWrapper = ({ children, show = true}: { children: React.ReactElement }) => (
  <Skeleton
    show={show}
    colorMode="light"
    transition={{
      type: 'timing',
      duration: 1000,
    }}
  >
    {children}
  </Skeleton>
);

export default SkeletonWrapper;
