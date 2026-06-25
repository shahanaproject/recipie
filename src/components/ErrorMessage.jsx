function ErrorMessage({ message = 'Something went wrong. Please try again.' }) {
  return (
    <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 shadow-[0_14px_30px_rgba(251,113,133,0.15)]">
      {message}
    </div>
  )
}

export default ErrorMessage
