import React, { useState } from 'react';
import { Music, Video, Play, Download, Wand2, Clock, Sparkles, Film, Settings, Sliders, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { musicApiService, MusicTrack } from '../services/musicApi';
import MusicPlayer from './MusicPlayer';

const MusicVideoStudio: React.FC = () => {
  const [musicPrompt, setMusicPrompt] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationProgress, setGenerationProgress] = useState('0%');
  const [generationStatus, setGenerationStatus] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generatedTracks, setGeneratedTracks] = useState<MusicTrack[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 音乐生成选项
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedTone, setSelectedTone] = useState('');
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [tempo, setTempo] = useState(120);
  const [duration, setDuration] = useState(180);

  // MV风格选项
  const [selectedMVStyle, setSelectedMVStyle] = useState('');
  const [selectedColorScheme, setSelectedColorScheme] = useState('');
  const [selectedTransition, setSelectedTransition] = useState('');

  const { t } = useLanguage();

  // 音乐风格选项
  const genres = [
    { id: 'pop', name: t('genre.pop'), desc: t('genre.pop.desc'), color: 'bg-pink-500' },
    { id: 'rock', name: t('genre.rock'), desc: t('genre.rock.desc'), color: 'bg-red-500' },
    { id: 'jazz', name: t('genre.jazz'), desc: t('genre.jazz.desc'), color: 'bg-yellow-500' },
    { id: 'electronic', name: t('genre.electronic'), desc: t('genre.electronic.desc'), color: 'bg-blue-500' },
    { id: 'folk', name: t('genre.folk'), desc: t('genre.folk.desc'), color: 'bg-green-500' },
    { id: 'chinese', name: t('genre.chinese'), desc: t('genre.chinese.desc'), color: 'bg-purple-500' },
    { id: 'ambient', name: t('genre.ambient'), desc: t('genre.ambient.desc'), color: 'bg-teal-500' },
    { id: 'hiphop', name: t('genre.hiphop'), desc: t('genre.hiphop.desc'), color: 'bg-orange-500' },
  ];

  // 情感风格
  const moods = [
    { id: 'happy', name: t('mood.happy'), desc: t('mood.happy.desc'), emoji: '😊' },
    { id: 'sad', name: t('mood.sad'), desc: t('mood.sad.desc'), emoji: '😢' },
    { id: 'energetic', name: t('mood.energetic'), desc: t('mood.energetic.desc'), emoji: '🔥' },
    { id: 'calm', name: t('mood.calm'), desc: t('mood.calm.desc'), emoji: '🌊' },
    { id: 'romantic', name: t('mood.romantic'), desc: t('mood.romantic.desc'), emoji: '💕' },
    { id: 'mysterious', name: t('mood.mysterious'), desc: t('mood.mysterious.desc'), emoji: '🌙' },
    { id: 'epic', name: t('mood.epic'), desc: t('mood.epic.desc'), emoji: '⚡' },
    { id: 'inspiring', name: t('mood.inspiring'), desc: t('mood.inspiring.desc'), emoji: '🚀' },
  ];

  // 音色选项
  const tones = [
    { id: 'soft', name: 'Soft', desc: 'Gentle and delicate' },
    { id: 'powerful', name: 'Powerful', desc: 'Strong and forceful' },
    { id: 'bright', name: 'Bright', desc: 'Clear and bright' },
    { id: 'warm', name: 'Warm', desc: 'Warm and rich' },
    { id: 'heavy', name: 'Heavy Metal', desc: 'Heavy metal style' },
    { id: 'ethereal', name: 'Ethereal', desc: 'Floating and ethereal' },
  ];

  // 乐器选项
  const instruments = [
    { id: 'piano', name: t('instrument.piano'), icon: '🎹' },
    { id: 'guitar', name: t('instrument.guitar'), icon: '🎸' },
    { id: 'violin', name: t('instrument.violin'), icon: '🎻' },
    { id: 'drums', name: t('instrument.drums'), icon: '🥁' },
    { id: 'saxophone', name: t('instrument.saxophone'), icon: '🎷' },
    { id: 'flute', name: t('instrument.flute'), icon: '🪈' },
    { id: 'erhu', name: t('instrument.erhu'), icon: '🎵' },
    { id: 'guzheng', name: t('instrument.guzheng'), icon: '🎶' },
  ];

  // MV风格选项
  const mvStyles = [
    { id: 'cinematic', name: t('mvstyle.cinematic'), desc: t('mvstyle.cinematic.desc'), preview: '🎬' },
    { id: 'anime', name: t('mvstyle.anime'), desc: t('mvstyle.anime.desc'), preview: '🎨' },
    { id: 'abstract', name: t('mvstyle.abstract'), desc: t('mvstyle.abstract.desc'), preview: '🌈' },
    { id: 'nature', name: t('mvstyle.nature'), desc: t('mvstyle.nature.desc'), preview: '🌿' },
    { id: 'urban', name: t('mvstyle.urban'), desc: t('mvstyle.urban.desc'), preview: '🌃' },
    { id: 'retro', name: t('mvstyle.retro'), desc: t('mvstyle.retro.desc'), preview: '📼' },
    { id: 'fantasy', name: t('mvstyle.fantasy'), desc: t('mvstyle.fantasy.desc'), preview: '✨' },
    { id: 'minimalist', name: t('mvstyle.minimalist'), desc: t('mvstyle.minimalist.desc'), preview: '⚪' },
  ];

  // 色彩方案
  const colorSchemes = [
    { id: 'warm', name: t('color.warm'), desc: t('color.warm.desc'), gradient: 'from-orange-400 to-red-500' },
    { id: 'cool', name: t('color.cool'), desc: t('color.cool.desc'), gradient: 'from-blue-400 to-purple-500' },
    { id: 'monochrome', name: t('color.monochrome'), desc: t('color.monochrome.desc'), gradient: 'from-gray-400 to-gray-800' },
    { id: 'neon', name: t('color.neon'), desc: t('color.neon.desc'), gradient: 'from-pink-400 to-cyan-400' },
    { id: 'pastel', name: t('color.pastel'), desc: t('color.pastel.desc'), gradient: 'from-pink-200 to-blue-200' },
    { id: 'sunset', name: t('color.sunset'), desc: t('color.sunset.desc'), gradient: 'from-yellow-400 to-pink-500' },
  ];

  // 转场效果
  const transitions = [
    { id: 'smooth', name: t('transition.smooth'), desc: t('transition.smooth.desc') },
    { id: 'dynamic', name: t('transition.dynamic'), desc: t('transition.dynamic.desc') },
    { id: 'fade', name: t('transition.fade'), desc: t('transition.fade.desc') },
    { id: 'zoom', name: t('transition.zoom'), desc: t('transition.zoom.desc') },
    { id: 'slide', name: t('transition.slide'), desc: t('transition.slide.desc') },
    { id: 'beat', name: t('transition.beat'), desc: t('transition.beat.desc') },
  ];

  const handleInstrumentToggle = (instrumentId: string) => {
    setSelectedInstruments(prev => 
      prev.includes(instrumentId)
        ? prev.filter(id => id !== instrumentId)
        : [...prev, instrumentId]
    );
  };

  const buildMusicPrompt = () => {
    let prompt = musicPrompt.trim();
    
    // 如果没有手动输入，根据选择的选项构建提示
    if (!prompt) {
      const parts = [];
      
      if (selectedGenre) {
        const genre = genres.find(g => g.id === selectedGenre);
        if (genre) parts.push(genre.name);
      }
      
      if (selectedMood) {
        const mood = moods.find(m => m.id === selectedMood);
        if (mood) parts.push(mood.name);
      }
      
      if (selectedInstruments.length > 0) {
        const instrumentNames = selectedInstruments
          .map(id => instruments.find(i => i.id === id)?.name)
          .filter(Boolean);
        if (instrumentNames.length > 0) {
          parts.push(`with ${instrumentNames.join(', ')}`);
        }
      }
      
      if (parts.length > 0) {
        prompt = `Generate a ${parts.join(' ')} song`;
      }
    }
    
    return prompt;
  };

  const handleGenerateMusicVideo = async () => {
    const prompt = buildMusicPrompt();
    
    if (!prompt.trim()) {
      setError('Please provide a music description or select some options');
      return;
    }
    
    setIsGenerating(true);
    setGenerationStep(0);
    setGenerationProgress('0%');
    setGenerationStatus('');
    setError(null);
    setGeneratedTracks([]);
    
    try {
      // 第一步：生成音乐
      setGenerationStep(1);
      setGenerationStatus('Submitting music generation request...');
      
      const taskId = await musicApiService.generateMusic({
        prompt: prompt,
        model: 'suno-v3.5'
      });
      
      // 第二步：轮询任务状态
      setGenerationStep(2);
      setGenerationStatus('Generating music...');
      
      const tracks = await musicApiService.pollTaskUntilComplete(
        taskId,
        (progress, status) => {
          setGenerationProgress(progress);
          setGenerationStatus(`Music generation in progress: ${progress}`);
        }
      );
      
      // 第三步：完成
      setGenerationStep(3);
      setGenerationStatus('Music generation completed!');
      setGenerationProgress('100%');
      setGeneratedTracks(tracks);
      
    } catch (error) {
      console.error('Music generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate music');
    } finally {
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  const generationSteps = [
    { name: t('step.analyze_music'), desc: t('step.analyze_music.desc') },
    { name: 'Submitting Request', desc: 'Sending your music request to AI' },
    { name: 'Generating Music', desc: 'AI is creating your music track' },
    { name: 'Finalizing', desc: 'Preparing your music for playback' },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-dark-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            <span className="bg-gradient-brand bg-clip-text text-transparent">{t('studio.title')}</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            {t('studio.subtitle')}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-dark-800/50 rounded-3xl p-8 backdrop-blur-sm border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <span>{t('studio.music_creation')}</span>
              </h3>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-dark-700 rounded-xl hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">{showAdvanced ? t('studio.simple_mode') : t('studio.advanced_options')}</span>
              </button>
            </div>
            
            <div className="space-y-8">
              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              {/* 创意描述区域 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
                    <Music className="w-4 h-4 text-primary-500" />
                    <span>{t('studio.music_description')}</span>
                  </label>
                  <textarea
                    value={musicPrompt}
                    onChange={(e) => setMusicPrompt(e.target.value)}
                    placeholder={t('studio.music_placeholder')}
                    className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
                    <Video className="w-4 h-4 text-secondary-500" />
                    <span>{t('studio.mv_description')}</span>
                  </label>
                  <textarea
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    placeholder={t('studio.mv_placeholder')}
                    className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:border-secondary-500/50 focus:ring-1 focus:ring-secondary-500/50"
                  />
                </div>
              </div>

              {/* 高级选项 */}
              {showAdvanced && (
                <div className="space-y-8 p-6 bg-gray-50 dark:bg-dark-700/50 rounded-2xl">
                  {/* 音乐选项 */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center space-x-2">
                      <Music className="w-5 h-5 text-primary-500" />
                      <span>{t('studio.music_settings')}</span>
                    </h4>
                    
                    {/* 音乐风格 */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('studio.music_style')}</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {genres.map((genre) => (
                          <button
                            key={genre.id}
                            onClick={() => setSelectedGenre(selectedGenre === genre.id ? '' : genre.id)}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                              selectedGenre === genre.id
                                ? 'border-primary-500 bg-primary-500/10'
                                : 'border-gray-200 dark:border-white/10 hover:border-primary-500/50'
                            }`}
                          >
                            <div className={`w-3 h-3 ${genre.color} rounded-full mb-2`}></div>
                            <div className="font-medium text-gray-900 dark:text-white">{genre.name}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">{genre.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 情感风格 */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('studio.mood_style')}</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {moods.map((mood) => (
                          <button
                            key={mood.id}
                            onClick={() => setSelectedMood(selectedMood === mood.id ? '' : mood.id)}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                              selectedMood === mood.id
                                ? 'border-secondary-500 bg-secondary-500/10'
                                : 'border-gray-200 dark:border-white/10 hover:border-secondary-500/50'
                            }`}
                          >
                            <div className="text-2xl mb-2">{mood.emoji}</div>
                            <div className="font-medium text-gray-900 dark:text-white">{mood.name}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">{mood.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 乐器选择 */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('studio.main_instruments')}</label>
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                        {instruments.map((instrument) => (
                          <button
                            key={instrument.id}
                            onClick={() => handleInstrumentToggle(instrument.id)}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                              selectedInstruments.includes(instrument.id)
                                ? 'border-green-500 bg-green-500/10'
                                : 'border-gray-200 dark:border-white/10 hover:border-green-500/50'
                            }`}
                          >
                            <div className="text-lg mb-1">{instrument.icon}</div>
                            <div className="text-xs text-gray-700 dark:text-gray-300">{instrument.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 节拍和时长 */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('studio.tempo')}: {tempo}
                        </label>
                        <input
                          type="range"
                          min="60"
                          max="200"
                          value={tempo}
                          onChange={(e) => setTempo(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 dark:bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('studio.duration')}: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                        </label>
                        <input
                          type="range"
                          min="30"
                          max="600"
                          value={duration}
                          onChange={(e) => setDuration(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 dark:bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 生成按钮 */}
              <button
                onClick={handleGenerateMusicVideo}
                disabled={isGenerating}
                className="w-full bg-gradient-brand text-white py-6 rounded-2xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-lg"
              >
                {isGenerating ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{t('studio.generating')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    <span>{t('studio.generate_button')}</span>
                  </>
                )}
              </button>

              {/* 生成进度 */}
              {isGenerating && (
                <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl p-6 border border-primary-500/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <Clock className="w-6 h-6 text-primary-500" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">{t('studio.creation_progress')}</span>
                  </div>
                  
                  <div className="space-y-4">
                    {generationSteps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index < generationStep ? 'bg-green-500' :
                          index === generationStep ? 'bg-primary-500 animate-pulse' :
                          'bg-gray-300 dark:bg-gray-600'
                        }`}>
                          {index < generationStep ? (
                            <span className="text-white text-sm">✓</span>
                          ) : (
                            <span className="text-white text-sm">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium ${
                            index <= generationStep ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {step.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">{step.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {generationProgress && (
                    <div className="mt-6">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <span>{generationStatus}</span>
                        <span>{generationProgress}</span>
                      </div>
                      <div className="bg-gray-200 dark:bg-dark-600 rounded-full h-3">
                        <div 
                          className="bg-gradient-brand h-3 rounded-full transition-all duration-500" 
                          style={{ width: generationProgress }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 生成结果 */}
              {generatedTracks.length > 0 && (
                <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl p-8 border border-primary-500/20">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                    <Sparkles className="w-6 h-6 text-primary-500" />
                    <span>{t('studio.creation_complete')}</span>
                  </h4>
                  
                  <div className="space-y-6">
                    {generatedTracks.map((track, index) => (
                      <MusicPlayer
                        key={track.id}
                        audioUrl={track.audio_url}
                        title={track.title || `Generated Track ${index + 1}`}
                        imageUrl={track.image_url}
                        autoPlay={index === 0}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MusicVideoStudio;