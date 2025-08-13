import { NavLink } from 'react-router-dom';
export default function Navigation({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-md text-sm font-medium
         ${isActive ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`
      }
    >
      {label}
    </NavLink>
  );
}
