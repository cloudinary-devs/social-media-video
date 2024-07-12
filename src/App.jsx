import React, { useState, useEffect, useRef } from 'react';
import VideoPlayer from './components/VideoPlayer';
import './App.css';

function App() {
  const sources = ['surfers', 'car-film', 'rocky-mountains', 'sailing_boat'];
  const [videoList, setVideoList] = useState([]);
  const containerRef = useRef(null);
  const phoneFrameRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    setVideoList([...sources, ...sources, ...sources]);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const phoneFrame = phoneFrameRef.current;
    if (!container || !phoneFrame) return;

    let startY;
    let startScrollTop;

    const handleTouchStart = (e) => {
      startY = e.touches[0].pageY;
      startScrollTop = container.scrollTop;
    };

    const handleTouchMove = (e) => {
      if (!startY) return;
      const deltaY = e.touches[0].pageY - startY;
      container.scrollTop = startScrollTop - deltaY;
      e.preventDefault();
    };

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setVideoList((prevList) => [...prevList, ...sources]);
      }
    };

    phoneFrame.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });
    phoneFrame.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    });
    container.addEventListener('scroll', handleScroll);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target.querySelector('video');
          if (entry.isIntersecting) {
            videoElement.play();
          } else {
            videoElement.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    document
      .querySelectorAll('.cld-video-player-container')
      .forEach((container) => {
        observerRef.current.observe(container);
      });

    return () => {
      phoneFrame.removeEventListener('touchstart', handleTouchStart);
      phoneFrame.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('scroll', handleScroll);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [videoList]);

  const scrollToNextVideo = (currentIndex) => {
    const container = containerRef.current;
    if (!container) return;

    const nextVideoContainer = document.getElementById(
      `container-${currentIndex + 1}`
    );
    if (nextVideoContainer) {
      container.scrollTo({
        top: nextVideoContainer.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const renderVideoPlayers = () => {
    return videoList.map((source, index) => {
      const likes = Math.floor(Math.random() * 100) + 1;
      const comments = Math.floor(Math.random() * 100) + 1;

      return (
        <div
          key={`${source}-${index}`}
          id={`container-${index}`}
          className="cld-video-player-container"
        >
          <VideoPlayer
            id={`player-${index}`}
            publicId={`docs/${source}`}
            onEnded={() => scrollToNextVideo(index)}
          />
          <div className="video-info">
            <p>
              {comments} Comments | {likes} Likes
            </p>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="phone-frame" ref={phoneFrameRef}>
      <main className="main">
        <div ref={containerRef} className="container">
          {renderVideoPlayers()}
        </div>
      </main>
    </div>
  );
}

export default App;
