'use client'

import { useCurrentLocale } from '@/i18n/hooks'
import CinematicPlayer from '@/components/CinematicPlayer'

export default function CinematicDemoPage() {
  const locale = useCurrentLocale()

  // 多语言字幕数据
  const subtitles = {
    en: [
      { start: 1, end: 4, text: 'A story awaits.' },
      { start: 5, end: 8, text: 'A journey to mastery.' },
      { start: 9, end: 12, text: 'Where tradition meets innovation.' },
      { start: 13, end: 16, text: 'The Journey to Leave a Story.' }
    ],
    'zh-TW': [
      { start: 1, end: 4, text: '故事等待着您。' },
      { start: 5, end: 8, text: '通往精通的旅程。' },
      { start: 9, end: 12, text: '传统与创新的交汇。' },
      { start: 13, end: 16, text: '留下故事的旅程。' }
    ],
    ja: [
      { start: 1, end: 4, text: '物語があなたを待っています。' },
      { start: 5, end: 8, text: 'マスターへの旅路。' },
      { start: 9, end: 12, text: '伝統と革新が出会う場所。' },
      { start: 13, end: 16, text: '物語を残す旅。' }
    ]
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* 头部导航 */}
      <header className="p-6 text-white">
        <h1 className="text-3xl font-serif font-light">
          {locale === 'zh-TW' ? '电影级播放器演示' : 
           locale === 'ja' ? 'シネマティック・プレーヤーのデモ' : 
           'Cinematic Player Demo'}
        </h1>
        <p className="mt-2 text-white/80">
          {locale === 'zh-TW' ? '体验我们全新设计的16:9电影级播放器' :
           locale === 'ja' ? '新しくデザインされた16:9シネマティックプレーヤーを体験' :
           'Experience our newly designed 16:9 cinematic player'}
        </p>
      </header>

      {/* 主要内容区域 */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl">
          <CinematicPlayer
            src="/videos/faces/微笑.mp4"
            subtitles={subtitles[locale as keyof typeof subtitles] || subtitles.en}
            className="mx-auto"
          />
          
          {/* 功能说明 */}
          <div className="mt-8 text-center text-white/90 space-y-4">
            <h2 className="text-xl font-serif">
              {locale === 'zh-TW' ? '功能特性' :
               locale === 'ja' ? '機能' :
               'Features'}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto text-sm">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">
                  {locale === 'zh-TW' ? '🎮 键盘快捷键' :
                   locale === 'ja' ? '🎮 キーボードショートカット' :
                   '🎮 Keyboard Shortcuts'}
                </h3>
                <ul className="text-white/70 space-y-1">
                  <li>Space - {locale === 'zh-TW' ? '播放/暂停' : locale === 'ja' ? '再生/一時停止' : 'Play/Pause'}</li>
                  <li>F - {locale === 'zh-TW' ? '全屏切换' : locale === 'ja' ? 'フルスクリーン' : 'Fullscreen'}</li>
                  <li>M - {locale === 'zh-TW' ? '静音切换' : locale === 'ja' ? 'ミュート' : 'Mute'}</li>
                  <li>← → - {locale === 'zh-TW' ? '快进/快退10秒' : locale === 'ja' ? '10秒進む/戻る' : 'Skip ±10s'}</li>
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">
                  {locale === 'zh-TW' ? '✨ 高级功能' :
                   locale === 'ja' ? '✨ 高度な機能' :
                   '✨ Advanced Features'}
                </h3>
                <ul className="text-white/70 space-y-1">
                  <li>{locale === 'zh-TW' ? '16:9 电影纵横比' : locale === 'ja' ? '16:9映画アスペクト比' : '16:9 Cinematic Aspect Ratio'}</li>
                  <li>{locale === 'zh-TW' ? '多语言动画字幕' : locale === 'ja' ? '多言語アニメーション字幕' : 'Multi-language Animated Subtitles'}</li>
                  <li>{locale === 'zh-TW' ? '响应式触控界面' : locale === 'ja' ? 'レスポンシブタッチUI' : 'Responsive Touch Interface'}</li>
                  <li>{locale === 'zh-TW' ? '优雅的控制面板' : locale === 'ja' ? 'エレガントなコントロールパネル' : 'Elegant Control Panel'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 底部链接 */}
      <footer className="p-6 text-center text-white/60">
        <p>
          {locale === 'zh-TW' ? '返回' : locale === 'ja' ? '戻る' : 'Back to'} {' '}
          <a href={`/${locale}`} className="text-white hover:underline">
            {locale === 'zh-TW' ? '首页' : locale === 'ja' ? 'ホーム' : 'Home'}
          </a>
        </p>
      </footer>
    </div>
  )
}