function EmptyState({
  title = 'Nothing here yet',
  message = 'Try another search or add a new recipe to get started.',
  emoji = '🍓',
}) {
  return (
    <div className="soft-card mx-auto flex max-w-sm flex-col items-center gap-3 px-6 py-10 text-center">
      <div className="icon-bubble text-4xl">{emoji}</div>
      <h3 className="text-xl font-extrabold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  )
}

export default EmptyState
