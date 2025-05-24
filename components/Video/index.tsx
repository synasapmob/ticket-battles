import { forwardRef } from '@chakra-ui/react';
import { VideoHTMLAttributes } from 'react';

export default forwardRef<VideoHTMLAttributes<HTMLVideoElement>, 'video'>(
  (props, ref) => {
    return (
      <video
        ref={ref}
        playsInline={true}
        // muted attenion: https://stackoverflow.com/questions/69427603/autoplay-on-video-is-not-working-after-refreshing-page
        muted={true}
        {...props}
      >
        <p>{`Your browser doesn't support HTML video. Here is a`}</p>
      </video>
    );
  }
);
