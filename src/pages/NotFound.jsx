import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg"
        >
          <ApperIcon name="AlertTriangle" className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
        </motion.div>
        
        <h1 className="text-4xl sm:text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-surface-800 dark:text-surface-200 mb-4">
          Page Not Found
        </h2>
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          Looks like this page took a wrong turn at Bollywood!
        </p>
        
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="quiz-button quiz-button-primary inline-flex items-center space-x-2"
          >
            <ApperIcon name="Home" className="w-5 h-5" />
            <span>Back to Quiz</span>
          </motion.button>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound