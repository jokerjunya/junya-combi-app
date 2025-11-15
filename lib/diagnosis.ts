// 診断の6軸定義
export const AXES = {
  LOGIC_EMPATHY: 'logic_empathy', // 論理 ↔ 共感
  DIRECT_INDIRECT: 'direct_indirect', // 直接 ↔ 間接
  COOPERATION: 'cooperation', // 協調性
  STRESS_RESPONSE: 'stress_response', // ストレス反応
  PLANNING_IMPROVISATION: 'planning_improvisation', // 計画性 ↔ 即興性
  AUTONOMY_GUIDANCE: 'autonomy_guidance', // 自律 ↔ 伴走希望
} as const

export type AxisKey = typeof AXES[keyof typeof AXES]

// 質問データ型
export interface Question {
  id: number
  axis: AxisKey
  text: string
  choices: [string, string] // 2択
  weights: [number, number] // 0 or 1 で軸の値に影響
}

// 診断質問（12問）
export const QUESTIONS: Question[] = [
  // 論理 ↔ 共感 (2問)
  {
    id: 1,
    axis: AXES.LOGIC_EMPATHY,
    text: '意思決定するとき、何を重視しますか？',
    choices: ['データと論理的な根拠', '人の気持ちとチームの雰囲気'],
    weights: [0, 1],
  },
  {
    id: 2,
    axis: AXES.LOGIC_EMPATHY,
    text: '問題解決の際、まず何をしますか？',
    choices: ['原因を分析して仮説を立てる', 'メンバーの意見を聞いて調整する'],
    weights: [0, 1],
  },
  
  // 直接 ↔ 間接 (2問)
  {
    id: 3,
    axis: AXES.DIRECT_INDIRECT,
    text: 'フィードバックを伝えるとき、どうしますか？',
    choices: ['率直にはっきり伝える', '相手の様子を見ながら柔らかく伝える'],
    weights: [0, 1],
  },
  {
    id: 4,
    axis: AXES.DIRECT_INDIRECT,
    text: '意見の対立が起きたとき、どう対処しますか？',
    choices: ['その場で議論して解決する', '一度持ち帰って整理してから話す'],
    weights: [0, 1],
  },
  
  // 協調性 (2問)
  {
    id: 5,
    axis: AXES.COOPERATION,
    text: 'プロジェクトを進めるとき、どちらが好きですか？',
    choices: ['チームで協力して進める', '自分のペースで集中して進める'],
    weights: [1, 0],
  },
  {
    id: 6,
    axis: AXES.COOPERATION,
    text: '会議での役割はどちらが多いですか？',
    choices: ['積極的に発言して場を動かす', '必要なときに発言して支援する'],
    weights: [1, 0],
  },
  
  // ストレス反応 (2問)
  {
    id: 7,
    axis: AXES.STRESS_RESPONSE,
    text: 'プレッシャーがかかったとき、どうなりますか？',
    choices: ['燃えてパフォーマンスが上がる', '冷静さを保つのに意識を使う'],
    weights: [0, 1],
  },
  {
    id: 8,
    axis: AXES.STRESS_RESPONSE,
    text: 'ストレスを感じたとき、どう対処しますか？',
    choices: ['誰かに話してスッキリする', '一人で整理して落ち着く'],
    weights: [1, 0],
  },
  
  // 計画性 ↔ 即興性 (2問)
  {
    id: 9,
    axis: AXES.PLANNING_IMPROVISATION,
    text: 'タスクを進めるとき、どちらが近いですか？',
    choices: ['計画を立ててから着手する', 'まず動いてみて調整していく'],
    weights: [0, 1],
  },
  {
    id: 10,
    axis: AXES.PLANNING_IMPROVISATION,
    text: '予定が変更になったとき、どう感じますか？',
    choices: ['困る、事前に決めておきたい', '柔軟に対応できるので平気'],
    weights: [0, 1],
  },
  
  // 自律 ↔ 伴走希望 (2問)
  {
    id: 11,
    axis: AXES.AUTONOMY_GUIDANCE,
    text: '上司からのサポートは、どれくらい欲しいですか？',
    choices: ['最小限、必要なときだけ', '定期的に進捗確認や相談したい'],
    weights: [0, 1],
  },
  {
    id: 12,
    axis: AXES.AUTONOMY_GUIDANCE,
    text: '新しい業務を任されたとき、どうしますか？',
    choices: ['まず自分で調べて試す', '方向性を確認してから進める'],
    weights: [0, 1],
  },
]

// ユーザープロファイル型
export interface UserProfile {
  userId: string
  answers: number[] // 各質問の選択肢インデックス（0 or 1）
  scores: Record<AxisKey, number> // 各軸のスコア（0-1の範囲）
  createdAt: Date
}

// 回答から軸スコアを計算
export function calculateAxisScores(answers: number[]): Record<AxisKey, number> {
  const scores: Record<string, number[]> = {}
  
  // 軸ごとに回答を集計
  QUESTIONS.forEach((question, index) => {
    const answerIndex = answers[index]
    const value = question.weights[answerIndex]
    
    if (!scores[question.axis]) {
      scores[question.axis] = []
    }
    scores[question.axis].push(value)
  })
  
  // 軸ごとの平均を計算
  const result: Record<AxisKey, number> = {} as Record<AxisKey, number>
  Object.keys(scores).forEach((axis) => {
    const values = scores[axis]
    result[axis as AxisKey] = values.reduce((a, b) => a + b, 0) / values.length
  })
  
  return result
}

// 2者の相性スコアを計算
export interface CompatibilityResult {
  totalScore: number // 0-100
  psychologicalSafety: number // 心理安全性スコア
  communication: number // コミュニケーションスコア
  complementarity: number // 補完性スコア
  strengths: string[] // 良い点
  cautions: string[] // 注意点
  tips: string[] // アドバイス
}

export function calculateCompatibility(
  profile1: UserProfile,
  profile2: UserProfile
): CompatibilityResult {
  const s1 = profile1.scores
  const s2 = profile2.scores
  
  // 1. 心理安全性（協調性＋ストレス反応の類似度）- 最重要
  const cooperationSimilarity = 1 - Math.abs(s1.cooperation - s2.cooperation)
  const stressSimilarity = 1 - Math.abs(s1.stress_response - s2.stress_response)
  const psychologicalSafety = (cooperationSimilarity + stressSimilarity) / 2
  
  // 2. コミュニケーション（論理共感＋直接間接の類似度）
  const logicSimilarity = 1 - Math.abs(s1.logic_empathy - s2.logic_empathy)
  const directSimilarity = 1 - Math.abs(s1.direct_indirect - s2.direct_indirect)
  const communication = (logicSimilarity + directSimilarity) / 2
  
  // 3. 補完性（計画性と自律性の適度な違い）
  const planningDiff = Math.abs(s1.planning_improvisation - s2.planning_improvisation)
  const autonomyDiff = Math.abs(s1.autonomy_guidance - s2.autonomy_guidance)
  // 0.2-0.5の違いが理想的（補完し合える）
  const planningComp = 1 - Math.abs(planningDiff - 0.35) / 0.65
  const autonomyComp = 1 - Math.abs(autonomyDiff - 0.35) / 0.65
  const complementarity = (planningComp + autonomyComp) / 2
  
  // 総合スコア（重み付け）
  const totalScore = Math.round(
    psychologicalSafety * 50 + // 50%
    communication * 30 + // 30%
    complementarity * 20 // 20%
  )
  
  // フィードバック生成
  const strengths: string[] = []
  const cautions: string[] = []
  const tips: string[] = []
  
  // 心理安全性
  if (psychologicalSafety > 0.7) {
    strengths.push('協調性とストレス対処が似ているため、安心して働ける関係性')
  } else if (psychologicalSafety < 0.4) {
    cautions.push('ストレス反応や協調スタイルに違いがあります')
    tips.push('定期的な1on1で、お互いの状態を確認し合いましょう')
  }
  
  // コミュニケーション
  if (communication > 0.7) {
    strengths.push('コミュニケーションスタイルが合うため、意思疎通がスムーズ')
  } else if (communication < 0.4) {
    cautions.push('フィードバックの伝え方に差があります')
    tips.push('相手の受け取りやすい形でフィードバックを工夫しましょう')
  }
  
  // 補完性
  if (complementarity > 0.6) {
    strengths.push('計画性と自律性のバランスが良く、お互いを補完できる')
  }
  
  // 自律性の組み合わせ
  if (s2.autonomy_guidance > 0.6 && s1.autonomy_guidance < 0.4) {
    tips.push('部下は伴走型サポートを求めています。定期的な進捗確認を')
  } else if (s2.autonomy_guidance < 0.4 && s1.autonomy_guidance > 0.6) {
    tips.push('部下は自律的に動くタイプです。信頼して任せましょう')
  }
  
  return {
    totalScore,
    psychologicalSafety: Math.round(psychologicalSafety * 100),
    communication: Math.round(communication * 100),
    complementarity: Math.round(complementarity * 100),
    strengths,
    cautions,
    tips,
  }
}

// 軸のラベルと説明
export const AXIS_LABELS: Record<AxisKey, { name: string; low: string; high: string }> = {
  [AXES.LOGIC_EMPATHY]: {
    name: '意思決定スタイル',
    low: '論理重視',
    high: '共感重視',
  },
  [AXES.DIRECT_INDIRECT]: {
    name: 'コミュニケーション',
    low: '直接的',
    high: '間接的',
  },
  [AXES.COOPERATION]: {
    name: '協調性',
    low: '個人志向',
    high: 'チーム志向',
  },
  [AXES.STRESS_RESPONSE]: {
    name: 'ストレス反応',
    low: 'プレッシャーに強い',
    high: '慎重に対処',
  },
  [AXES.PLANNING_IMPROVISATION]: {
    name: '仕事の進め方',
    low: '計画重視',
    high: '即興・柔軟',
  },
  [AXES.AUTONOMY_GUIDANCE]: {
    name: 'サポート希望度',
    low: '自律志向',
    high: '伴走希望',
  },
}

