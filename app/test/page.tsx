'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { QUESTIONS } from '@/lib/diagnosis'
import { ArrowLeft } from 'lucide-react'

export default function TestPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [direction, setDirection] = useState(1)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  const question = QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100

  // タイプライター効果
  useEffect(() => {
    setIsTyping(true)
    setDisplayText('')
    let index = 0
    const text = question.text

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
  }, [currentQuestion, question.text])

  const handleAnswer = (choiceIndex: number) => {
    if (isTyping) return // タイピング中は無効

    const newAnswers = [...answers, choiceIndex]
    setAnswers(newAnswers)

    if (currentQuestion < QUESTIONS.length - 1) {
      setDirection(1)
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // 診断完了 -> ゲート画面へ
      if (typeof window !== 'undefined') {
        localStorage.setItem('diagnosis_answers', JSON.stringify(newAnswers))
      }
      router.push('/gate')
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setDirection(-1)
      setCurrentQuestion(currentQuestion - 1)
      setAnswers(answers.slice(0, -1))
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Header with Progress */}
      <div className="fixed top-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-2"
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

      {/* Question Card */}
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
                {/* Question Text */}
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

                {/* Choices */}
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

      {/* Question Number Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-8 left-0 right-0 flex justify-center gap-1.5"
      >
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
      </motion.div>
    </div>
  )
}

