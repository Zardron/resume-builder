const getStatusMessage = (status) => {
  if (status === 'success') {
    return 'Thanks for your feedback! We will review it shortly.'
  }

  if (status === 'error') {
    return 'Please add your name, email, rating, and message before submitting.'
  }

  return 'Submissions are reviewed before being featured publicly.'
}

const getStatusClasses = (status) => {
  if (status === 'success') {
    return 'text-emerald-600 dark:text-emerald-400'
  }

  if (status === 'error') {
    return 'text-red-600 dark:text-red-400'
  }

  return 'text-slate-500 dark:text-slate-400'
}

const StatusMessage = ({ status }) => {
  return (
    <p role="status" aria-live="polite" className={`text-sm ${getStatusClasses(status)}`}>
      {getStatusMessage(status)}
    </p>
  )
}

export default StatusMessage


