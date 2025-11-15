'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { Share2, Copy, CheckCircle2, ArrowRight } from 'lucide-react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { UserProfile, AXIS_LABELS, AXES, AxisKey } from '@/lib/diagnosis'

export default function ResultPage() {
  const params = useParams()
  const userId = params.id as string
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [inviteToken, setInviteToken] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const docRef = doc(db, 'profiles', userId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile
          setProfile(data)
        } else {
          alert('プロフィールが見つかりませんでした')
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        alert('プロフィールの読み込みに失敗しました')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [userId])

  const generateInviteLink = async () => {
    try {
      // ユニークなトークンを生成
      const token = `${userId}-${Date.now()}`
      
      // 招待情報を保存
      await setDoc(doc(db, 'invites', token), {
        subordinateId: userId,
        createdAt: new Date(),
        used: false,
      })

      setInviteToken(token)
    } catch (error) {
      console.error('Error generating invite:', error)
      alert('招待リンクの生成に失敗しました')
    }
  }

  const copyInviteLink = () => {
    if (!inviteToken) return
    
    const link = `${window.location.origin}/pair/${inviteToken}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">結果を読み込んでいます...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>エラー</CardTitle>
            <CardDescription>プロフィールが見つかりませんでした</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const axisKeys = Object.values(AXES) as AxisKey[]

  return (
    <div className="min-h-screen p-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            あなたの
            <span className="text-primary">仕事スタイル</span>
          </h1>
          <p className="text-muted-foreground">
            6つの軸であなたの特徴を分析しました
          </p>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>診断結果</CardTitle>
              <CardDescription>
                各軸のスコアが表示されています
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {axisKeys.map((axisKey, index) => {
                const score = profile.scores[axisKey]
                const label = AXIS_LABELS[axisKey]
                
                return (
                  <motion.div
                    key={axisKey}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{label.name}</span>
                      <span className="text-muted-foreground">
                        {Math.round(score * 100)}%
                      </span>
                    </div>
                    <div className="relative">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{label.low}</span>
                        <span>{label.high}</span>
                      </div>
                      <Progress value={score * 100} className="h-3" />
                    </div>
                  </motion.div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Invite Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
                上司との相性を診断
              </CardTitle>
              <CardDescription>
                上司に診断を受けてもらうと、相性スコアが表示されます
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!inviteToken ? (
                <Button
                  onClick={generateInviteLink}
                  size="lg"
                  className="w-full gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  招待リンクを生成
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                    <p className="text-sm font-mono break-all">
                      {`${window.location.origin}/pair/${inviteToken}`}
                    </p>
                  </div>
                  <Button
                    onClick={copyInviteLink}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        コピーしました！
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        リンクをコピー
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    このリンクを上司に送信してください
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center space-y-4"
        >
          <p className="text-sm text-muted-foreground">
            診断結果は保存されました。上司が診断を完了すると、相性レポートが表示されます。
          </p>
        </motion.div>
      </div>
    </div>
  )
}

