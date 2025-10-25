interface LoaderProps {
  isDark?: boolean
}

export default function Loader({ isDark = false }: LoaderProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2.5 h-2.5 rounded-full ${
        isDark 
          ? 'bg-primary-500 shadow-primary-glow' 
          : 'bg-primary-500 shadow-primary-glow'
      } animate-bounce-gentle`} style={{ animationDelay: '0ms' }}></div>
      <div className={`w-2.5 h-2.5 rounded-full ${
        isDark 
          ? 'bg-accent-500 shadow-accent-glow' 
          : 'bg-accent-500 shadow-accent-glow'
      } animate-bounce-gentle`} style={{ animationDelay: '200ms' }}></div>
      <div className={`w-2.5 h-2.5 rounded-full ${
        isDark 
          ? 'bg-success-500 shadow-success-glow' 
          : 'bg-success-500 shadow-success-glow'
      } animate-bounce-gentle`} style={{ animationDelay: '400ms' }}></div>
    </div>
  )
}
