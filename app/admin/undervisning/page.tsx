"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

// --- SIMPLE KOMPONENTER ---
const Button = ({ children, onClick, className = "" }: any) => (
  <button
    onClick={onClick}
    className={`bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-xl transition duration-200 ${className}`}
  >
    {children}
  </button>
)

// --- QUIZ TOPICS ---
const quizTopics = [
  { id: 1, title: "Bilforsikring", description: "Test din viden om dækninger, kasko og ansvar", icon: "🚗" },
  { id: 2, title: "Indboforsikring", description: "Bliv ekspert i indbo, brand og genanskaffelse", icon: "🏠" },
  { id: 3, title: "Rejseforsikring", description: "Alt fra bagage til hjemtransport, kender du det?", icon: "✈️" },
  { id: 4, title: "Liv & Ulykke", description: "Forstå forskellen på livsforsikring og ulykkesdækning", icon: "❤️" },
  { id: 5, title: "Erhvervsforsikring", description: "Hvor godt kender du forsikring til virksomheder?", icon: "🏢" },
]

// --- QUESTIONS ---
const questionsData: Record<string, { q: string; a: string }[]> = {
  Bilforsikring: [
    { q: "Hvad dækker kaskoforsikring?", a: "Skader på din egen bil" },
    { q: "Hvad dækker ansvarsforsikring?", a: "Skader du laver på andre" },
  ],
  Indboforsikring: [
    { q: "Hvad dækker tyveri fra bil?", a: "Kun hvis bilen er aflåst" },
    { q: "Hvad dækker brand?", a: "Alt indbo i hjemmet" },
  ],
  Rejseforsikring: [
    { q: "Hvornår dækker afbestillingsforsikring?", a: "Ved sygdom før rejsen" },
    { q: "Hvad dækker bagageforsikring?", a: "Forsinket eller bortkommet bagage" },
  ],
  "Liv & Ulykke": [
    { q: "Hvornår får man udbetaling ved livsforsikring?", a: "Ved død" },
    { q: "Hvad dækker ulykkesforsikring?", a: "Varige mén efter ulykke" },
  ],
  Erhvervsforsikring: [
    { q: "Hvad dækker erhvervsansvarsforsikring?", a: "Skader på kunder eller deres ting" },
    { q: "Hvad dækker driftstabsforsikring?", a: "Tab ved midlertidig standsning af drift" },
  ],
}

export default function UndervisningPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)

  // USER
  const [userId, setUserId] = useState<string | null>(null)
  const [username, setUsername] = useState("")
  const [usernameModal, setUsernameModal] = useState(false)

  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lastActive, setLastActive] = useState<string | null>(null)

  const [leaderboard, setLeaderboard] = useState<any[]>([])

  const topicQuestions = selectedTopic ? questionsData[selectedTopic] : []
  const currentQ = topicQuestions[currentQuestion]

  const level = score < 3 ? "Beginner 🐣" : score < 6 ? "Expert 💡" : "Guru 🔥"

  // LOAD USER ON START
  useEffect(() => {
    const id = localStorage.getItem("training_user_id")

    if (!id) {
      setUsernameModal(true)
      return
    }

    setUserId(id)
    loadUser(id)
    loadLeaderboard()
  }, [])

  async function loadUser(id: string) {
    const { data } = await supabase
      .from("training_users")
      .select("*")
      .eq("id", id)
      .single()

    // hvis username mangler → popup
    if (!data?.username || data.username.trim() === "") {
      setUsernameModal(true)
      return
    }

    setScore(data.score)
    setStreak(data.streak)
    setLastActive(data.last_active_date)

    handleStreakLogic(data.last_active_date, data.streak)
  }

  async function loadLeaderboard() {
    const { data } = await supabase
      .from("training_users")
      .select("username, score, streak")
      .order("score", { ascending: false })
      .order("streak", { ascending: false })
      .limit(10)

    setLeaderboard(data || [])
  }

  // CREATE USER
  async function createUser() {
    if (!username.trim()) return

    const { data } = await supabase
      .from("training_users")
      .insert([{ username }])
      .select()
      .single()

    localStorage.setItem("training_user_id", data.id)
    setUserId(data.id)
    setUsernameModal(false)

    loadLeaderboard()
  }

  // STREAK LOGIC
  const handleStreakLogic = async (savedDate: string | null, savedStreak: number) => {
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    let newStreak = savedStreak

    if (!savedDate || savedDate === today) newStreak = savedStreak
    else if (savedDate === yesterday) newStreak = savedStreak + 1
    else newStreak = 1

    setStreak(newStreak)
    setLastActive(today)

    if (userId) {
      await supabase
        .from("training_users")
        .update({ streak: newStreak, last_active_date: today })
        .eq("id", userId)

      loadLeaderboard()
    }
  }

  // ANSWER QUESTION
  const handleAnswer = async () => {
    const newScore = score + 1
    setScore(newScore)

    if (userId) {
      await supabase
        .from("training_users")
        .update({ score: newScore })
        .eq("id", userId)

      loadLeaderboard()
    }

    const next = currentQuestion + 1
    if (next < topicQuestions.length) setCurrentQuestion(next)
    else {
      setSelectedTopic(null)
      setCurrentQuestion(0)
    }
  }

  return (
    <div className="p-6 text-gray-800 min-h-screen bg-gray-50 relative">

      {/* USERNAME POPUP */}
      {usernameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-[420px] text-center border">
            <h2 className="text-2xl font-semibold mb-3">Vælg dit brugernavn</h2>
            <p className="text-gray-500 text-sm mb-4">
              Dit username bruges til leaderboard og ranking
            </p>

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border px-4 py-3 rounded-lg mb-5"
              placeholder="Fx: MikkelTryg"
            />

            <Button onClick={createUser} className="w-full text-lg py-3">
              Gem og fortsæt
            </Button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-red-600">Undervisning</h1>

        <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-xl shadow-sm border">
          <div className="text-sm">
            <div className="font-medium text-gray-600">Niveau</div>
            <div className="text-red-600 font-semibold">{level}</div>
          </div>

          <div className="text-sm text-center border-l pl-6">
            <div className="font-medium text-gray-600">Score</div>
            <div className="text-red-600 font-semibold text-lg">{score}</div>
          </div>

          <div className="text-sm text-center border-l pl-6">
            <div className="font-medium text-gray-600">Streak</div>
            <div className="text-orange-500 font-semibold text-lg">{streak} 🔥</div>
          </div>
        </div>
      </div>

      {/* QUIZ VIEW */}
      {!selectedTopic ? (
        <>
          {/* QUIZ GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
            {quizTopics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(topic.title)}
                className="group relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-2xl hover:border-red-500 transition-all duration-300"
              >
                <div className="absolute top-4 right-4 text-3xl">{topic.icon}</div>
                <h2 className="text-xl font-semibold text-red-600 mb-2">{topic.title}</h2>
                <p className="text-gray-600 mb-4">{topic.description}</p>
                <div className="mt-2 text-sm font-medium text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Start quiz →
                </div>
              </div>
            ))}
          </div>

          {/* LEADERBOARD — full width (same width as grid) */}
          <div className="bg-white border rounded-2xl shadow-md p-8 w-full">
            <h2 className="text-2xl font-semibold text-red-600 mb-6 text-center">
              🏆 Leaderboard (Top 10)
            </h2>

            <div className="space-y-3">
              {leaderboard.map((user, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-gray-50 px-5 py-3 rounded-xl border hover:border-red-400 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-bold text-gray-700">{i + 1}.</div>
                    <div className="font-medium text-gray-800">{user.username}</div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold text-red-600">{user.score}</span> point
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold text-orange-500">{user.streak}</span> 🔥
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-lg border max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-6">{currentQ.q}</h2>
          <Button onClick={handleAnswer}>{currentQ.a}</Button>
          <p className="text-gray-500 mt-6">
            Spørgsmål {currentQuestion + 1} af {topicQuestions.length}
          </p>
        </div>
      )}
    </div>
  )
}
