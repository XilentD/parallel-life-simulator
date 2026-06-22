'use client';

import { useState } from 'react';

export default function ShareButton() {
  const [saving, setSaving] = useState(false);

  const handleShare = async () => {
    setSaving(true);
    try {
      // Dynamic import to reduce initial bundle
      const html2canvas = (await import('html2canvas')).default;
      const element = document.getElementById('share-card');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0f0c29',
      });

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `平行人生_${new Date().toISOString().slice(0, 10)}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error('Share failed:', e);
      alert('截图生成失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={saving}
      className="px-6 py-2.5 rounded-xl font-medium text-sm
                 bg-gradient-to-r from-indigo-500/80 to-purple-500/80
                 hover:from-indigo-400 hover:to-purple-400
                 disabled:from-white/10 disabled:to-white/10
                 disabled:text-white/30 disabled:cursor-not-allowed
                 text-white shadow-[0_4px_20px_rgba(99,102,241,0.25)]
                 hover:shadow-[0_4px_30px_rgba(99,102,241,0.4)]
                 transition-all duration-300"
    >
      {saving ? '生成中...' : '📸 生成分享卡片'}
    </button>
  );
}
