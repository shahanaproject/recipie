function Loading({ label = 'Whisking something tasty...' }) {
  return (
    <div className="soft-card mx-auto flex max-w-sm flex-col items-center gap-4 px-6 py-10 text-center">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-pink-200"></div>
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-pink-400 border-r-yellow-300"></div>
        <div className="absolute inset-3 flex items-center justify-center rounded-full bg-white text-2xl shadow-inner">
          🍜
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-600">{label}</p>
    </div>
  )
}

export default Loading
