// Suno AI音乐生成API服务
export interface MusicGenerationRequest {
  prompt: string;
  model?: string;
  stream?: boolean;
}

export interface MusicGenerationResponse {
  code: string;
  message: string;
  data: string; // task_id
}

// 根据实际API响应格式定义的音乐轨道接口
export interface MusicTrack {
  id: string;
  title: string;
  prompt: string;
  audio_url: string;
  image_url: string;
  image_large_url: string;
  video_url: string;
  duration: number;
  created_at: string;
  status: string;
  model_name: string;
  handle: string;
  display_name: string;
  state: string;
  clip_id: string;
  explicit: boolean;
  is_liked: boolean;
  is_public: boolean;
  tags: string;
  mv: string;
  metadata?: {
    type: string;
    prompt: string;
    stream: boolean;
    duration: number;
    is_remix: boolean;
    priority: number;
    can_remix: boolean;
    refund_credits: boolean;
    free_quota_category: string;
  };
}

export interface FetchTaskResponse {
  code: string;
  message: string;
  data: {
    task_id: string;
    action: string;
    status: string;
    fail_reason: string;
    submit_time: number;
    start_time: number;
    finish_time: number;
    progress: string;
    data: MusicTrack[];
  };
}

class MusicApiService {
  private readonly apiKey = 'sk-yTXzuv2mvPRNDlQ7yztAApU6JcOGxGJjWeXsxa0pddjA3xe3';
  
  // 开发环境使用代理，生产环境直接调用
  private readonly isDevelopment = import.meta.env.DEV;
  
  private readonly backupUrls = this.isDevelopment ? [
    '/api/apicore' // 开发环境代理路径
  ] : [
    'https://api.apicore.ai' // 生产环境直接URL
  ];

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  // 正确的API路径
  private readonly API_PATHS = {
    generate: '/suno/submit/music',
    fetch: '/suno/fetch'
  };

  private handleHttpError(status: number, context: string, responseText?: string): Error {
    console.error(`HTTP错误 ${status} in ${context}:`, responseText);
    
    if (status === 503) {
      return new Error('🔧 音乐生成服务暂时维护中\n\n解决方案：\n• 请等待10-30分钟后重试\n• 检查网络连接\n• 如果问题持续，请联系客服');
    } else if (status === 502 || status === 504) {
      return new Error('🌐 服务器网关错误\n\n解决方案：\n• 网络不稳定，请稍后重试\n• 检查防火墙设置');
    } else if (status === 429) {
      return new Error('⚡ 请求过于频繁\n\n解决方案：\n• 请等待30秒后再试\n• 降低请求频率');
    } else if (status === 401) {
      return new Error('🔑 API认证失败\n\n可能原因：\n• API密钥已过期\n• 账户余额不足\n• 请联系管理员检查配置');
    } else if (status === 403) {
      return new Error('🚫 API访问被拒绝\n\n可能原因：\n• 余额不足\n• 权限不够\n• 请检查账户状态');
    } else if (status === 400) {
      return new Error('📝 请求格式错误\n\n解决方案：\n• 检查输入内容\n• 确保音乐描述合理');
    } else if (status >= 500) {
      return new Error('🖥️ 服务器内部错误\n\n解决方案：\n• 服务器临时故障\n• 请稍后重试');
    } else {
      return new Error(`❌ ${context}失败 (${status})\n\n请检查网络连接并重试`);
    }
  }

  // 带重试的网络请求
  private async fetchWithRetry(url: string, options: RequestInit, maxRetries = 2): Promise<Response> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 尝试第${attempt}次请求: ${url}`);
        
        // 创建超时控制器 - 减少超时时间以便更快失败重试
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15秒超时
        
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          // 添加模式设置
          mode: 'cors',
          credentials: 'omit',
        });
        
        clearTimeout(timeoutId);
        
        console.log(`📡 响应状态: ${response.status} ${response.statusText}`);
        
        // 如果请求成功或是客户端错误（4xx），直接返回
        if (response.ok || (response.status >= 400 && response.status < 500)) {
          return response;
        }
        
        // 服务器错误（5xx），记录并重试
        console.warn(`⚠️ 请求失败，状态码: ${response.status}，准备重试...`);
        lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
        
      } catch (error) {
        console.warn(`❌ 网络请求失败 (尝试 ${attempt}/${maxRetries}):`, error);
        
        if (error instanceof Error && error.name === 'AbortError') {
          lastError = new Error('⏰ 请求超时\n\n解决方案：\n• 检查网络连接\n• 稍后重试');
        } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          lastError = new Error('🌐 网络连接失败\n\n可能原因：\n• 网络不稳定\n• CORS策略阻止\n• 防火墙设置\n\n解决方案：\n• 检查网络连接\n• 尝试刷新页面');
        } else {
          lastError = error instanceof Error ? error : new Error('未知网络错误');
        }
      }
      
      // 如果不是最后一次尝试，等待后重试
      if (attempt < maxRetries) {
        const delay = 2000; // 固定2秒延迟
        console.log(`⏳ 等待${delay}ms后重试...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError || new Error('网络请求失败');
  }

  // 尝试多个API端点
  private async tryMultipleEndpoints(path: string, options: RequestInit): Promise<Response> {
    let lastError: Error | null = null;
    
    console.log('🔧 尝试多个端点，路径:', path);
    console.log('🔧 可用端点:', this.backupUrls);
    console.log('🔧 开发环境:', this.isDevelopment);
    
    for (const baseUrl of this.backupUrls) {
      try {
        const url = `${baseUrl}${path}`;
        console.log(`🎯 完整请求URL: ${url}`);
        
        const response = await this.fetchWithRetry(url, options, 2);
        
        if (response.ok) {
          console.log(`✅ API端点${baseUrl}响应成功`);
          return response;
        }
        
        // 记录错误但继续尝试下一个端点
        const errorText = await response.text();
        console.warn(`❌ API端点${baseUrl}失败: ${response.status} - ${errorText}`);
        lastError = this.handleHttpError(response.status, `API调用 (${baseUrl})`, errorText);
        
      } catch (error) {
        console.warn(`❌ API端点${baseUrl}网络错误:`, error);
        lastError = error instanceof Error ? error : new Error('网络连接失败');
      }
    }
    
    throw lastError || new Error('💥 所有API端点都不可用\n\n可能原因：\n• 网络连接问题\n• 服务器维护中\n• CORS策略限制\n\n解决方案：\n• 检查网络连接\n• 稍后重试\n• 联系技术支持');
  }

  // 生成音乐
  async generateMusic(request: MusicGenerationRequest): Promise<string> {
    try {
      console.log('🎵 开始音乐生成请求:', request);
      console.log('🔑 使用API密钥:', this.apiKey.substring(0, 10) + '...');
      
      // 使用与Postman完全相同的请求格式
      const requestBody = {
        model: 'suno-v3.5', // 固定使用suno-v3.5
        messages: [
          {
            role: 'user',
            content: request.prompt
          }
        ],
        stream: true // 固定使用stream: true，与Postman一致
      };
      
      console.log('📨 请求体:', requestBody);
      console.log('🌐 请求头:', this.getHeaders());

      const response = await this.tryMultipleEndpoints(this.API_PATHS.generate, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(requestBody)
      });

      console.log('📡 原始响应状态:', response.status, response.statusText);
      console.log('📡 响应头:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('📄 原始响应文本:', responseText);

      let result: MusicGenerationResponse;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ JSON解析失败:', parseError);
        console.log('📄 无法解析的响应:', responseText);
        throw new Error(`🔧 服务器返回格式错误\n\n响应内容: ${responseText.substring(0, 200)}...\n\n解决方案：\n• 稍后重试\n• 联系技术支持`);
      }

      console.log('🎵 音乐生成响应:', result);
      
      if (result.code !== 'success') {
        console.error('❌ API返回失败状态:', result);
        throw new Error(result.message || `❌ API调用失败\n\n返回状态：${result.code}\n\n解决方案：\n• 检查网络连接\n• 稍后重试`);
      }

      if (!result.data) {
        console.error('❌ 响应中没有任务ID:', result);
        throw new Error('🆔 未获得有效的任务ID\n\n解决方案：\n• 重新尝试生成\n• 检查输入内容');
      }

      console.log('✅ 任务创建成功，ID:', result.data);
      return result.data;
      
    } catch (error) {
      console.error('❌ 音乐生成错误详情:', {
        error: error,
        message: error instanceof Error ? error.message : '未知错误',
        stack: error instanceof Error ? error.stack : '无堆栈信息',
        apiKey: this.apiKey.substring(0, 10) + '...',
        baseUrls: this.backupUrls
      });
      throw error;
    }
  }

  // 获取任务状态和结果
  async fetchTask(taskId: string): Promise<FetchTaskResponse['data']> {
    try {
      console.log('🔍 查询任务状态:', taskId);
      
      const response = await this.tryMultipleEndpoints(`${this.API_PATHS.fetch}/${taskId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result: FetchTaskResponse = await response.json();
      console.log('🔍 任务查询响应:', result);
      
      if (result.code !== 'success') {
        throw new Error(result.message || '获取任务状态失败');
      }

      return result.data;
      
    } catch (error) {
      console.error('❌ 任务状态查询错误:', error);
      throw error;
    }
  }

  // 轮询任务状态直到完成
  async pollTaskUntilComplete(
    taskId: string, 
    onProgress?: (progress: string, status: string, tracks?: MusicTrack[]) => void
  ): Promise<MusicTrack[]> {
    const maxAttempts = 180; // 减少到180次，最多轮询15分钟
    const pollInterval = 2000; // 改为每2秒轮询一次，更快响应
    let consecutiveErrors = 0;
    const maxConsecutiveErrors = 3; // 减少错误容忍次数
    let lastProgress = '0%';

    console.log('🔄 开始轮询任务状态:', taskId);

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const taskData = await this.fetchTask(taskId);
        
        // 重置错误计数
        consecutiveErrors = 0;
        
        // 如果没有进度信息，根据时间模拟进度
        let currentProgress = taskData.progress || lastProgress;
        if (!taskData.progress && attempt > 0) {
          // 模拟进度：前30秒快速增长，然后放缓
          const elapsedSeconds = attempt * (pollInterval / 1000);
          if (elapsedSeconds < 30) {
            currentProgress = `${Math.min(85, Math.floor(elapsedSeconds * 2.5))}%`;
          } else if (elapsedSeconds < 60) {
            currentProgress = `${Math.min(95, 85 + Math.floor((elapsedSeconds - 30) * 0.3))}%`;
          } else {
            currentProgress = '98%';
          }
        }
        lastProgress = currentProgress;
        
        console.log(`🔄 轮询第${attempt + 1}次，状态: ${taskData.status}, 进度: ${currentProgress}`);
        
        if (onProgress) {
          onProgress(currentProgress, taskData.status, taskData.data);
        }

        // 检查任务是否成功完成
        if (taskData.status === 'SUCCESS' && taskData.data && taskData.data.length > 0) {
          console.log('✅ 任务完成，返回音乐数据:', taskData.data);
          
          // 设置100%进度
          if (onProgress) {
            onProgress('100%', 'SUCCESS', taskData.data);
          }
          
          // 过滤出有效的音乐轨道
          const validTracks = taskData.data.filter(track => {
            const hasValidAudio = track.audio_url && track.audio_url.trim() !== '';
            const isCompleted = track.state === 'succeeded' || track.status === 'complete';
            return hasValidAudio && isCompleted;
          });
          
          if (validTracks.length > 0) {
            return validTracks;
          } else {
            console.warn('⚠️ 任务标记为成功但没有有效的音频文件，继续轮询...');
          }
          
        } else if (taskData.status === 'FAILED') {
          throw new Error(taskData.fail_reason || '音乐生成失败');
        }

        // 如果还在处理中，等待后继续轮询
        if (taskData.status === 'PROCESSING' || 
            taskData.status === 'PENDING' || 
            taskData.status === 'RUNNING' || 
            taskData.status === 'QUEUED' ||
            !taskData.status) {
          await new Promise(resolve => setTimeout(resolve, pollInterval));
          continue;
        }

      } catch (error) {
        consecutiveErrors++;
        console.error(`❌ 轮询第${attempt + 1}次失败:`, error);
        
        // 如果连续错误太多，抛出异常
        if (consecutiveErrors >= maxConsecutiveErrors) {
          throw new Error(`连续${maxConsecutiveErrors}次查询失败，可能服务不稳定`);
        }
        
        // 如果不是最后一次尝试，等待后重试
        if (attempt < maxAttempts - 1) {
          const delay = Math.min(pollInterval * 2, 5000); // 错误时稍微延长间隔
          console.log(`等待${delay}ms后重试...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        } else {
          throw error;
        }
      }
    }

    throw new Error('音乐生成超时（15分钟），请联系客服或稍后重试');
  }

  // 验证音频URL是否可访问
  async validateAudioUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors' // 避免CORS问题
      });
      return true; // no-cors模式下，只要不抛异常就说明URL可访问
    } catch (error) {
      console.error('音频URL验证失败:', error);
      return false;
    }
  }

  // 健康检查
  async healthCheck(): Promise<boolean> {
    try {
      for (const baseUrl of this.backupUrls) {
        try {
          const response = await fetch(baseUrl, { 
            method: 'HEAD',
            headers: { 'Authorization': `Bearer ${this.apiKey}` }
          });
          if (response.status < 500) {
            console.log(`✅ API端点${baseUrl}健康检查通过`);
            return true;
          }
        } catch (error) {
          console.warn(`❌ API端点${baseUrl}健康检查失败`);
        }
      }
      return false;
    } catch (error) {
      console.error('健康检查失败:', error);
      return false;
    }
  }
}

export const musicApiService = new MusicApiService();