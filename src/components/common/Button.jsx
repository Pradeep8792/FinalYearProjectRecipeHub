function Button({ children, className = '', variant = 'primary', ...props }) {
  const styles = variant === 'secondary' ? 'btn-secondary' : 'btn-primary'
  return (
    <button className={`${styles} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
