import { FiSearch } from 'react-icons/fi'

function SearchBar({ value, onChange, placeholder = 'Search recipes...' }) {
  return (
    <div className="relative w-full">
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        className="input-base pl-11"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default SearchBar
