import {
  LayoutDashboard, Newspaper, FolderKanban, Wrench, MessageSquareQuote,
  HelpCircle, Images, Mail, Send, LibraryBig, Settings, Search as SearchIcon,
  User, Activity,
} from 'lucide-react'

export const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', to: '/', icon: LayoutDashboard, roles: ['super_admin', 'admin', 'editor'] }],
  },
  {
    label: 'Content',
    items: [
      { label: 'Blog', to: '/blog', icon: Newspaper, roles: ['super_admin', 'admin', 'editor'] },
      { label: 'Projects', to: '/projects', icon: FolderKanban, roles: ['super_admin', 'admin', 'editor'] },
      { label: 'Services', to: '/services', icon: Wrench, roles: ['super_admin', 'admin', 'editor'] },
      { label: 'Testimonials', to: '/testimonials', icon: MessageSquareQuote, roles: ['super_admin', 'admin', 'editor'] },
      { label: 'FAQ', to: '/faq', icon: HelpCircle, roles: ['super_admin', 'admin', 'editor'] },
      { label: 'Gallery', to: '/gallery', icon: Images, roles: ['super_admin', 'admin', 'editor'] },
      { label: 'Media Library', to: '/media', icon: LibraryBig, roles: ['super_admin', 'admin', 'editor'] },
    ],
  },
  {
    label: 'Leads',
    items: [
      { label: 'Contact Messages', to: '/contact', icon: Mail, roles: ['super_admin', 'admin', 'editor'] },
      { label: 'Newsletter', to: '/newsletter', icon: Send, roles: ['super_admin', 'admin'] },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Activity Log', to: '/activity', icon: Activity, roles: ['super_admin', 'admin', 'editor'] },
      { label: 'Website Settings', to: '/settings', icon: Settings, roles: ['super_admin', 'admin'] },
      { label: 'SEO Settings', to: '/settings/seo', icon: SearchIcon, roles: ['super_admin', 'admin'] },
      { label: 'Admin Users', to: '/users', icon: User, roles: ['super_admin'] },
    ],
  },
]
