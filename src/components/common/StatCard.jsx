import { motion } from 'framer-motion'

function StatCard({ icon, title, value, subtitle, trend }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="card-premium flex flex-col justify-between"
    >
      <div className="flex items-start justify-between mb-8">
        <div className="h-16 w-16 rounded-3xl bg-surface-50 flex items-center justify-center text-3xl text-surface-900 shadow-sm border border-surface-100 transition-all group-hover:bg-primary-500 group-hover:text-white">
          {icon}
        </div>
        {trend && (
          <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider">
            +{trend}%
          </span>
        )}
      </div>

      <div>
        <h3 className="text-5xl font-black text-surface-900 mb-2 tracking-tighter">{value}</h3>
        <p className="text-sm font-bold text-surface-400 uppercase tracking-widest">{title}</p>
        {subtitle && <p className="mt-4 text-xs font-semibold text-primary-500/80">{subtitle}</p>}
      </div>
    </motion.div>
  )
}

export default StatCard
