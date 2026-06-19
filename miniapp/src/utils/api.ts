import Taro from '@tarojs/taro';
import type { ApiResponse, Gender } from '@/types';

const API_URL = 'http://localhost:3000/api/generate';

export async function generateStorylines(
  input: string,
  gender: Gender
): Promise<ApiResponse> {
  const res = await Taro.request({
    url: API_URL,
    method: 'POST',
    header: { 'Content-Type': 'application/json' },
    data: { input, gender },
    timeout: 120000,
  });

  if (res.statusCode === 200) {
    return res.data as ApiResponse;
  }

  const body = res.data as ApiResponse;
  throw new Error(body.error || '请求失败');
}
