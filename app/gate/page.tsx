'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Mail, Lock } from 'lucide-react'
import { auth, db } from '@/lib/firebase'
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInAnonymously, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { calculateAxisScores } from '@/lib/diagnosis'

export default function GatePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const saveResults = async (userId: string, userName: string, userEmail: string) => {
    try {
      const answersStr = localStorage.getItem('diagnosis_answers')
      if (!answersStr) {
        throw new Error('診断結果が見つかりません')
      }

      const answers: number[] = JSON.parse(answersStr)
      const scores = calculateAxisScores(answers)

      // Firestoreに保存
      await setDoc(doc(db, 'profiles', userId), {
        userId,
        name: userName,
        email: userEmail,
        answers,
        scores,
        createdAt: new Date(),
      })

      // ローカルストレージをクリア
      localStorage.removeItem('diagnosis_answers')

      // 結果ページへ
      router.push(`/result/${userId}`)
    } catch (error) {
      console.error('Error saving results:', error)
      alert('結果の保存に失敗しました。もう一度お試しください。')
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      await saveResults(
        user.uid,
        user.displayName || 'ゲストユーザー',
        user.email || ''
      )
    } catch (error: any) {
      console.error('Google sign in error:', error)
      if (error.code !== 'auth/popup-closed-by-user') {
        alert('Google認証に失敗しました。もう一度お試しください。')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      alert('名前とメールアドレスを入力してください')
      return
    }

    setLoading(true)
    try {
      // 匿名認証を使用（簡易版）
      const result = await signInAnonymously(auth)
      const user = result.user

      // プロフィールを更新
      await updateProfile(user, {
        displayName: name,
      })

      await saveResults(user.uid, name, email)
    } catch (error) {
      console.error('Sign up error:', error)
      alert('アカウント作成に失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full"
      >
        <Card className="bg-card/80 backdrop-blur border-border/50">
          <CardHeader className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl">診断完了！</CardTitle>
            <CardDescription className="text-base">
              結果を保存して、上司との相性診断も受けられるようにします
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Google Sign In */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              variant="outline"
              className="w-full h-12 gap-3 hover:bg-primary/5"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Googleで続行
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">または</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="お名前"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="メールアドレス"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 gap-2"
              >
                <Mail className="w-4 h-4" />
                {loading ? '保存中...' : '結果を保存する'}
              </Button>
            </form>

            <p className="text-xs text-center text-muted-foreground">
              診断結果は安全に保存され、上司招待リンクの生成に使用されます
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

