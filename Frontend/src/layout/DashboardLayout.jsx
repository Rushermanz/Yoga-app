import React, { useState } from 'react'
import useAuth from '../hooks/useAuth'
import useUser from '../hooks/useUser'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import Scroll from '../hooks/useScroll'
import { HashLoader } from 'react-spinners'

// ── Nav items per role ──────────────────────────────────────
const adminNavItems = [
  { to: '/dashboard/admin-home',  label: 'Overview',               icon: IconGrid },
  { to: '/dashboard/manage-users',label: 'Users',                   icon: IconUsers },
  { to: '/dashboard/manage-class',label: 'Classes',                 icon: IconBook },
]

const instructorNavItems = [
  { to: '/dashboard/instructor-cp', label: 'Overview',             icon: IconGrid },
  { to: '/dashboard/add-class',     label: 'Create Class',         icon: IconPlus },
  { to: '/dashboard/my-classes',    label: 'My Classes',           icon: IconBook },
]

const studentNavItems = [
  { to: '/dashboard/student-cp',     label: 'Home',                icon: IconGrid },
  { to: '/dashboard/enrolled-class', label: 'My Training',         icon: IconPlay },
  { to: '/dashboard/my-selected',    label: 'Saved Classes',       icon: IconBookmark },
  { to: '/dashboard/my-payments',    label: 'Payments',            icon: IconCard },
  { to: '/dashboard/apply-instructor',label: 'Become an Instructor',icon: IconBadge },
]

// ── Inline SVG Icons ────────────────────────────────────────
function IconGrid()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/></svg> }
function IconUsers()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2"/></svg> }
function IconBook()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2"/></svg> }
function IconPlay()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M10 8l6 4-6 4V8z" fill="currentColor"/></svg> }
function IconBookmark() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function IconCard()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M1 10h22" stroke="currentColor" strokeWidth="2"/></svg> }
function IconBadge()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg> }
function IconPlus()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> }
function IconHome()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="2"/><path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="2"/></svg> }
function IconLogout()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2"/><polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/></svg> }

// ── NavItem component ────────────────────────────────────────
const NavItem = ({ to, label, icon: Icon, collapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
        isActive
          ? 'bg-teal text-white shadow-sm'
          : 'text-[#667085] hover:bg-[#EEF2F5] hover:text-[#17202A]'
      }`
    }
  >
    <span className="flex-shrink-0 w-4 h-4"><Icon /></span>
    {!collapsed && <span className="origin-left transition-all duration-200">{label}</span>}
  </NavLink>
)

// ── Main DashboardLayout ─────────────────────────────────────
const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const { logout } = useAuth()
  const { currentUser, isLoading } = useUser()
  const navigate = useNavigate()
  const role = currentUser?.role

  const navItems =
    role === 'admin'      ? adminNavItems :
    role === 'instructor' ? instructorNavItems :
                            studentNavItems

  const handleLogOut = () => {
    Swal.fire({
      title: 'Log out?',
      text: "You'll need to sign back in.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#12B8A6',
      cancelButtonColor: '#667085',
      confirmButtonText: 'Yes, log out',
    }).then((result) => {
      if (result.isConfirmed) {
        logout()
          .then(() => navigate('/'))
          .catch((err) => console.error(err))
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-base">
        <HashLoader color="#12B8A6" size={40} />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden">
      {/* ── Sidebar ──────────────────────────────── */}
      <aside
        className={`${
          collapsed ? 'w-16' : 'w-60'
        } hidden md:flex flex-col bg-white border-r border-border-ui pt-5 pb-4 transition-all duration-250 flex-shrink-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 mb-6">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center flex-shrink-0 hover:bg-teal-600 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              {collapsed
                ? <path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                : <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              }
            </svg>
          </button>
          {!collapsed && (
            <Link to="/" className="text-navy font-bold text-base whitespace-nowrap overflow-hidden">
              Yoga Master
            </Link>
          )}
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div className="px-4 mb-4">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
              role === 'admin'      ? 'bg-coral-100 text-coral' :
              role === 'instructor' ? 'bg-blue-ai-100 text-blue-ai' :
                                     'bg-teal-100 text-teal'
            }`}>
              {role === 'admin' ? 'Admin' : role === 'instructor' ? 'Instructor' : 'Member'}
            </span>
          </div>
        )}

        {/* Navigation */}
        {!collapsed && (
          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">Menu</p>
        )}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Bottom links */}
        <div className="px-3 pt-3 border-t border-border-ui space-y-0.5">
          <NavItem to="/" label="Back to Home" icon={IconHome} collapsed={collapsed} />
          <button
            onClick={handleLogOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-error hover:bg-red-50 transition-all duration-150"
          >
            <span className="flex-shrink-0 w-4 h-4"><IconLogout /></span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 h-14 bg-white border-b border-border-ui flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-border-ui" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white text-sm font-bold">
                {currentUser?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-text-primary leading-tight">{currentUser?.name || 'User'}</p>
              <p className="text-xs text-text-secondary capitalize">{role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary hidden sm:block">{currentUser?.email}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <Scroll />
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
