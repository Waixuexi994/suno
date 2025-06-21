import React, { useState } from 'react';
import { Play, AlertCircle, Clock, Sparkles, Music, Wand2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { musicApiService, MusicTrack } from '../services/musicApi';
import WaveformCanvas from './WaveformCanvas';
import MusicPlayer from './MusicPlayer';

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('0%');
  const [generationStatus, setGenerationStatus] = useState('');
  const [generatedTracks, setGeneratedTracks] = useState<MusicTrack[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const generationSteps = [
    { icon: Wand2, text: '正在分析您的音乐描述...' },
    { icon: Music, text: 'AI正在创作旋律和节奏...' },
    { icon: Sparkles, text: '添加乐器编排和效果...' },
    { icon: Clock, text: '最终渲染和优化中...' }
  ];

  const handleGenerateMusic = async () => {
    if (!prompt.trim()) {
      setError('请输入您想要生成的音乐描述');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress('0%');
    setGenerationStatus('');
    setError(null);
    setGeneratedTracks([]);
    setCurrentStep(0);

    try {
      // 预检查：先进行健康检查
      setCurrentStep(0);
      setGenerationStatus('正在检查服务状态...');
      setGenerationProgress('3%');
      
      const isHealthy = await musicApiService.healthCheck();
      if (!isHealthy) {
        throw new Error('音乐生成服务当前不可用，请稍后重试或联系客服');
      }

      // 第一步：提交生成请求
      setCurrentStep(0);
      setGenerationStatus('正在提交音乐生成请求...');
      setGenerationProgress('5%');
      
      const taskId = await musicApiService.generateMusic({
        prompt: prompt,
        model: 'suno-v3.5',
        stream: true
      });

      console.log('获得任务ID:', taskId);

      // 第二步：轮询任务状态
      setCurrentStep(1);
      setGenerationStatus('AI正在创作您的音乐...');
      setGenerationProgress('15%');

      const tracks = await musicApiService.pollTaskUntilComplete(
        taskId,
        (progress, status, currentTracks) => {
          // 解析进度百分比
          const progressNum = parseInt(progress?.replace('%', '') || '0');
          setGenerationProgress(progress || '0%');
          
          // 根据进度更新步骤
          if (progressNum < 25) {
            setCurrentStep(0);
            setGenerationStatus('正在分析音乐风格和情感...');
          } else if (progressNum < 50) {
            setCurrentStep(1);
            setGenerationStatus('AI正在创作主旋律...');
          } else if (progressNum < 75) {
            setCurrentStep(2);
            setGenerationStatus('添加和声与乐器编排...');
          } else if (progressNum < 100) {
            setCurrentStep(3);
            setGenerationStatus('正在进行最终混音和优化...');
          }

          // 如果有部分完成的音轨，显示预览
          if (currentTracks && currentTracks.length > 0) {
            const completedTracks = currentTracks.filter(track => 
              track.audio_url && track.state === 'succeeded'
            );
            if (completedTracks.length > 0) {
              setGeneratedTracks(completedTracks);
            }
          }

          console.log(`进度更新: ${progress}, 状态: ${status}`);
        }
      );

      // 第三步：完成
      setCurrentStep(3);
      setGenerationStatus('音乐生成完成！');
      setGenerationProgress('100%');
      setGeneratedTracks(tracks);

      console.log('音乐生成完成，获得音轨:', tracks);

    } catch (error) {
      console.error('音乐生成错误:', error);
      
      // 分析错误类型并给出相应的用户友好提示
      let errorMessage = '音乐生成失败，请重试';
      
      if (error instanceof Error) {
        const message = error.message;
        if (message.includes('503') || message.includes('暂时不可用') || message.includes('维护')) {
          errorMessage = '🔧 音乐生成服务正在维护中\n\n可能的解决方案：\n• 请等待10-30分钟后重试\n• 检查网络连接是否正常\n• 如果问题持续存在，请联系客服';
        } else if (message.includes('401') || message.includes('API密钥') || message.includes('认证')) {
          errorMessage = '🔑 API认证失败\n\n可能的解决方案：\n• API密钥可能已过期\n• 请检查账户余额是否充足\n• 联系管理员检查API配置';
        } else if (message.includes('429') || message.includes('频繁')) {
          errorMessage = '⚡ 请求过于频繁\n\n请等待30秒后再试，或：\n• 降低请求频率\n• 稍后再试';
        } else if (message.includes('超时') || message.includes('timeout')) {
          errorMessage = '⏰ 生成超时\n\n可能的解决方案：\n• 网络连接可能不稳定\n• 服务器响应较慢，请重试\n• 尝试简化音乐描述';
        } else if (message.includes('网络') || message.includes('连接')) {
          errorMessage = '🌐 网络连接问题\n\n请检查：\n• 网络连接是否正常\n• 防火墙设置\n• 代理配置';
        } else {
          errorMessage = `❌ ${message}\n\n如果问题持续存在，请联系技术支持`;
        }
      }
      
      setError(errorMessage);
      setGenerationStatus('生成失败');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDemoPlay = () => {
    // 设置一个示例提示
    setPrompt('一首充满活力的流行歌曲，包含电吉他和鼓点，表达青春与希望');
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-16 bg-white dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column */}
          <div className="space-y-8 animate-fade-up">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
                {t('hero.title').split('AI').map((part, index) => (
                  <React.Fragment key={index}>
                    {part}
                    {index === 0 && <span className="bg-gradient-brand bg-clip-text text-transparent">AI</span>}
                  </React.Fragment>
                ))}
              </h1>
              <h4 className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 font-light max-w-lg">
                {t('hero.subtitle')}
              </h4>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl animate-fade-up">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <pre className="text-sm text-red-700 dark:text-red-300 whitespace-pre-line font-sans">{error}</pre>
                    {/* 重试按钮 */}
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={() => setError(null)}
                        className="px-3 py-1 text-xs bg-red-100 dark:bg-red-800/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors"
                      >
                        关闭
                      </button>
                      <button
                        onClick={() => {
                          setError(null);
                          if (prompt.trim()) handleGenerateMusic();
                        }}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        重试
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Input Group */}
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t('hero.placeholder')}
                  className="w-full h-24 px-6 py-4 bg-gray-50 dark:bg-dark-800/50 border border-gray-200 dark:border-white/10 rounded-3xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 backdrop-blur-sm transition-all duration-300"
                  disabled={isGenerating}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleGenerateMusic}
                  disabled={isGenerating || !prompt.trim()}
                  className="bg-gradient-brand text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>正在生成音乐...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>{t('hero.generate')}</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={handleDemoPlay}
                  className="flex items-center justify-center space-x-2 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white px-8 py-4 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300"
                >
                  <Play className="w-5 h-5" />
                  <span>{t('hero.demo')}</span>
                </button>
                <button 
                  onClick={async () => {
                    setError(null);
                    try {
                      setGenerationStatus('正在检查API状态...');
                      const isHealthy = await musicApiService.healthCheck();
                      if (isHealthy) {
                        alert('✅ API服务状态正常！可以尝试生成音乐。');
                      } else {
                        setError('❌ API服务当前不可用\n\n请检查:\n• 网络连接\n• 服务器状态\n• 稍后重试');
                      }
                    } catch (error) {
                      setError('🔍 诊断失败\n\n' + (error instanceof Error ? error.message : '无法连接到服务器'));
                    } finally {
                      setGenerationStatus('');
                    }
                  }}
                  className="flex items-center justify-center space-x-2 border border-blue-300 dark:border-blue-500/50 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-full font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                  title="检查API服务状态"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>诊断</span>
                </button>
              </div>
            </div>

            {/* Enhanced Generation Progress */}
            {isGenerating && generatedTracks.length === 0 && (
              <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl p-6 border border-primary-500/20 animate-fade-up backdrop-blur-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="relative">
                    <Clock className="w-5 h-5 text-primary-500 animate-spin" />
                    <div className="absolute inset-0 w-5 h-5 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin animation-delay-150"></div>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">正在创作您的音乐</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce animation-delay-75"></div>
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce animation-delay-150"></div>
                  </div>
                </div>
                
                {/* Generation Steps */}
                <div className="space-y-4 mb-6">
                  {generationSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;
                    
                    return (
                      <div 
                        key={index}
                        className={`flex items-center space-x-3 transition-all duration-700 ${
                          isActive ? 'text-primary-500 scale-105' : isCompleted ? 'text-green-500' : 'text-gray-400'
                        }`}
                      >
                        <div className={`relative p-2 rounded-full transition-all duration-700 ${
                          isActive ? 'bg-primary-500/20 animate-pulse shadow-lg shadow-primary-500/25' : 
                          isCompleted ? 'bg-green-500/20 shadow-lg shadow-green-500/25' : 'bg-gray-200 dark:bg-gray-700'
                        }`}>
                          <StepIcon className={`w-4 h-4 transition-all duration-500 ${
                            isActive ? 'animate-pulse scale-110' : isCompleted ? 'scale-110' : ''
                          }`} />
                          {isActive && (
                            <div className="absolute inset-0 p-2 rounded-full border-2 border-primary-500/50 animate-ping"></div>
                          )}
                          {isCompleted && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <span className={`text-sm transition-all duration-500 ${
                            isActive ? 'font-medium text-base' : ''
                          }`}>
                            {isActive ? generationStatus : step.text}
                          </span>
                          {isActive && (
                            <div className="text-xs text-primary-400 mt-1 animate-pulse">
                              AI正在处理中...
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center space-x-2">
                      <span>{generationStatus}</span>
                      {parseInt(generationProgress.replace('%', '')) > 50 && (
                        <span className="text-xs px-2 py-1 bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-full animate-pulse">
                          即将完成
                        </span>
                      )}
                    </span>
                    <span className="font-mono font-bold text-primary-600 dark:text-primary-400">{generationProgress}</span>
                  </div>
                  <div className="relative bg-gray-200 dark:bg-dark-600 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-brand h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                      style={{ width: generationProgress }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer"></div>
                    </div>
                    {/* 进度条上的小亮点 */}
                    <div 
                      className="absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg transition-all duration-1000 ease-out"
                      style={{ left: `calc(${generationProgress} - 4px)` }}
                    >
                      <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>
                    </div>
                  </div>
                  {/* ETA显示 */}
                  {parseInt(generationProgress.replace('%', '')) > 10 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center animate-fade-up">
                      预计还需 {Math.max(5, Math.floor((100 - parseInt(generationProgress.replace('%', ''))) / 3))} 秒
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Success Message when music is generated */}
            {!isGenerating && generatedTracks.length > 0 && (
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20 animate-fade-up backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="relative p-2 bg-green-500/20 rounded-full">
                    <Sparkles className="w-5 h-5 text-green-500" />
                    <div className="absolute inset-0 bg-green-500/30 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">音乐创作完成！</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">您的专属音乐已经生成，快来欣赏吧</p>
                  </div>
                  <div className="text-green-500">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Generated Music Results */}
            {generatedTracks.length > 0 && (
              <div className="space-y-4 animate-fade-up">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-primary-500" />
                  <span>您生成的音乐作品</span>
                </h3>
                <div className="space-y-4">
                  {generatedTracks.map((track, index) => (
                    <div key={track.id} className="animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <MusicPlayer
                        audioUrl={track.audio_url}
                        title={track.title || track.display_name || `Generated Track ${index + 1}`}
                        imageUrl={track.image_url || track.image_large_url}
                        autoPlay={index === 0}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Waveform Canvas */}
          <div className="relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="aspect-square lg:aspect-auto lg:h-96 bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-gradient-card rounded-3xl p-8 backdrop-blur-sm border border-gray-200 dark:border-white/10">
              <WaveformCanvas />
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-brand rounded-full opacity-20 blur-xl animate-pulse-slow"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary-500/20 rounded-full opacity-20 blur-xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;