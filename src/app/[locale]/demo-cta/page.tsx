'use client'

import { motion } from 'framer-motion'
import { StickyCTABar, BookingCTABar, PurchaseCTABar } from '@/components/ui/sticky-cta-bar'

export default function DemoCTAPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 英雄区域 */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-b from-muted/50 to-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">粘性CTA栏演示</h1>
          <p className="text-xl text-muted-foreground mb-8">向下滚动查看粘性CTA栏效果</p>
          <div className="animate-bounce">↓</div>
        </div>
      </section>

      {/* 内容区域 */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg max-w-none"
          >
            <h2>关于粘性CTA栏</h2>
            <p>
              粘性CTA栏是一个强大的用户界面组件，它在用户滚动页面时自动出现，
              提供持续可见的行动召唤按钮。这个组件特别适合用于：
            </p>
            <ul>
              <li>产品购买页面</li>
              <li>服务预约页面</li>
              <li>课程注册页面</li>
              <li>联系我们页面</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card p-8 rounded-lg border"
          >
            <h3 className="text-2xl font-bold mb-4">功能特性</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">🎯 智能显示</h4>
                <p className="text-muted-foreground">
                  根据滚动距离自动显示/隐藏，避免干扰用户初始浏览体验
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🌍 国际化支持</h4>
                <p className="text-muted-foreground">
                  支持英语、繁体中文、日语三种语言的按钮文本
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📱 响应式设计</h4>
                <p className="text-muted-foreground">
                  在移动端自动调整为垂直布局，确保最佳用户体验
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🎨 品牌一致性</h4>
                <p className="text-muted-foreground">
                  使用项目的设计系统变量，保持品牌视觉一致性
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-muted/50 p-8 rounded-lg"
          >
            <h3 className="text-2xl font-bold mb-4">使用示例</h3>
            <div className="space-y-4">
              <div className="bg-background p-4 rounded border">
                <h4 className="font-semibold mb-2">预约CTA栏</h4>
                <p className="text-sm text-muted-foreground">
                  用于服务预约，显示价格和"立即预约"按钮
                </p>
              </div>
              <div className="bg-background p-4 rounded border">
                <h4 className="font-semibold mb-2">购买CTA栏</h4>
                <p className="text-sm text-muted-foreground">
                  用于产品销售，显示价格和"立即购买"按钮
                </p>
              </div>
              <div className="bg-background p-4 rounded border">
                <h4 className="font-semibold mb-2">通用CTA栏</h4>
                <p className="text-sm text-muted-foreground">
                  可自定义按钮文本和行为的通用版本
                </p>
              </div>
            </div>
          </motion.div>

          {/* 更多内容来触发滚动 */}
          {Array.from({ length: 5 }, (_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-card p-6 rounded-lg border"
            >
              <h3 className="text-xl font-semibold mb-3">内容区块 {i + 1}</h3>
              <p className="text-muted-foreground">
                这是用来增加页面高度的内容区块，帮助演示粘性CTA栏的滚动效果。
                当您向下滚动超过设定的距离后，粘性CTA栏将从底部滑入。
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 粘性CTA栏 - 滚动500px后显示 */}
      <BookingCTABar
        price="¥25,000"
        onBookingClick={() => {
          alert('预约功能演示 - 在实际项目中这里会打开预约表单或跳转到预约页面')
        }}
        showAfterScroll={500}
      />
    </div>
  )
}