'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import { ArrowLeft, Heart, AlertCircle, Lightbulb, TrendingUp } from 'lucide-react'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import { signInAnonymously } from 'firebase/auth'
import { QUESTIONS, calculateAxisScores, calculateCompatibility, UserProfile, AXIS_LABELS, AxisKey } from '@/lib/diagnosis'

type PageState = 'loading' | 'test' | 'result'

export default function PairPage() {
  const params = useParams()
  const token = params.token as string
  const [state, setState] = useState<PageState>('loading')
  const [subordinateProfile, setSubordinateProfile] = useState<UserProfile | null>(null)
  const [bossProfile, setBossProfile] = useState<UserProfile | null>(null)
  
  // Test state
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [direction, setDirection] = useState(1)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    const loadInvite = async () => {
      try {
        const inviteRef = doc(db, 'invites', token)
        const inviteSnap = await getDoc(inviteRef)

        if (!inviteSnap.exists()) {
          alert('招待リンクが無効です')
          return
        }

        const inviteData = inviteSnap.data()
        const subordinateId = inviteData.subordinateId

        // 部下のプロフィールを取得
        const subProfileRef = doc(db, 'profiles', subordinateId)
        const subProfileSnap = await getDoc(subProfileRef)

        if (subProfileSnap.exists()) {
          setSubordinateProfile(subProfileSnap.data() as UserProfile)
        }

        // すでに診断済みか確認
        if (inviteData.used && inviteData.bossId) {
          const bossProfileRef = doc(db, 'profiles', inviteData.bossId)
          const bossProfileSnap = await getDoc(bossProfileRef)
          
          if (bossProfileSnap.exists()) {
            setBossProfile(bossProfileSnap.data() as UserProfile)
            setState('result')
            return
          }
        }

        // まだ診断していない
        setState('test')
      } catch (error) {
        console.error('Error loading invite:', error)
        alert('招待情報の読み込みに失敗しました')
      }
    }

    loadInvite()
  }, [token])

  // タイプライター効果
  useEffect(() => {
    if (state !== 'test') return
    
    setIsTyping(true)
    setDisplayText('')
    let index = 0
    const text = QUESTIONS[currentQuestion].text

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(timer)
      }
    }, 30)

    return () => clearInterval(timer)
  }, [currentQuestion, state])

  const handleAnswer = async (choiceIndex: number) => {
    if (isTyping) return

    const newAnswers = [...answers, choiceIndex]
    setAnswers(newAnswers)

    if (currentQuestion < QUESTIONS.length - 1) {
      setDirection(1)
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // 診断完了 - 結果を保存
      try {
        // 匿名認証
        const result = await signInAnonymously(auth)
        const bossId = result.user.uid

        const scores = calculateAxisScores(newAnswers)

        // 上司のプロフィールを保存
        await setDoc(doc(db, 'profiles', bossId), {
          userId: bossId,
          name: '上司',
          email: '',
          answers: newAnswers,
          scores,
          createdAt: new Date(),
        })

        // 招待情報を更新
        await updateDoc(doc(db, 'invites', token), {
          used: true,
          bossId,
          completedAt: new Date(),
        })

        // 上司プロフィールを設定
        setBossProfile({
          userId: bossId,
          answers: newAnswers,
          scores,
          createdAt: new Date(),
        })

        setState('result')
      } catch (error) {
        console.error('Error saving boss profile:', error)
        alert('診断結果の保存に失敗しました')
      }
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setDirection(-1)
      setCurrentQuestion(currentQuestion - 1)
      setAnswers(answers.slice(0, -1))
    }
  }

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">読み込んでいます...</p>
        </div>
      </div>
    )
  }

  if (state === 'test') {
    const question = QUESTIONS[currentQuestion]
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-lg border-b border-border z-10">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="gap-2"
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="w-4 h-4" />
                戻る
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentQuestion + 1} / {QUESTIONS.length}
              </span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        </div>

        {/* Question */}
        <div className="max-w-2xl w-full mt-32 mb-16">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestion}
              custom={direction}
              initial={{ x: direction * 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction * -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Card className="p-8 md:p-12 bg-card/50 backdrop-blur border-border/50">
                <div className="space-y-8">
                  <div className="min-h-[80px] flex items-center justify-center">
                    <h2 className="text-2xl md:text-3xl font-semibold text-center">
                      {displayText}
                      {isTyping && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="inline-block w-0.5 h-8 bg-primary ml-1 align-middle"
                        />
                      )}
                    </h2>
                  </div>

                  <div className="space-y-4 pt-4">
                    {question.choices.map((choice, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => handleAnswer(index)}
                          disabled={isTyping}
                          className="w-full h-auto py-6 px-6 text-base md:text-lg text-left justify-start hover:bg-primary/10 hover:border-primary hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                          <span className="flex-1">{choice}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Dots */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-1.5">
          {QUESTIONS.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index < currentQuestion
                  ? 'w-8 bg-primary'
                  : index === currentQuestion
                  ? 'w-12 bg-primary'
                  : 'w-1.5 bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    )
  }

  // Result State
  if (state === 'result' && subordinateProfile && bossProfile) {
    const compatibility = calculateCompatibility(bossProfile, subordinateProfile)

    return (
      <div className="min-h-screen p-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">相性診断結果</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              相性スコア：
              <span className="text-primary">{compatibility.totalScore}</span>
              <span className="text-2xl text-muted-foreground">/100</span>
            </h1>
          </motion.div>

          {/* Score Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>詳細スコア</CardTitle>
                <CardDescription>
                  3つの観点から相性を分析しています
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium flex items-center gap-2">
                      <Heart className="w-4 h-4 text-primary" />
                      心理安全性
                    </span>
                    <span className="text-primary font-bold">
                      {compatibility.psychologicalSafety}%
                    </span>
                  </div>
                  <Progress value={compatibility.psychologicalSafety} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    協調性とストレス反応の相性
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      コミュニケーション
                    </span>
                    <span className="text-primary font-bold">
                      {compatibility.communication}%
                    </span>
                  </div>
                  <Progress value={compatibility.communication} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    意思決定とフィードバックスタイルの相性
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-primary" />
                      補完性
                    </span>
                    <span className="text-primary font-bold">
                      {compatibility.complementarity}%
                    </span>
                  </div>
                  <Progress value={compatibility.complementarity} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    お互いを補完できる度合い
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Strengths */}
          {compatibility.strengths.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Heart className="w-5 h-5" />
                    強み
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {compatibility.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Cautions */}
          {compatibility.cautions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-yellow-500/20 bg-yellow-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-500">
                    <AlertCircle className="w-5 h-5" />
                    注意点
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {compatibility.cautions.map((caution, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-yellow-500 mt-1">⚠</span>
                        <span>{caution}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Tips */}
          {compatibility.tips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    アドバイス
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {compatibility.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">💡</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    )
  }

  return null
}

