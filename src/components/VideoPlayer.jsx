import { useEffect, useRef } from 'react';
import cloudinary from 'cloudinary-video-player';
import 'cloudinary-video-player/cld-video-player.min.css';

const VideoPlayer = ({ id, publicId, onEnded, ...props }) => {
  const cloudinaryRef = useRef();
  const playerRef = useRef();
  const transformation = {
    crop: 'fill',
    gravity: 'auto',
    aspectRatio: '9:16',
    width: 250,
  };

  useEffect(() => {
    if (cloudinaryRef.current) return;

    cloudinaryRef.current = cloudinary;

    const player = cloudinaryRef.current.videoPlayer(playerRef.current, {
      cloud_name: 'demo',
      secure: true,
      muted: true,
      controls: true,
      transformation: transformation,
      posterOptions: transformation,
    });

    player.on('ended', onEnded);

    player.source(publicId);
  }, [publicId, onEnded]);

  return (
    <video ref={playerRef} id={id} className="cld-video-player" {...props} />
  );
};

export default VideoPlayer;
