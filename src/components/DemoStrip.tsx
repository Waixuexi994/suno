import React, { useState } from 'react';
import { Play, Music, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import MusicPlayer from './MusicPlayer';

interface DemoTrack {
  title: string;
  genre: string;
  duration: string;
  image: string;
  audioUrl: string;
  description: string;
}

const DemoStrip: React.FC = () => {
  const { t } = useLanguage();
  const [currentTrack, setCurrentTrack] = useState<DemoTrack | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const demos: DemoTrack[] = [
    { 
      title: 'Electronic Vibes', 
      genre: 'Electronic', 
      duration: '2:34', 
      image: 'https://images.pexels.com/photos/167637/pexels-photo-167637.jpeg?auto=compress&cs=tinysrgb&w=400',
      audioUrl: 'https://cdn1.suno.ai/b29057b3-a026-4432-a875-a80e3aa67ace.mp3',
      description: 'AI生成的电子音乐，充满活力的合成器和动感节拍'
    },
    { 
      title: 'Acoustic Dreams', 
      genre: 'Acoustic', 
      duration: '3:12', 
      image: 'https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg?auto=compress&cs=tinysrgb&w=400',
      audioUrl: 'https://cdn1.suno.ai/a989528c-36bb-4e3e-8374-a8baf348affa.mp3',
      description: 'AI生成的原声吉他音乐，舒缓的旋律和温暖的和声'
    },
    { 
      title: 'Hip Hop Beats', 
      genre: 'Hip Hop', 
      duration: '2:58', 
      image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
      audioUrl: 'https://cdn1.suno.ai/b29057b3-a026-4432-a875-a80e3aa67ace.mp3',
      description: 'AI生成的嘻哈音乐，重低音和清脆的打击乐'
    },
    { 
      title: 'Jazz Fusion', 
      genre: 'Jazz', 
      duration: '4:21', 
      image: 'https://images.pexels.com/photos/210854/pexels-photo-210854.jpeg?auto=compress&cs=tinysrgb&w=400',
      audioUrl: 'https://cdn1.suno.ai/b29057b3-a026-4432-a875-a80e3aa67ace.mp3',
      description: 'AI生成的爵士融合音乐，精致的萨克斯和钢琴即兴演奏'
    },
  ];

  const handlePlayDemo = (demo: DemoTrack) => {
    setCurrentTrack(demo);
    setShowPlayer(true);
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
    setCurrentTrack(null);
  };

  return (
    <>
      <section id="demos" className="py-20 bg-gray-50 dark:bg-dark-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {t('demos.title').split('Magic').map((part, index) => (
                <React.Fragment key={index}>
                  {part}
                  {index === 0 && <span className="bg-gradient-brand bg-clip-text text-transparent">Magic</span>}
                </React.Fragment>
              ))}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              {t('demos.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {demos.map((demo, index) => (
              <div
                key={demo.title}
                className="group relative bg-white dark:bg-dark-800/50 rounded-3xl overflow-hidden backdrop-blur-sm border border-gray-200 dark:border-white/10 hover:border-primary-500/50 transition-all duration-300 animate-fade-up cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handlePlayDemo(demo)}
              >
                <div className="aspect-square relative">
                  <img
                    src={demo.image}
                    alt={demo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 dark:from-dark-900/80 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayDemo(demo);
                      }}
                    >
                      <Play className="w-6 h-6 text-white ml-1" />
                    </button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-brand px-3 py-1 rounded-full text-xs font-medium text-white">
                      {demo.genre}
                    </span>
                  </div>
                  {/* Audio indicator */}
                  <div className="absolute bottom-4 right-4 opacity-70">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">{demo.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{demo.description}</p>
                  <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-sm">
                    <span className="flex items-center space-x-1">
                      <Music className="w-4 h-4" />
                      <span>{demo.genre}</span>
                    </span>
                    <span>{demo.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Music Player Modal */}
      {showPlayer && currentTrack && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    正在播放演示音乐
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {currentTrack.genre} • {currentTrack.duration}
                  </p>
                </div>
                <button
                  onClick={handleClosePlayer}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              {/* Music Player */}
              <MusicPlayer
                audioUrl={currentTrack.audioUrl}
                title={currentTrack.title}
                imageUrl={currentTrack.image}
                autoPlay={true}
                onEnded={handleClosePlayer}
              />

              {/* Track Info */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-800/50 rounded-xl">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">关于这首音乐</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{currentTrack.description}</p>
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  <p>音频源: {currentTrack.audioUrl}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DemoStrip;