import { View, Text, Canvas, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import type { GenerationResult } from '@/types';

interface Props {
  data: GenerationResult;
  inputText: string;
}

const COLORS = ['#f59e0b', '#34d399', '#a78bfa'];

export default function SharePanel({ data, inputText }: Props) {
  const handleShare = () => {
    drawShareCard(data, inputText, (filePath) => {
      if (filePath) {
        Taro.saveImageToPhotosAlbum({ filePath })
          .then(() => Taro.showToast({ title: '已保存到相册', icon: 'success' }))
          .catch(() => {
            Taro.showModal({
              title: '提示',
              content: '保存失败，请授权相册权限',
              showCancel: false,
            });
          });
      }
    });
  };

  return (
    <View className="share-panel">
      <Button className="btn-share" onClick={handleShare}>
        📸 生成分享卡片
      </Button>

      {/* Hidden canvas for rendering share card */}
      <Canvas
        canvasId="share-canvas"
        id="share-canvas"
        style={{ width: '750rpx', height: '1000rpx', position: 'fixed', left: '-9999px' }}
      />
    </View>
  );
}

function drawShareCard(
  data: GenerationResult,
  inputText: string,
  callback: (path: string | null) => void
) {
  const ctx = Taro.createCanvasContext('share-canvas');
  const W = 375;
  const H = 500;

  // Background
  ctx.setFillStyle('#0f0c29');
  ctx.fillRect(0, 0, W, H);

  // Title
  ctx.setFontSize(18);
  ctx.setFillStyle('#ffffff');
  ctx.setTextAlign('center');
  ctx.fillText('平行人生模拟器', W / 2, 40);

  ctx.setFontSize(11);
  ctx.setFillStyle('rgba(255,255,255,0.5)');
  ctx.fillText(`如果「${inputText.slice(0, 30)}${inputText.length > 30 ? '...' : ''}」`, W / 2, 62);

  // Three columns
  const colW = (W - 60) / 3;
  data.storylines.forEach((s, i) => {
    const x = 20 + i * (colW + 10);
    const y = 80;

    // Accent bar
    ctx.setFillStyle(COLORS[i]);
    ctx.fillRect(x, y, colW, 2);

    // Title
    ctx.setFontSize(12);
    ctx.setFillStyle(COLORS[i]);
    ctx.setTextAlign('left');
    ctx.fillText(s.title, x, y + 20);

    // Events (condensed)
    ctx.setFontSize(10);
    ctx.setFillStyle('rgba(255,255,255,0.6)');
    s.events.slice(0, 3).forEach((e, j) => {
      ctx.fillText(`${e.year} ${e.description.slice(0, 15)}`, x, y + 40 + j * 18);
    });

    // Summary
    ctx.setFontSize(11);
    ctx.setFillStyle('rgba(255,255,255,0.4)');
    ctx.fillText(`「${s.summary}」`, x, y + 105);
  });

  // Footer
  ctx.setFontSize(8);
  ctx.setFillStyle('rgba(255,255,255,0.15)');
  ctx.setTextAlign('center');
  ctx.fillText('平行人生模拟器 · 微信小程序', W / 2, H - 15);

  ctx.draw(false, () => {
    setTimeout(() => {
      Taro.canvasToTempFilePath({
        canvasId: 'share-canvas',
        success: (res) => callback(res.tempFilePath),
        fail: () => callback(null),
      });
    }, 500);
  });
}
