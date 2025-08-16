import { useState, useEffect, useRef } from "react";
import "./Home.css";
import mainImage from "../../assets/ok.jpg";

import Marquee from "../../components/Marquee/Marquee";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import formatAmPm from "../../utils/formatAmPm";

const transition = { duration: 0.65, ease: [0.43, 0.13, 0.23, 0.96] };

const Home = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  // Lyrics with timestamps (in seconds)
  const lyrics = [
    { time: 0, text: "🎵 Happy Birthday Song Starting... 🎵" },
    { time: 2, text: "It's your birthday, wherever you are" },
    { time: 5, text: "Take a minute and shine like a star" },
    { time: 8, text: "You can do whatever you wanna do" },
    { time: 12, text: "These 24 hours are all about you" },
    { time: 16, text: "It's your special day (get up on the dance floor)" },
    { time: 20, text: "🎂 Happy Birthday! 🎂" }
  ];

  useEffect(() => {
    // Initialize audio elements
    audioRef.current = new Audio('/audio/birthday.mp3');
    clickSoundRef.current = new Audio('/audio/click-sound.mp3');
    
    audioRef.current.volume = 0.7;
    clickSoundRef.current.volume = 0.5;

    // Event listeners for audio
    const handleTimeUpdate = () => {
      if (!audioRef.current) return;
      const currentTime = audioRef.current.currentTime;
      
      // Find current lyric line
      for (let i = lyrics.length - 1; i >= 0; i--) {
        if (currentTime >= lyrics[i].time) {
          setCurrentLine(i);
          break;
        }
      }
    };

    const handleSongEnd = () => {
      setIsPlaying(false);
      setCurrentLine(0);
      setShowLyrics(false);
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleSongEnd);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleSongEnd);
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (clickSoundRef.current) {
        clickSoundRef.current = null;
      }
    };
  }, []);

  const toggleSong = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setShowLyrics(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setShowLyrics(true);
      } catch (error) {
        console.log('Playback failed:', error);
      }
    }
  };

  const playClickSound = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(console.error);
    }
  };

  const handleImageClick = () => {
    playClickSound();
    if (!isPlaying) {
      toggleSong();
    }
  };

  return (
    <main className="main-wrapper h-screen w-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Audio controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button 
          onClick={toggleSong}
          className={`p-3 text-white rounded-full transition-all hover:scale-110 ${
            isPlaying 
              ? 'bg-green-500 animate-pulse' 
              : 'bg-pink-500 hover:bg-pink-600'
          }`}
          title={isPlaying ? "Stop Song" : "Play Happy Birthday Song"}
        >
          {isPlaying ? '⏸️' : '🎂'}
        </button>
        
        <button 
          onClick={() => setShowLyrics(!showLyrics)}
          className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all hover:scale-110"
          title="Toggle Lyrics"
        >
          📝
        </button>
      </div>

      {/* Lyrics Display */}
      {showLyrics && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 bg-black bg-opacity-70 text-white p-4 rounded-lg max-w-md text-center"
        >
          <div className="space-y-2">
            {lyrics.map((lyric, index) => (
              <motion.p
                key={index}
                className={`transition-all duration-500 ${
                  index === currentLine 
                    ? 'text-yellow-300 font-bold text-lg scale-110' 
                    : index < currentLine 
                      ? 'text-gray-400 text-sm' 
                      : 'text-white text-sm opacity-50'
                }`}
                animate={index === currentLine ? { scale: 1.1 } : { scale: 1 }}
              >
                {lyric.text}
              </motion.p>
            ))}
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 bg-gray-600 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-pink-500 h-full"
              style={{
                width: audioRef.current 
                  ? `${(audioRef.current.currentTime / audioRef.current.duration) * 100 || 0}%`
                  : '0%'
              }}
            />
          </div>
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute top-0 mt-12 text-center"
      >
        <p>"From the orion stars"</p>
        <p>Judy Walker</p>
      </motion.div>
      
      {/* Mobile */}
      <Link
        className="w-48 md:w-72 overflow-hidden rounded-xl md:hidden"
        to={"/judy"}
        onClick={handleImageClick}
      >
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          transition={transition}
          src={mainImage}
          alt="Birthday person"
          className="select-none cursor-pointer rounded-xl"
        />
      </Link>
      
      {/* Desktop */}
      <Link
        className="w-48 md:w-72 overflow-hidden rounded-xl hidden md:block"
        to={"/judy"}
        onClick={handleImageClick}
      >
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={transition}
          src={mainImage}
          alt="Birthday person"
          className="select-none cursor-pointer rounded-xl"
        />
      </Link>
      
      <Marquee
        transition={{ ...transition }}
        message="Happy Birthday."
        small={false}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute bottom-0 mb-12 text-center"
      >
        <p>{formatAmPm(new Date())}</p>
        <p>20.01.2077</p>
      </motion.div>
    </main>
  );
};

export default Home;