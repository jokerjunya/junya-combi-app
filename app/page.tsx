'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Sparkles, Users, TrendingUp } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background/80">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full space-y-8 text-center"
      >
        {/* Hero Section */}
        <div className="space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              配属ミスマッチを減らす
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Junyaの
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              配属相性診断
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            12問のシンプルな診断で、
            <br />
            あなたの仕事スタイルと上司との相性がわかる
          </p>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-12"
        >
          <Card className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all">
            <Sparkles className="w-8 h-8 text-primary mb-3 mx-auto" />
            <h3 className="font-semibold mb-2">たった12問</h3>
            <p className="text-sm text-muted-foreground">
              3分で完了する
              <br />
              シンプルな診断
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all">
            <Users className="w-8 h-8 text-primary mb-3 mx-auto" />
            <h3 className="font-semibold mb-2">上司相性診断</h3>
            <p className="text-sm text-muted-foreground">
              心理安全性を重視した
              <br />
              相性スコア
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all">
            <TrendingUp className="w-8 h-8 text-primary mb-3 mx-auto" />
            <h3 className="font-semibold mb-2">配属適合</h3>
            <p className="text-sm text-muted-foreground">
              ミスマッチを減らし
              <br />
              定着率を向上
            </p>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="pt-8"
        >
          <Button
            size="lg"
            onClick={() => router.push('/test')}
            className="text-lg px-12 py-6 h-auto shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
          >
            診断をはじめる
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            所要時間：約3分 | 完全無料
          </p>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 text-center text-sm text-muted-foreground"
      >
        <p>© 2024 Junya Combi App. All rights reserved.</p>
      </motion.footer>
    </div>
  )
}
