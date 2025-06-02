import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const BOLLYWOOD_QUESTIONS = [
  {
    id: 1,
    text: "Which actor is known as the 'King of Bollywood'?",
    options: ["Amitabh Bachchan", "Shah Rukh Khan", "Salman Khan", "Aamir Khan"],
    correctAnswer: 1,
    category: "Actors",
    difficulty: "Easy",
    explanation: "Shah Rukh Khan is widely known as the 'King of Bollywood' or 'King Khan' for his immense popularity and contribution to Indian cinema."
  },
  {
    id: 2,
    text: "In which movie did Amitabh Bachchan play the role of 'Vijay Dinanath Chauhan'?",
    options: ["Sholay", "Agneepath", "Deewaar", "Don"],
    correctAnswer: 1,
    category: "Movies",
    difficulty: "Medium",
    explanation: "Amitabh Bachchan played Vijay Dinanath Chauhan in the 1990 film 'Agneepath', which was later remade in 2012 with Hrithik Roshan."
  },
  {
    id: 3,
    text: "Which song features the famous line 'Kitne aadmi the'?",
    options: ["Sholay", "Gabbar Singh", "Jai Veeru", "None of these"],
    correctAnswer: 0,
    category: "Dialogues",
    difficulty: "Easy",
    explanation: "This iconic dialogue 'Kitne aadmi the' was spoken by Gabbar Singh (Amjad Khan) in the classic film Sholay (1975)."
  },
  {
    id: 4,
    text: "Who directed the movie 'Lagaan'?",
    options: ["Rajkumar Hirani", "Ashutosh Gowariker", "Sanjay Leela Bhansali", "Karan Johar"],
    correctAnswer: 1,
    category: "Directors",
    difficulty: "Medium",
    explanation: "Ashutosh Gowariker directed 'Lagaan' (2001), which was nominated for the Academy Award for Best Foreign Language Film."
  },
  {
    id: 5,
    text: "Which actress won the National Film Award for 'Queen'?",
    options: ["Deepika Padukone", "Kangana Ranaut", "Priyanka Chopra", "Vidya Balan"],
    correctAnswer: 1,
    category: "Awards",
    difficulty: "Hard",
    explanation: "Kangana Ranaut won the National Film Award for Best Actress for her performance in 'Queen' (2013)."
  },
  {
    id: 6,
    text: "In which year was the first Bollywood film 'Raja Harishchandra' released?",
    options: ["1913", "1915", "1920", "1925"],
    correctAnswer: 0,
    category: "History",
    difficulty: "Hard",
    explanation: "'Raja Harishchandra' directed by Dadasaheb Phalke was released in 1913 and is considered the first full-length Indian feature film."
  }
]

const CATEGORIES = ["All", "Actors", "Movies", "Directors", "Awards", "History", "Dialogues"]
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"]

const MainFeature = () => {
  const [gameState, setGameState] = useState('menu') // menu, playing, results
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [timerActive, setTimerActive] = useState(false)

  // Timer effect
  useEffect(() => {
    let timer
    if (timerActive && timeLeft > 0 && gameState === 'playing' && !showExplanation) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleTimeUp()
    }
    return () => clearInterval(timer)
  }, [timerActive, timeLeft, gameState, showExplanation])

  const startQuiz = () => {
    let filteredQuestions = BOLLYWOOD_QUESTIONS

    if (selectedCategory !== 'All') {
      filteredQuestions = filteredQuestions.filter(q => q.category === selectedCategory)
    }
    if (selectedDifficulty !== 'All') {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === selectedDifficulty)
    }

    if (filteredQuestions.length === 0) {
      toast.error('No questions available for selected filters!')
      return
    }

    // Shuffle questions
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5)
    setQuizQuestions(shuffled)
    setGameState('playing')
    setCurrentQuestion(0)
    setScore(0)
    setUserAnswers([])
    setSelectedAnswer(null)
    setTimeLeft(30)
    setTimerActive(true)
    setShowExplanation(false)
    toast.success('Quiz started! Good luck! 🎬')
  }

  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null || showExplanation) return
    setSelectedAnswer(answerIndex)
    setTimerActive(false)
    
    const isCorrect = answerIndex === quizQuestions[currentQuestion].correctAnswer
    const newUserAnswers = [...userAnswers, {
      questionId: quizQuestions[currentQuestion].id,
      selectedAnswer: answerIndex,
      correct: isCorrect,
      timeSpent: 30 - timeLeft
    }]
    setUserAnswers(newUserAnswers)
    
    if (isCorrect) {
      setScore(prev => prev + 1)
      toast.success('Correct! 🎉')
    } else {
      toast.error('Wrong answer! 😞')
    }
    
    setShowExplanation(true)
  }

  const handleTimeUp = () => {
    if (selectedAnswer !== null) return
    setTimerActive(false)
    setSelectedAnswer(-1) // -1 indicates time up
    const newUserAnswers = [...userAnswers, {
      questionId: quizQuestions[currentQuestion].id,
      selectedAnswer: -1,
      correct: false,
      timeSpent: 30
    }]
    setUserAnswers(newUserAnswers)
    setShowExplanation(true)
    toast.warning('Time\'s up! ⏰')
  }

  const nextQuestion = () => {
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setTimeLeft(30)
      setTimerActive(true)
      setShowExplanation(false)
    } else {
      endQuiz()
    }
  }

  const endQuiz = () => {
    setGameState('results')
    setTimerActive(false)
    const percentage = Math.round((score / quizQuestions.length) * 100)
    
    if (percentage >= 80) {
      toast.success(`Excellent! You scored ${percentage}%! 🌟`)
    } else if (percentage >= 60) {
      toast.success(`Good job! You scored ${percentage}%! 👏`)
    } else {
      toast.info(`You scored ${percentage}%. Keep practicing! 📚`)
    }
  }

  const resetQuiz = () => {
    setGameState('menu')
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setUserAnswers([])
    setTimeLeft(30)
    setShowExplanation(false)
    setTimerActive(false)
    setQuizQuestions([])
  }

  const getTimerColor = () => {
    if (timeLeft > 20) return 'text-green-500'
    if (timeLeft > 10) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / quizQuestions.length) * 100
  }

  if (gameState === 'menu') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl flex items-center justify-center shadow-glow"
          >
            <ApperIcon name="Film" className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4"
          >
            BollyQuiz Challenge
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-surface-600 dark:text-surface-400 max-w-2xl mx-auto text-balance"
          >
            Test your knowledge of Bollywood movies, actors, and iconic moments. 
            Choose your category and difficulty level to get started!
          </motion.p>
        </div>

        {/* Quiz Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="quiz-card p-6 sm:p-8 mb-8"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-surface-800 dark:text-surface-200 mb-6 text-center">
            Customize Your Quiz
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
                <ApperIcon name="Tag" className="w-4 h-4 inline mr-2" />
                Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-primary text-white shadow-glow'
                        : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
                <ApperIcon name="Target" className="w-4 h-4 inline mr-2" />
                Difficulty
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DIFFICULTIES.map((difficulty) => (
                  <motion.button
                    key={difficulty}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedDifficulty === difficulty
                        ? 'bg-secondary text-surface-900 shadow-xl'
                        : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                    }`}
                  >
                    {difficulty}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startQuiz}
            className="w-full mt-8 quiz-button quiz-button-primary text-lg sm:text-xl py-4 flex items-center justify-center space-x-3"
          >
            <ApperIcon name="Play" className="w-6 h-6" />
            <span>Start Quiz</span>
          </motion.button>
        </motion.div>

        {/* Stats Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
        >
          {[
            { icon: "Brain", label: "Questions", value: BOLLYWOOD_QUESTIONS.length },
            { icon: "Clock", label: "Time per Question", value: "30s" },
            { icon: "Trophy", label: "Categories", value: CATEGORIES.length - 1 }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="quiz-card p-4 sm:p-6 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl flex items-center justify-center">
                <ApperIcon name={stat.icon} className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-surface-600 dark:text-surface-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    )
  }

  if (gameState === 'playing') {
    const question = quizQuestions[currentQuestion]
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Progress Header */}
        <div className="quiz-card p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-surface-600 dark:text-surface-400">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
              <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {question.category}
              </div>
              <div className="px-3 py-1 bg-secondary/10 text-secondary-dark rounded-full text-sm font-medium">
                {question.difficulty}
              </div>
            </div>
            
            {/* Timer */}
            <motion.div
              animate={{ scale: timeLeft <= 10 ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Infinity : 0 }}
              className={`flex items-center space-x-2 ${getTimerColor()}`}
            >
              <ApperIcon name="Clock" className="w-5 h-5" />
              <span className="text-2xl font-bold">{timeLeft}s</span>
            </motion.div>
          </div>
          
          {/* Progress Bar */}
          <div className="progress-bar">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.5 }}
              className="progress-fill"
            />
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="quiz-card p-6 sm:p-8 mb-6 sm:mb-8"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-surface-800 dark:text-surface-200 mb-6 sm:mb-8 text-center text-balance">
            {question.text}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {question.options.map((option, index) => {
              let optionClass = 'quiz-option'
              
              if (showExplanation) {
                if (index === question.correctAnswer) {
                  optionClass += ' quiz-option-correct'
                } else if (index === selectedAnswer && selectedAnswer !== question.correctAnswer) {
                  optionClass += ' quiz-option-incorrect'
                }
              } else if (selectedAnswer === index) {
                optionClass += ' quiz-option-selected'
              }
              
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={!showExplanation ? { scale: 1.02 } : {}}
                  whileTap={!showExplanation ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null || showExplanation}
                  className={optionClass}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-600 flex items-center justify-center text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-left">{option}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="quiz-card p-6 sm:p-8 mb-6 sm:mb-8 border-l-4 border-primary"
            >
              <div className="flex items-start space-x-3 mb-4">
                <ApperIcon name="Lightbulb" className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-2">
                    Explanation
                  </h3>
                  <p className="text-surface-600 dark:text-surface-400">
                    {question.explanation}
                  </p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextQuestion}
                className="quiz-button quiz-button-primary mt-4 flex items-center space-x-2"
              >
                {currentQuestion + 1 < quizQuestions.length ? (
                  <>
                    <span>Next Question</span>
                    <ApperIcon name="ArrowRight" className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <span>View Results</span>
                    <ApperIcon name="BarChart3" className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Score Display */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-4 px-6 py-3 bg-white dark:bg-surface-800 rounded-2xl shadow-card">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Trophy" className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold text-surface-800 dark:text-surface-200">
                Score: {score}/{quizQuestions.length}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (gameState === 'results') {
    const percentage = Math.round((score / quizQuestions.length) * 100)
    const averageTime = userAnswers.reduce((acc, ans) => acc + ans.timeSpent, 0) / userAnswers.length
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Results Header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-glow"
          >
            <ApperIcon name="Trophy" className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-800 dark:text-surface-200 mb-4"
          >
            Quiz Complete!
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            {percentage}%
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8"
        >
          {[
            { icon: "Target", label: "Correct", value: score, total: quizQuestions.length },
            { icon: "Clock", label: "Avg Time", value: `${Math.round(averageTime)}s`, total: null },
            { icon: "Percent", label: "Accuracy", value: `${percentage}%`, total: null }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="quiz-card p-6 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                <ApperIcon name={stat.icon} className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                {stat.total ? `${stat.value}/${stat.total}` : stat.value}
              </div>
              <div className="text-sm text-surface-600 dark:text-surface-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Question Review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="quiz-card p-6 sm:p-8 mb-8"
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-surface-800 dark:text-surface-200 mb-6">
            Question Review
          </h3>
          
          <div className="space-y-4">
            {quizQuestions.map((question, index) => {
              const userAnswer = userAnswers[index]
              const isCorrect = userAnswer.correct
              
              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className={`p-4 rounded-xl border-2 ${
                    isCorrect 
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                      : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <ApperIcon 
                      name={isCorrect ? "CheckCircle" : "XCircle"} 
                      className={`w-6 h-6 flex-shrink-0 mt-1 ${
                        isCorrect ? 'text-green-500' : 'text-red-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-surface-800 dark:text-surface-200 mb-2">
                        {question.text}
                      </p>
                      <div className="text-sm text-surface-600 dark:text-surface-400">
                        <p>
                          <span className="font-medium">Correct Answer:</span> {question.options[question.correctAnswer]}
                        </p>
                        {!isCorrect && userAnswer.selectedAnswer !== -1 && (
                          <p>
                            <span className="font-medium">Your Answer:</span> {question.options[userAnswer.selectedAnswer]}
                          </p>
                        )}
                        {userAnswer.selectedAnswer === -1 && (
                          <p className="text-red-500">Time's up - No answer selected</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startQuiz}
            className="quiz-button quiz-button-primary flex items-center justify-center space-x-2"
          >
            <ApperIcon name="RotateCcw" className="w-5 h-5" />
            <span>Play Again</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetQuiz}
            className="quiz-button quiz-button-secondary flex items-center justify-center space-x-2"
          >
            <ApperIcon name="Home" className="w-5 h-5" />
            <span>Main Menu</span>
          </motion.button>
        </motion.div>
      </motion.div>
    )
  }
}

export default MainFeature