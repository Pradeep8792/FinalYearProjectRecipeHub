function Input({ label, error, ...props }) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <input className="input-base" {...props} />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default Input
