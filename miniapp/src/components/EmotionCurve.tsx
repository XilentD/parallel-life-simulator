import { View, Canvas } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useRef, useEffect } from 'react';
import type { EmotionPoint } from '@/types';

interface Props {
  data: EmotionPoint[];
}

export default function EmotionCurve({ data }: Props) {
  const canvasId = useRef(`ec-${Math.random().toString(36).slice(2, 8)}`).current;

  useEffect(() => {
    if (!data || data.length < 2) return;
    drawCurve(canvasId, data);
  }, [canvasId, data]);

  if (!data || data.length < 2) return null;

  return (
    <View className="emotion-curve">
      <Canvas
        canvasId={canvasId}
        id={canvasId}
        className="ec-canvas"
        style={{ width: '520rpx', height: '160rpx' }}
      />
    </View>
  );
}

function drawCurve(canvasId: string, data: EmotionPoint[]) {
  const query = Taro.createSelectorQuery();
  query.select(`#${canvasId}`).fields({ node: true, size: true }).exec((res) => {
    if (!res[0]) return;
    const ctx = Taro.createCanvasContext(canvasId);
    const W = 260;
    const H = 80;
    const PAD = 10;

    const xs = data.map((_, i) => PAD + (i / (data.length - 1)) * (W - 2 * PAD));
    const ys = data.map((p) => H - PAD - ((p.value / 100) * (H - 2 * PAD)));

    // Grid
    [25, 50, 75].forEach((v) => {
      const y = H - PAD - ((v / 100) * (H - 2 * PAD));
      ctx.beginPath();
      ctx.setStrokeStyle('rgba(255,255,255,0.06)');
      ctx.setLineWidth(1);
      ctx.moveTo(PAD, y);
      ctx.lineTo(W - PAD, y);
      ctx.stroke();
    });

    // Area fill
    ctx.beginPath();
    ctx.moveTo(xs[0], H - PAD);
    for (let i = 0; i < xs.length; i++) ctx.lineTo(xs[i], ys[i]);
    ctx.lineTo(xs[xs.length - 1], H - PAD);
    ctx.closePath();
    ctx.setFillStyle('rgba(129,140,248,0.1)');
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.setStrokeStyle('#a5b4fc');
    ctx.setLineWidth(2);
    ctx.setLineCap('round');
    for (let i = 0; i < xs.length; i++) {
      if (i === 0) ctx.moveTo(xs[i], ys[i]); else ctx.lineTo(xs[i], ys[i]);
    }
    ctx.stroke();

    // Dots + labels
    data.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(xs[i], ys[i], 2, 0, Math.PI * 2);
      ctx.setFillStyle('#c7d2fe');
      ctx.fill();

      ctx.setFontSize(7);
      ctx.setFillStyle('rgba(255,255,255,0.35)');
      ctx.setTextAlign('center');
      ctx.fillText(p.year, xs[i], H - 2);
    });

    ctx.draw();
  });
}
