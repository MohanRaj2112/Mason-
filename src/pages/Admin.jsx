import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { initialToolsData, toolCategories } from '../data/tools';
import { servicesData } from '../data/services';
import { projectsData } from '../data/projects';

// Default mock datasets for initial hydration
const defaultAdminBookings = [
  {
    bookingId: 'MM-883921',
    customerName: 'Santhosh Kumar',
    phone: '+91 9159687408',
    email: 'santhosh@example.com',
    service: 'Turnkey House Construction',
    startDate: '2026-08-20',
    workers: 4,
    paymentMode: 'UPI',
    amount: 107940,
    status: 'Confirmed',
    location: 'Fairlands, Salem',
    notes: '2400 sq.ft residential villa foundation stage.'
  },
  {
    bookingId: 'MM-491024',
    customerName: 'Priya Rajan',
    phone: '+91 9840123456',
    email: 'priya.r@gmail.com',
    service: 'Renovation & Remodeling',
    startDate: '2026-08-25',
    workers: 2,
    paymentMode: 'Card',
    amount: 99875,
    status: 'Pending',
    location: 'RS Puram, Coimbatore',
    notes: 'Kitchen & living room structural remodeling.'
  },
  {
    bookingId: 'MM-310948',
    customerName: 'Karthik Raja',
    phone: '+91 9443210987',
    email: 'karthik.raja@outlook.com',
    service: 'Tool & Equipment Rental',
    startDate: '2026-08-18',
    workers: 1,
    paymentMode: 'Cash on Visit',
    amount: 1500,
    status: 'In Progress',
    location: 'Suramangalam, Salem',
    notes: 'Rotary hammer drill + needle vibrator for 3 days.'
  },
  {
    bookingId: 'MM-209412',
    customerName: 'Anand Sundaram',
    phone: '+91 9789012345',
    email: 'anand.s@yahoo.com',
    service: 'Master Mason Hiring',
    startDate: '2026-08-15',
    workers: 3,
    paymentMode: 'Net Banking',
    amount: 3600,
    status: 'Completed',
    location: 'Gandhipuram, Coimbatore',
    notes: 'Compound wall & brick partition masonry.'
  }
];

const defaultAdminCustomers = [
  { id: 'c1', name: 'Santhosh Kumar', phone: '+91 9159687408', email: 'santhosh@example.com', joinedDate: '2026-07-10', totalBookings: 2, location: 'Salem' },
  { id: 'c2', name: 'Priya Rajan', phone: '+91 9840123456', email: 'priya.r@gmail.com', joinedDate: '2026-07-22', totalBookings: 1, location: 'Coimbatore' },
  { id: 'c3', name: 'Karthik Raja', phone: '+91 9443210987', email: 'karthik.raja@outlook.com', joinedDate: '2026-08-01', totalBookings: 3, location: 'Salem' },
  { id: 'c4', name: 'Anand Sundaram', phone: '+91 9789012345', email: 'anand.s@yahoo.com', joinedDate: '2026-08-05', totalBookings: 1, location: 'Coimbatore' },
  { id: 'c5', name: 'Dr. Meenakshi', phone: '+91 9940112233', email: 'meenakshi.doc@gmail.com', joinedDate: '2026-08-08', totalBookings: 2, location: 'Erode' }
];

const defaultAdminMessages = [
  {
    id: 'msg-101',
    name: 'Venkatesh Raman',
    phone: '+91 9876543210',
    email: 'venkat.raman@gmail.com',
    service: 'Turnkey Construction',
    budget: '₹45 - 60 Lakhs',
    message: 'Looking to construct a 2200 sq.ft G+1 independent house near Salem Junction. Please provide material package brochure.',
    date: '2026-08-16',
    status: 'New'
  },
  {
    id: 'msg-102',
    name: 'Saravanan M.',
    phone: '+91 9443123456',
    email: 'saravanan.m@yahoo.com',
    service: 'Tool Rentals',
    budget: '₹10,000 / week',
    message: 'Need 2 diesel concrete mixers and 3 needle vibrators delivered to our commercial site in Coimbatore on Monday morning.',
    date: '2026-08-15',
    status: 'Replied'
  },
  {
    id: 'msg-103',
    name: 'Lakshmi Narayanan',
    phone: '+91 9841237890',
    email: 'lakshmi.n@outlook.com',
    service: 'Renovation',
    budget: '₹5 - 8 Lakhs',
    message: 'Need structural remodeling for 30-year-old ancestral house including water-proofing and tile replacement.',
    date: '2026-08-14',
    status: 'Converted'
  }
];

export const Admin = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Collections state
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('cp_my_bookings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const ids = new Set(parsed.map(b => b.bookingId));
          const rest = defaultAdminBookings.filter(b => !ids.has(b.bookingId));
          return [...parsed, ...rest];
        }
      }
    } catch {}
    return defaultAdminBookings;
  });

  const [tools, setTools] = useState(() => {
    try {
      const cached = sessionStorage.getItem('mm_cached_products');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return initialToolsData;
  });

  const [services, setServices] = useState(servicesData);
  const [projects, setProjects] = useState(() => {
    try {
      const cached = localStorage.getItem('mm_cached_projects');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return projectsData;
  });
  const [customers, setCustomers] = useState(defaultAdminCustomers);
  const [messages, setMessages] = useState(defaultAdminMessages);

  // Project Category Options
  const projectCategories = [
    'Turnkey Build',
    'Structural RCC',
    'Heritage Masonry',
    'Renovation',
    'Eco-Friendly',
    'Commercial',
    'Residential',
    'Turnkey Luxury'
  ];

  // Settings State
  const [settings, setSettings] = useState({
    businessName: 'SRM AKASH CONSTRUCTION',
    brandName: 'Mason Mate',
    supportPhone: '+91 9159687408',
    supportEmail: 'contact@masonmate.in',
    primaryLocation: 'Salem & Coimbatore, Tamil Nadu',
    advancePercent: 20,
    workingHours: '8:00 AM – 7:30 PM (Mon–Sat)',
    currency: 'INR (₹)'
  });

  // Filters & Search
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilter, setBookingFilter] = useState('all');
  const [toolSearch, setToolSearch] = useState('');
  const [toolCategoryFilter, setToolCategoryFilter] = useState('all');
  const [toolViewMode, setToolViewMode] = useState('grid'); // 'grid' or 'table'
  const [projectSearch, setProjectSearch] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('all');
  const [customerSearch, setCustomerSearch] = useState('');
  const [messageFilter, setMessageFilter] = useState('all');

  // Modals state
  const [inspectedBooking, setInspectedBooking] = useState(null);
  const [showAddToolModal, setShowAddToolModal] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null); // { type: 'tool'|'booking'|'message'|'project', id: string, name: string }

  // New Tool Form State
  const [newToolData, setNewToolData] = useState({
    name: '',
    category: 'power-tools',
    price: '',
    icon: '🔨',
    image: '',
    desc: '',
    specs: '',
    availabilityStatus: 'Available'
  });

  // New Project Form State
  const [newProjectData, setNewProjectData] = useState({
    title: '',
    category: 'Turnkey Build',
    location: '',
    area: '2,400 sq.ft',
    specs: '3,200 Sq.Ft | 8 Months Build Time',
    description: '',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    client: 'Private Owner',
    status: 'Completed'
  });

  // Helper for Project Category Badge Class
  const getCategoryBadgeClass = (category = '') => {
    const cat = category.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (cat.includes('residential') || cat.includes('turnkey')) return 'badge-turnkey-build';
    if (cat.includes('structural') || cat.includes('rcc') || cat.includes('infrastructure')) return 'badge-structural-rcc';
    if (cat.includes('heritage') || cat.includes('masonry')) return 'badge-heritage-masonry';
    if (cat.includes('renovation') || cat.includes('remodeling')) return 'badge-renovation';
    if (cat.includes('eco') || cat.includes('green')) return 'badge-eco-friendly';
    if (cat.includes('commercial')) return 'badge-commercial';
    return 'badge-default';
  };

  // Sync projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mm_cached_projects', JSON.stringify(projects));
    } catch {}
  }, [projects]);

  // Sync with API where possible
  useEffect(() => {
    const syncServer = async () => {
      try {
        const [bRes, pRes] = await Promise.allSettled([
          fetch('/api/bookings'),
          fetch('/api/products')
        ]);
        if (bRes.status === 'fulfilled' && bRes.value.ok) {
          const data = await bRes.value.json();
          if (Array.isArray(data) && data.length > 0) setBookings(data);
        }
        if (pRes.status === 'fulfilled' && pRes.value.ok) {
          const data = await pRes.value.json();
          if (Array.isArray(data) && data.length > 0) {
            setTools(data.map(item => ({
              ...item,
              _id: item._id || item.id || `tool_${Date.now()}`,
              availabilityStatus: item.availabilityStatus || (item.available !== false ? 'Available' : 'Rented')
            })));
          }
        }
      } catch (e) {
        console.warn('Server sync notice:', e);
      }
    };
    syncServer();
  }, []);

  // Save tools to session cache on changes
  useEffect(() => {
    try {
      sessionStorage.setItem('mm_cached_products', JSON.stringify(tools));
    } catch {}
  }, [tools]);

  // Statistics
  const totalBookingsCount = bookings.length;
  const pendingBookingsCount = bookings.filter(b => (b.status || '').toLowerCase() === 'pending').length;
  const totalToolsCount = tools.length;
  const availableToolsCount = tools.filter(t => t.availabilityStatus === 'Available' || t.available === true).length;
  const inUseToolsCount = tools.filter(t => t.availabilityStatus === 'In Use' || t.availabilityStatus === 'Rented').length;
  const maintenanceToolsCount = tools.filter(t => t.availabilityStatus === 'Maintenance').length;
  const totalClientsCount = customers.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const newMessagesCount = messages.filter(m => m.status === 'New').length;

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const search = bookingSearch.toLowerCase().trim();
      const matchesSearch = !search ||
        (b.bookingId && b.bookingId.toLowerCase().includes(search)) ||
        (b.customerName && b.customerName.toLowerCase().includes(search)) ||
        (b.phone && b.phone.toLowerCase().includes(search)) ||
        (b.service && b.service.toLowerCase().includes(search));
      const matchesStatus = bookingFilter === 'all' || (b.status || 'Pending').toLowerCase() === bookingFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [bookings, bookingSearch, bookingFilter]);

  // Filtered Tools
  const filteredTools = useMemo(() => {
    return tools.filter(t => {
      const search = toolSearch.toLowerCase().trim();
      const matchesSearch = !search ||
        t.name.toLowerCase().includes(search) ||
        (t.desc && t.desc.toLowerCase().includes(search)) ||
        (t._id && t._id.toLowerCase().includes(search));
      const matchesCategory = toolCategoryFilter === 'all' || t.category === toolCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [tools, toolSearch, toolCategoryFilter]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const search = projectSearch.toLowerCase().trim();
      const matchesSearch = !search ||
        (p.title && p.title.toLowerCase().includes(search)) ||
        (p.location && p.location.toLowerCase().includes(search)) ||
        (p.description && p.description.toLowerCase().includes(search)) ||
        (p.specs && p.specs.toLowerCase().includes(search));
      const matchesCategory = projectCategoryFilter === 'all' || p.category === projectCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [projects, projectSearch, projectCategoryFilter]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const search = customerSearch.toLowerCase().trim();
      return !search ||
        c.name.toLowerCase().includes(search) ||
        c.phone.toLowerCase().includes(search) ||
        (c.email && c.email.toLowerCase().includes(search));
    });
  }, [customers, customerSearch]);

  // Status Change Handler
  const handleBookingStatusChange = async (bookingId, newStatus) => {
    const updated = bookings.map(b => (b.bookingId === bookingId ? { ...b, status: newStatus } : b));
    setBookings(updated);
    if (inspectedBooking && inspectedBooking.bookingId === bookingId) {
      setInspectedBooking({ ...inspectedBooking, status: newStatus });
    }
    showToast(`Booking ${bookingId} marked as ${newStatus}`, 'success');

    try {
      localStorage.setItem('cp_my_bookings', JSON.stringify(updated));
      await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch {}
  };

  // Add Tool Handler
  const handleAddToolSubmit = async (e) => {
    e.preventDefault();
    if (!newToolData.name.trim() || !newToolData.price) {
      showToast('Please provide tool name and rental price.', 'error');
      return;
    }

    const created = {
      _id: 'tool_' + Date.now(),
      id: 'tool_' + Date.now(),
      name: newToolData.name.trim(),
      category: newToolData.category,
      price: parseInt(newToolData.price, 10),
      period: 'Per Day',
      icon: newToolData.icon || '🔨',
      image: newToolData.image || '',
      desc: newToolData.desc || 'Professional-grade equipment calibrated for civil masonry & construction.',
      specs: newToolData.specs || 'Certified standard equipment',
      availabilityStatus: newToolData.availabilityStatus,
      available: newToolData.availabilityStatus === 'Available'
    };

    const updatedTools = [created, ...tools];
    setTools(updatedTools);
    setShowAddToolModal(false);
    setNewToolData({
      name: '',
      category: 'power-tools',
      price: '',
      icon: '🔨',
      image: '',
      desc: '',
      specs: '',
      availabilityStatus: 'Available'
    });

    showToast(`Added "${created.name}" to Equipment Catalog!`, 'success');

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(created)
      });
    } catch {}
  };

  // Edit Tool Handler
  const handleEditToolSubmit = (e) => {
    e.preventDefault();
    if (!editingTool) return;

    const updated = tools.map(t => (t._id === editingTool._id || t.id === editingTool.id ? {
      ...editingTool,
      price: parseInt(editingTool.price, 10),
      available: editingTool.availabilityStatus === 'Available'
    } : t));

    setTools(updated);
    setEditingTool(null);
    showToast(`Updated "${editingTool.name}" details.`, 'success');
  };

  // Add Project Handler
  const handleAddProjectSubmit = (e) => {
    e.preventDefault();
    if (!newProjectData.title.trim() || !newProjectData.location.trim()) {
      showToast('Please provide project title and location.', 'error');
      return;
    }

    const created = {
      id: 'proj-' + Date.now(),
      title: newProjectData.title.trim(),
      category: newProjectData.category,
      tag: newProjectData.category,
      specs: newProjectData.specs || `${newProjectData.area || '2,400 Sq.Ft'} | 6 Months Build`,
      area: newProjectData.area || '2,400 sq.ft',
      description: newProjectData.description || 'Premium turnkey residential engineering with earthquake-resistant RCC framing.',
      location: newProjectData.location.trim(),
      image: newProjectData.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      client: newProjectData.client || 'Private Owner',
      status: newProjectData.status || 'Completed'
    };

    const updated = [created, ...projects];
    setProjects(updated);
    setShowAddProjectModal(false);
    setNewProjectData({
      title: '',
      category: 'Turnkey Build',
      location: '',
      area: '2,400 sq.ft',
      specs: '3,200 Sq.Ft | 8 Months Build Time',
      description: '',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      client: 'Private Owner',
      status: 'Completed'
    });

    showToast(`Added project "${created.title}"!`, 'success');
  };

  // Edit Project Handler
  const handleEditProjectSubmit = (e) => {
    e.preventDefault();
    if (!editingProject) return;

    const updated = projects.map(p => (p.id === editingProject.id ? {
      ...editingProject,
      tag: editingProject.category
    } : p));

    setProjects(updated);
    setEditingProject(null);
    showToast(`Updated "${editingProject.title}" details.`, 'success');
  };

  // Delete Item Confirmed
  const handleConfirmDelete = () => {
    if (!deletingItem) return;

    if (deletingItem.type === 'tool') {
      const updated = tools.filter(t => t._id !== deletingItem.id && t.id !== deletingItem.id);
      setTools(updated);
      showToast(`Removed "${deletingItem.name}" from inventory.`, 'success');
    } else if (deletingItem.type === 'project') {
      const updated = projects.filter(p => p.id !== deletingItem.id);
      setProjects(updated);
      showToast(`Removed project "${deletingItem.name}".`, 'success');
    } else if (deletingItem.type === 'booking') {
      const updated = bookings.filter(b => b.bookingId !== deletingItem.id);
      setBookings(updated);
      showToast(`Deleted booking record ${deletingItem.id}.`, 'success');
    } else if (deletingItem.type === 'message') {
      const updated = messages.filter(m => m.id !== deletingItem.id);
      setMessages(updated);
      showToast(`Inquiry removed.`, 'success');
    }

    setDeletingItem(null);
  };

  // Tool availability quick toggle
  const handleToggleToolAvailability = (toolId, newStatus) => {
    const updated = tools.map(t => (t._id === toolId || t.id === toolId ? {
      ...t,
      availabilityStatus: newStatus,
      available: newStatus === 'Available'
    } : t));
    setTools(updated);
    showToast(`Equipment status updated to ${newStatus}`, 'info');
  };

  // CSV Export
  const handleExportCSV = () => {
    if (bookings.length === 0) {
      showToast('No bookings available to export.', 'error');
      return;
    }
    const headers = ['Booking ID', 'Customer Name', 'Phone', 'Email', 'Service', 'Start Date', 'Workers', 'Payment Mode', 'Amount (INR)', 'Status', 'Location'];
    const rows = bookings.map(b => [
      `"${b.bookingId || ''}"`,
      `"${b.customerName || ''}"`,
      `"${b.phone || ''}"`,
      `"${b.email || ''}"`,
      `"${b.service || ''}"`,
      `"${b.startDate || ''}"`,
      b.workers || 1,
      `"${b.paymentMode || ''}"`,
      b.amount || 0,
      `"${b.status || ''}"`,
      `"${b.location || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mason_mate_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Bookings successfully exported to CSV! 📥', 'success');
  };

  // WhatsApp helper
  const openWhatsApp = (phoneNum, msg) => {
    const cleanPhone = (phoneNum || '919159687408').replace(/[^0-9]/g, '');
    const target = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const text = encodeURIComponent(msg || 'Hello, this is Mason Mate support regarding your construction service.');
    window.open(`https://wa.me/${target}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="admin-layout" id="adminLayout">
      {/* Mobile Drawer Overlay */}
      <div
        className={`mobile-sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ─────────────────────────────────────────────────────────────
          1. PROFESSIONAL ADMIN SIDEBAR
          Structure matching exact specifications:
          MASON MATE
          Dashboard, Bookings, Tools, Services, Projects, Customers, Messages, Settings
          Logout
      ───────────────────────────────────────────────────────────── */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} id="adminSidebar">
        {/* Brand Header */}
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand">
            <div className="brand-icon-box">🏗️</div>
            <div className="brand-info">
              <div className="brand-title">MASON <span>MATE</span></div>
              <div className="brand-subtitle">Console Dashboard</div>
            </div>
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <div className="sidebar-nav">
          <div>
            <div className="nav-section-title">Navigation Menu</div>
            <ul className="nav-list">
              {[
                { id: 'overview', icon: '📊', label: 'Dashboard' },
                { id: 'bookings', icon: '📅', label: 'Bookings', badge: pendingBookingsCount },
                { id: 'tools', icon: '🔨', label: 'Tools', badge: tools.length },
                { id: 'services', icon: '🏗️', label: 'Services' },
                { id: 'projects', icon: '📁', label: 'Projects' },
                { id: 'customers', icon: '👥', label: 'Customers', badge: customers.length },
                { id: 'messages', icon: '💬', label: 'Messages', badge: newMessagesCount },
                { id: 'settings', icon: '⚙️', label: 'Settings' }
              ].map(item => (
                <li key={item.id}>
                  <button
                    id={`nav-tab-${item.id}`}
                    className={`nav-item-btn ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="admin-profile-compact">
            <div className="admin-avatar">
              {(currentUser?.username || 'A')[0].toUpperCase()}
            </div>
            <div className="admin-profile-info">
              <div className="admin-profile-name">{currentUser?.username || 'Administrator'}</div>
              <div className="admin-profile-role">Chief Engineer</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            <Link
              to="/"
              className="table-mini-btn"
              title="Return to live website"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none' }}
            >
              🏠
            </Link>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="table-mini-btn btn-delete"
              title="Sign Out"
              style={{ border: 'none', background: 'rgba(239, 68, 68, 0.2)', color: '#FCA5A5' }}
            >
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CONTENT WRAPPER WITH TOPBAR & TABS
      ───────────────────────────────────────────────────────────── */}
      <div className="admin-main-wrapper">
        {/* Top Navbar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              className="mobile-sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation drawer"
            >
              ☰
            </button>
            <div className="topbar-page-header">
              <h1 className="topbar-title">
                {activeTab === 'overview' && '📊 Executive Dashboard'}
                {activeTab === 'bookings' && '📅 Site Service Bookings'}
                {activeTab === 'tools' && '🔨 Tools Management'}
                {activeTab === 'services' && '🏗️ Construction Services'}
                {activeTab === 'projects' && '📁 Portfolio Projects'}
                {activeTab === 'customers' && '👥 Client Registry'}
                {activeTab === 'messages' && '💬 Inquiries & Quote Requests'}
                {activeTab === 'settings' && '⚙️ Platform & Business Settings'}
              </h1>
              <p className="topbar-subtitle">
                {activeTab === 'overview' && 'Live operations overview for SRM AKASH CONSTRUCTION.'}
                {activeTab === 'bookings' && 'Track client requests, assign master masons, and manage work schedules.'}
                {activeTab === 'tools' && 'Manage construction tools available for rental.'}
                {activeTab === 'services' && 'Manage service offerings, turnkey packages, and labor crews.'}
                {activeTab === 'projects' && 'Showcase completed villas, commercial structures, and restorations.'}
                {activeTab === 'customers' && 'View registered property owners, builders, and contact records.'}
                {activeTab === 'messages' && 'Respond to consultation and quotation submissions.'}
                {activeTab === 'settings' && 'Configure regional contact details and advance booking policies.'}
              </p>
            </div>
          </div>

          <div className="topbar-right">
            <button
              className="notif-bell-btn"
              title={`${pendingBookingsCount} pending action items`}
              onClick={() => setActiveTab('bookings')}
            >
              🔔
              {pendingBookingsCount > 0 && <span className="notif-dot" />}
            </button>

            <Link
              to="/"
              className="topbar-action-btn btn-secondary-admin"
              style={{ textDecoration: 'none' }}
            >
              <span>🌐</span> Live Site
            </Link>
          </div>
        </header>

        {/* ── TAB CONTENT CONTAINERS ── */}
        <div className="admin-view-content">

          {/* ─────────────────────────────────────────────────────────
              TAB 1: OVERVIEW / DASHBOARD
          ───────────────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="admin-page-panel active" id="panel-overview">
              {/* 4 Professional Dashboard Metric Cards */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="stat-card-top">
                    <span className="stat-card-title">Total Bookings</span>
                    <div className="stat-card-icon-pill amber">📅</div>
                  </div>
                  <div className="stat-card-val">{totalBookingsCount}</div>
                  <div className="stat-card-footer">
                    <span className="stat-badge-trend up">+{pendingBookingsCount} Pending</span>
                    <span className="stat-footer-label">active sites</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-top">
                    <span className="stat-card-title">Tools Inventory</span>
                    <div className="stat-card-icon-pill emerald">🔨</div>
                  </div>
                  <div className="stat-card-val">{totalToolsCount}</div>
                  <div className="stat-card-footer">
                    <span className="stat-badge-trend up">{availableToolsCount} Available</span>
                    <span className="stat-footer-label">in yard</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-top">
                    <span className="stat-card-title">Registered Clients</span>
                    <div className="stat-card-icon-pill blue">👥</div>
                  </div>
                  <div className="stat-card-val">{totalClientsCount}</div>
                  <div className="stat-card-footer">
                    <span className="stat-badge-trend neutral">Tamil Nadu</span>
                    <span className="stat-footer-label">Salem &amp; CBE</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-top">
                    <span className="stat-card-title">Est. Revenue</span>
                    <div className="stat-card-icon-pill slate">💰</div>
                  </div>
                  <div className="stat-card-val">₹{totalRevenue.toLocaleString('en-IN')}</div>
                  <div className="stat-card-footer">
                    <span className="stat-badge-trend up">100% Tracked</span>
                    <span className="stat-footer-label">advance &amp; billed</span>
                  </div>
                </div>
              </div>

              {/* Weekly Trend Bar Chart & Quick Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div className="admin-card">
                  <div className="admin-card-header">
                    <div className="card-header-titles">
                      <h3 className="card-title-text">📈 Monthly Activity &amp; Construction Inquiries</h3>
                      <p className="card-subtitle-text">Booking volume across Salem, Coimbatore &amp; Erode zones</p>
                    </div>
                    <span className="stat-badge-trend up">August 2026 Peak</span>
                  </div>
                  <div className="adm-chart-wrap">
                    {[
                      { month: 'Mar', val: 12, height: '40%' },
                      { month: 'Apr', val: 18, height: '55%' },
                      { month: 'May', val: 24, height: '70%' },
                      { month: 'Jun', val: 20, height: '60%' },
                      { month: 'Jul', val: 28, height: '82%' },
                      { month: 'Aug', val: 34, height: '95%' }
                    ].map(b => (
                      <div key={b.month} className="adm-chart-col">
                        <span className="adm-chart-bar-val">{b.val}</span>
                        <div className="adm-chart-bar" style={{ height: b.height }} />
                        <span className="adm-chart-bar-lbl">{b.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions Card */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <div className="card-header-titles">
                      <h3 className="card-title-text">⚡ Quick Actions</h3>
                      <p className="card-subtitle-text">Frequent console workflows</p>
                    </div>
                  </div>
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                      className="topbar-action-btn btn-accent-admin"
                      style={{ justifyContent: 'center', width: '100%' }}
                      onClick={() => { setActiveTab('tools'); setShowAddToolModal(true); }}
                    >
                      ➕ Add Equipment to Catalog
                    </button>
                    <button
                      className="topbar-action-btn btn-secondary-admin"
                      style={{ justifyContent: 'center', width: '100%' }}
                      onClick={() => setActiveTab('bookings')}
                    >
                      📅 Manage {pendingBookingsCount} Pending Bookings
                    </button>
                    <button
                      className="topbar-action-btn btn-secondary-admin"
                      style={{ justifyContent: 'center', width: '100%' }}
                      onClick={() => setActiveTab('messages')}
                    >
                      💬 Review {newMessagesCount} New Inquiries
                    </button>
                    <button
                      className="topbar-action-btn btn-secondary-admin"
                      style={{ justifyContent: 'center', width: '100%' }}
                      onClick={handleExportCSV}
                    >
                      📥 Download Bookings Report (CSV)
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Bookings Table */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <div className="card-header-titles">
                    <h3 className="card-title-text">Recent Construction Service Requests</h3>
                    <p className="card-subtitle-text">Latest site inquiries and scheduled work</p>
                  </div>
                  <button
                    className="topbar-action-btn btn-secondary-admin"
                    onClick={() => setActiveTab('bookings')}
                  >
                    View All Bookings →
                  </button>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Customer</th>
                        <th>Service</th>
                        <th>Scheduled Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 5).map(b => (
                        <tr key={b.bookingId}>
                          <td><strong>{b.bookingId}</strong></td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{b.customerName}</div>
                            <div style={{ fontSize: '12px', color: 'var(--adm-text-muted)' }}>{b.phone}</div>
                          </td>
                          <td>{b.service}</td>
                          <td>{b.startDate}</td>
                          <td>
                            <strong>₹{(Number(b.amount) || 0).toLocaleString('en-IN')}</strong>
                          </td>
                          <td>
                            <span className={`status-pill status-${(b.status || 'Pending').toLowerCase().replace(/\s+/g, '-')}`}>
                              {b.status || 'Pending'}
                            </span>
                          </td>
                          <td>
                            <div className="table-action-btns">
                              <button
                                className="table-mini-btn btn-edit"
                                onClick={() => setInspectedBooking(b)}
                              >
                                👁️ Inspect
                              </button>
                              <button
                                className="table-mini-btn"
                                onClick={() => openWhatsApp(b.phone, `Hello ${b.customerName}, Mason Mate checking in on your booking ${b.bookingId}.`)}
                                title="Chat on WhatsApp"
                              >
                                💬 WhatsApp
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              TAB 2: BOOKINGS MANAGEMENT
          ───────────────────────────────────────────────────────── */}
          {activeTab === 'bookings' && (
            <div className="admin-page-panel active" id="panel-bookings">
              <div className="admin-card">
                {/* Search & Filter Toolbar */}
                <div className="admin-card-header">
                  <div className="card-header-titles">
                    <h3 className="card-title-text">All Service &amp; Labor Bookings</h3>
                    <p className="card-subtitle-text">Total {filteredBookings.length} records matching current criteria</p>
                  </div>

                  <div className="card-header-actions">
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="🔍 Search by ID, client, phone, service..."
                      style={{ width: '280px' }}
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                    />
                    <select
                      className="admin-select"
                      value={bookingFilter}
                      onChange={(e) => setBookingFilter(e.target.value)}
                    >
                      <option value="all">Status: All Bookings</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button className="topbar-action-btn btn-secondary-admin" onClick={handleExportCSV}>
                      📥 Export CSV
                    </button>
                  </div>
                </div>

                {/* Table Content */}
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Booking Ref</th>
                        <th>Client Info</th>
                        <th>Service Requested</th>
                        <th>Start Date</th>
                        <th>Crew</th>
                        <th>Amount &amp; Mode</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={8}>
                            <div className="adm-empty-state">
                              <div className="adm-empty-icon">📂</div>
                              <div className="adm-empty-title">No Bookings Found</div>
                              <div className="adm-empty-desc">No bookings matched your filter or search query.</div>
                              <button
                                className="topbar-action-btn btn-secondary-admin"
                                onClick={() => { setBookingSearch(''); setBookingFilter('all'); }}
                              >
                                Reset Search Filters
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map(b => (
                          <tr key={b.bookingId}>
                            <td>
                              <strong style={{ color: 'var(--adm-primary)' }}>{b.bookingId}</strong>
                              {b.location && (
                                <div style={{ fontSize: '11.5px', color: 'var(--adm-text-muted)' }}>📍 {b.location}</div>
                              )}
                            </td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{b.customerName}</div>
                              <div style={{ fontSize: '12px' }}>
                                <a href={`tel:${b.phone}`} style={{ color: 'var(--adm-accent)', textDecoration: 'none' }}>
                                  📞 {b.phone}
                                </a>
                              </div>
                            </td>
                            <td>
                              <strong>{b.service}</strong>
                            </td>
                            <td>{b.startDate}</td>
                            <td>{b.workers || 1} Masons</td>
                            <td>
                              <div><strong>₹{(Number(b.amount) || 0).toLocaleString('en-IN')}</strong></div>
                              <div style={{ fontSize: '11px', color: 'var(--adm-text-muted)' }}>{b.paymentMode || 'UPI'}</div>
                            </td>
                            <td>
                              <select
                                className="admin-select"
                                style={{ height: '32px', fontSize: '12px', padding: '0 8px' }}
                                value={b.status || 'Pending'}
                                onChange={(e) => handleBookingStatusChange(b.bookingId, e.target.value)}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td>
                              <div className="table-action-btns">
                                <button
                                  className="table-mini-btn btn-edit"
                                  onClick={() => setInspectedBooking(b)}
                                  title="View full booking dossier"
                                >
                                  👁️ Inspect
                                </button>
                                <button
                                  className="table-mini-btn"
                                  onClick={() => openWhatsApp(b.phone, `Hello ${b.customerName}, Mason Mate following up on booking ${b.bookingId}.`)}
                                  title="Chat via WhatsApp"
                                >
                                  💬
                                </button>
                                <button
                                  className="table-mini-btn btn-delete"
                                  onClick={() => setDeletingItem({ type: 'booking', id: b.bookingId, name: b.bookingId })}
                                  title="Delete record"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              TAB 3: TOOLS MANAGEMENT (INVENTORY SECTION)
              Header matching:
              Tools Management
              Manage construction tools available for rental.
                                       + Add Tool
          ───────────────────────────────────────────────────────── */}
          {activeTab === 'tools' && (
            <div className="admin-page-panel active" id="panel-tools">
              {/* Header Box */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h2 className="admin-h2" style={{ margin: 0 }}>Tools Management</h2>
                  <p className="admin-subtext" style={{ margin: '4px 0 0 0' }}>Manage construction tools available for rental.</p>
                </div>
                <button
                  id="btn-add-tool-admin"
                  className="topbar-action-btn btn-accent-admin"
                  onClick={() => setShowAddToolModal(true)}
                >
                  <span>➕</span> Add Tool
                </button>
              </div>

              {/* Status Overview Bar */}
              <div className="tools-overview-bar">
                <div className="tool-metric-box">
                  <div className="tmb-icon">🔨</div>
                  <div>
                    <div className="tmb-value">{totalToolsCount}</div>
                    <div className="tmb-label">Total in Catalog</div>
                  </div>
                </div>
                <div className="tool-metric-box">
                  <div className="tmb-icon" style={{ background: 'var(--adm-success-bg)', color: '#047857' }}>✓</div>
                  <div>
                    <div className="tmb-value" style={{ color: '#047857' }}>{availableToolsCount}</div>
                    <div className="tmb-label">Available for Rent</div>
                  </div>
                </div>
                <div className="tool-metric-box">
                  <div className="tmb-icon" style={{ background: 'var(--adm-warning-bg)', color: '#B45309' }}>⚡</div>
                  <div>
                    <div className="tmb-value" style={{ color: '#B45309' }}>{inUseToolsCount}</div>
                    <div className="tmb-label">Active On-Site</div>
                  </div>
                </div>
                <div className="tool-metric-box">
                  <div className="tmb-icon" style={{ background: 'var(--adm-danger-bg)', color: '#B91C1C' }}>🔧</div>
                  <div>
                    <div className="tmb-value" style={{ color: '#B91C1C' }}>{maintenanceToolsCount}</div>
                    <div className="tmb-label">In Maintenance</div>
                  </div>
                </div>
              </div>

              {/* Tools Inventory Filter Bar */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <div className="card-header-titles">
                    <h3 className="card-title-text">Equipment Inventory ({filteredTools.length})</h3>
                    <p className="card-subtitle-text">Calibrated machinery and specialized mason tooling</p>
                  </div>

                  <div className="card-header-actions">
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="🔍 Search tool name, model, specs..."
                      style={{ width: '260px' }}
                      value={toolSearch}
                      onChange={(e) => setToolSearch(e.target.value)}
                    />
                    <select
                      className="admin-select"
                      value={toolCategoryFilter}
                      onChange={(e) => setToolCategoryFilter(e.target.value)}
                    >
                      <option value="all">Category: All Categories</option>
                      {toolCategories.map(c => (
                        <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                      ))}
                    </select>
                    <div className="admin-view-toggle">
                      <button
                        className={`view-toggle-btn ${toolViewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setToolViewMode('grid')}
                        title="Grid Card View"
                      >
                        ▦ Cards
                      </button>
                      <button
                        className={`view-toggle-btn ${toolViewMode === 'table' ? 'active' : ''}`}
                        onClick={() => setToolViewMode('table')}
                        title="Table List View"
                      >
                        ☰ Table
                      </button>
                    </div>
                  </div>
                </div>

                {filteredTools.length === 0 ? (
                  <div className="adm-empty-state">
                    <div className="adm-empty-icon">🔨</div>
                    <div className="adm-empty-title">No Equipment Found</div>
                    <div className="adm-empty-desc">No tools matched your search or category filter.</div>
                    <button
                      className="topbar-action-btn btn-secondary-admin"
                      onClick={() => { setToolSearch(''); setToolCategoryFilter('all'); }}
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : toolViewMode === 'grid' ? (
                  /* ── GRID CARD VIEW ── */
                  <div className="admin-tools-grid">
                    {filteredTools.map(tool => {
                      const avail = tool.availabilityStatus || (tool.available ? 'Available' : 'Rented');
                      const availClass = avail === 'Available' ? 'available' : avail === 'Maintenance' ? 'maintenance' : 'in-use';
                      return (
                        <div key={tool._id || tool.id} className="adm-tool-card">
                          <div className="adm-tool-media">
                            {tool.image ? (
                              <img src={tool.image} alt={tool.name} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            ) : (
                              <div className="adm-tool-fallback-icon">{tool.icon || '🔨'}</div>
                            )}
                            <span className="adm-tool-badge-pill">{tool.category || 'tool'}</span>
                            <span className={`adm-tool-status-pill ${availClass}`}>
                              <span className="adm-status-dot" />
                              {avail}
                            </span>
                          </div>

                          <div className="adm-tool-content">
                            <div>
                              <div className="adm-tool-meta-row">
                                <span className="adm-tool-category">{tool.category}</span>
                                <span className="adm-tool-id-tag">{tool._id || tool.id}</span>
                              </div>
                              <h4 className="adm-tool-title">{tool.name}</h4>
                              <p className="adm-tool-desc">{tool.desc || 'Heavy-duty construction equipment calibrated for civil engineering sites.'}</p>
                            </div>

                            <div>
                              <div className="adm-tool-price-strip">
                                <div>
                                  <span className="adm-tool-rate">₹{(Number(tool.price) || 0).toLocaleString('en-IN')}</span>
                                  <span className="adm-tool-period"> / day</span>
                                </div>
                                <span className="adm-tool-dispatch-lbl">⚡ Quick Dispatch</span>
                              </div>

                              <div className="adm-tool-actions-row">
                                <button
                                  className="topbar-action-btn btn-secondary-admin"
                                  onClick={() => setEditingTool(tool)}
                                >
                                  ✏️ Edit
                                </button>
                                <select
                                  className="admin-select"
                                  style={{ height: '34px', fontSize: '11.5px', padding: '0 6px', flex: 1.2 }}
                                  value={avail}
                                  onChange={(e) => handleToggleToolAvailability(tool._id || tool.id, e.target.value)}
                                >
                                  <option value="Available">Available</option>
                                  <option value="In Use">In Use</option>
                                  <option value="Maintenance">Maintenance</option>
                                </select>
                                <button
                                  className="topbar-action-btn btn-danger-admin"
                                  style={{ padding: '0 10px', height: '34px' }}
                                  onClick={() => setDeletingItem({ type: 'tool', id: tool._id || tool.id, name: tool.name })}
                                  title="Delete tool"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* ── TABLE VIEW ── */
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Tool Details</th>
                          <th>Category</th>
                          <th>Daily Rate</th>
                          <th>Availability Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTools.map(tool => {
                          const avail = tool.availabilityStatus || (tool.available ? 'Available' : 'Rented');
                          const availClass = avail === 'Available' ? 'available' : avail === 'Maintenance' ? 'maintenance' : 'in-use';
                          return (
                            <tr key={tool._id || tool.id}>
                              <td>
                                <div className="table-tool-cell">
                                  <div className="table-tool-thumb">
                                    {tool.image ? (
                                      <img src={tool.image} alt={tool.name} />
                                    ) : (
                                      tool.icon || '🔨'
                                    )}
                                  </div>
                                  <div>
                                    <strong style={{ color: 'var(--adm-primary)' }}>{tool.name}</strong>
                                    <div style={{ fontSize: '12px', color: 'var(--adm-text-muted)' }}>ID: {tool._id || tool.id}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span style={{ textTransform: 'uppercase', fontSize: '11.5px', fontWeight: 700, color: 'var(--adm-accent)' }}>
                                  {tool.category}
                                </span>
                              </td>
                              <td>
                                <strong style={{ fontSize: '14px', color: 'var(--adm-primary)' }}>
                                  ₹{(Number(tool.price) || 0).toLocaleString('en-IN')}
                                </strong>
                                <span style={{ fontSize: '11px', color: 'var(--adm-text-muted)' }}> / day</span>
                              </td>
                              <td>
                                <span className={`status-pill status-${availClass}`}>
                                  <span className="adm-status-dot" style={{ background: avail === 'Available' ? '#10B981' : avail === 'Maintenance' ? '#EF4444' : '#F59E0B' }} />
                                  {avail}
                                </span>
                              </td>
                              <td>
                                <div className="table-action-btns">
                                  <button
                                    className="table-mini-btn btn-edit"
                                    onClick={() => setEditingTool(tool)}
                                  >
                                    ✏️ Edit
                                  </button>
                                  <button
                                    className="table-mini-btn btn-delete"
                                    onClick={() => setDeletingItem({ type: 'tool', id: tool._id || tool.id, name: tool.name })}
                                  >
                                    🗑️ Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              TAB 4: SERVICES MANAGEMENT
          ───────────────────────────────────────────────────────── */}
          {activeTab === 'services' && (
            <div className="admin-page-panel active" id="panel-services">
              <div className="admin-card">
                <div className="admin-card-header">
                  <div className="card-header-titles">
                    <h3 className="card-title-text">Construction Services &amp; Packages ({services.length})</h3>
                    <p className="card-subtitle-text">Master mason allocations, turnkey square-footage pricing, and engineering deliverables</p>
                  </div>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Service Title</th>
                        <th>Category / Scope</th>
                        <th>Pricing Model</th>
                        <th>Standard Crew</th>
                        <th>Key Deliverables</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map(s => (
                        <tr key={s.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '24px' }}>{s.icon || '🏗️'}</span>
                              <div>
                                <strong>{s.title}</strong>
                                <div style={{ fontSize: '12px', color: 'var(--adm-text-muted)' }}>{s.subtitle}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="adm-tool-badge-pill" style={{ position: 'static' }}>{s.category || 'Civil'}</span>
                          </td>
                          <td>
                            <strong>{s.price || 'Milestone Based'}</strong>
                          </td>
                          <td>{s.workersIncluded || '2–6 Specialists'}</td>
                          <td>
                            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'var(--adm-text-muted)' }}>
                              {(s.features || []).slice(0, 2).map((f, i) => (
                                <li key={i}>{f}</li>
                              ))}
                            </ul>
                          </td>
                          <td>
                            <span className="status-pill status-available">Active</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              TAB 5: PROJECTS MANAGEMENT (PORTFOLIO)
          ───────────────────────────────────────────────────────── */}
          {activeTab === 'projects' && (
            <div className="admin-page-panel active" id="panel-projects">
              <div className="admin-card">
                <div className="admin-card-header">
                  <div className="card-header-titles">
                    <h3 className="card-title-text">PROJECTS ({filteredProjects.length})</h3>
                    <p className="card-subtitle-text">Manage your Mason Mate projects, architectural villas, and landmark builds.</p>
                  </div>

                  <div className="card-header-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="🔍 Search project name, location..."
                      style={{ width: '220px' }}
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                    />
                    <select
                      className="admin-select"
                      value={projectCategoryFilter}
                      onChange={(e) => setProjectCategoryFilter(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      {projectCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <button
                      className="topbar-action-btn btn-accent-admin"
                      onClick={() => setShowAddProjectModal(true)}
                    >
                      <span>➕</span> Add Project
                    </button>
                  </div>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Project Image</th>
                        <th>Project Name</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Built-Up Area</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--adm-text-muted)' }}>
                            No projects found matching your criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredProjects.map(p => (
                          <tr key={p.id}>
                            <td>
                              <div style={{ width: '54px', height: '40px', borderRadius: '6px', overflow: 'hidden', background: '#E2E8F0', flexShrink: 0 }}>
                                <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong style={{ color: 'var(--adm-primary)', fontSize: '13.5px' }}>{p.title}</strong>
                                <div style={{ fontSize: '12px', color: 'var(--adm-text-muted)', marginTop: '2px', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {p.description}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`category-badge ${getCategoryBadgeClass(p.category)}`}>
                                {p.category}
                              </span>
                            </td>
                            <td>📍 {p.location}</td>
                            <td><strong>{p.area || p.specs?.split('|')[0] || '2,400 sq.ft'}</strong></td>
                            <td>
                              <span className="status-pill status-completed">
                                {p.status || 'Completed'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                <button
                                  className="table-mini-btn"
                                  title="Edit Project"
                                  onClick={() => setEditingProject({ ...p })}
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  className="table-mini-btn btn-delete"
                                  title="Delete Project"
                                  onClick={() => setDeletingItem({ type: 'project', id: p.id, name: p.title })}
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              TAB 6: CUSTOMERS REGISTRY
          ───────────────────────────────────────────────────────── */}
          {activeTab === 'customers' && (
            <div className="admin-page-panel active" id="panel-customers">
              <div className="admin-card">
                <div className="admin-card-header">
                  <div className="card-header-titles">
                    <h3 className="card-title-text">Registered Clients &amp; Property Owners ({filteredCustomers.length})</h3>
                    <p className="card-subtitle-text">Contact details, booking history, and active project locations</p>
                  </div>

                  <div className="card-header-actions">
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="🔍 Search client name, phone, email..."
                      style={{ width: '280px' }}
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Client Name</th>
                        <th>Phone Number</th>
                        <th>Email Address</th>
                        <th>City / Region</th>
                        <th>Member Since</th>
                        <th>Total Orders</th>
                        <th>Direct Contact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((c, i) => (
                        <tr key={c.id || i}>
                          <td>
                            <div className="table-user-cell">
                              <div className="table-avatar-circle">
                                {(c.name || 'C')[0].toUpperCase()}
                              </div>
                              <strong>{c.name}</strong>
                            </div>
                          </td>
                          <td>
                            <a href={`tel:${c.phone}`} style={{ color: 'var(--adm-accent)', textDecoration: 'none', fontWeight: 600 }}>
                              📞 {c.phone}
                            </a>
                          </td>
                          <td>{c.email || '—'}</td>
                          <td>📍 {c.location || 'Salem'}</td>
                          <td>{c.joinedDate || '2026-08-01'}</td>
                          <td><strong>{c.totalBookings || 1}</strong></td>
                          <td>
                            <button
                              className="table-mini-btn"
                              onClick={() => openWhatsApp(c.phone, `Hello ${c.name}, this is Mason Mate civil support.`)}
                            >
                              💬 WhatsApp
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              TAB 7: MESSAGES / QUOTE INQUIRIES
          ───────────────────────────────────────────────────────── */}
          {activeTab === 'messages' && (
            <div className="admin-page-panel active" id="panel-messages">
              <div className="admin-card">
                <div className="admin-card-header">
                  <div className="card-header-titles">
                    <h3 className="card-title-text">Client Inquiries &amp; Quotation Requests</h3>
                    <p className="card-subtitle-text">Direct submissions from the Get a Quote &amp; Contact forms</p>
                  </div>

                  <div className="card-header-actions">
                    <select
                      className="admin-select"
                      value={messageFilter}
                      onChange={(e) => setMessageFilter(e.target.value)}
                    >
                      <option value="all">Status: All Inquiries</option>
                      <option value="New">New</option>
                      <option value="Replied">Replied</option>
                      <option value="Converted">Converted</option>
                    </select>
                  </div>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Sender Name</th>
                        <th>Contact</th>
                        <th>Service &amp; Budget</th>
                        <th>Inquiry Details</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messages
                        .filter(m => messageFilter === 'all' || m.status === messageFilter)
                        .map(m => (
                          <tr key={m.id}>
                            <td><strong>{m.name}</strong></td>
                            <td>
                              <div><a href={`tel:${m.phone}`} style={{ color: 'var(--adm-accent)' }}>{m.phone}</a></div>
                              <div style={{ fontSize: '11.5px', color: 'var(--adm-text-muted)' }}>{m.email}</div>
                            </td>
                            <td>
                              <div><strong>{m.service}</strong></div>
                              <div style={{ fontSize: '12px', color: 'var(--adm-accent)' }}>Budget: {m.budget}</div>
                            </td>
                            <td style={{ maxWidth: '280px' }}>
                              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--adm-text-secondary)', lineHeight: 1.4 }}>
                                "{m.message}"
                              </p>
                            </td>
                            <td>{m.date}</td>
                            <td>
                              <span className={`status-pill status-${m.status === 'New' ? 'pending' : m.status === 'Replied' ? 'in-progress' : 'completed'}`}>
                                {m.status}
                              </span>
                            </td>
                            <td>
                              <div className="table-action-btns">
                                <button
                                  className="table-mini-btn"
                                  onClick={() => openWhatsApp(m.phone, `Hello ${m.name}, thank you for reaching out to Mason Mate regarding ${m.service}. We have reviewed your project requirements.`)}
                                >
                                  💬 Reply
                                </button>
                                <button
                                  className="table-mini-btn btn-delete"
                                  onClick={() => setDeletingItem({ type: 'message', id: m.id, name: `Inquiry from ${m.name}` })}
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────
              TAB 8: PLATFORM & BUSINESS SETTINGS
          ───────────────────────────────────────────────────────── */}
          {activeTab === 'settings' && (
            <div className="admin-page-panel active" id="panel-settings">
              <div className="admin-card" style={{ maxWidth: '800px' }}>
                <div className="admin-card-header">
                  <div className="card-header-titles">
                    <h3 className="card-title-text">Business &amp; Platform Configuration</h3>
                    <p className="card-subtitle-text">Company credentials, support hotlines, and regional billing settings</p>
                  </div>
                </div>

                <div style={{ padding: '24px' }}>
                  <form onSubmit={(e) => { e.preventDefault(); showToast('Settings successfully updated & saved!', 'success'); }}>
                    <div className="adm-form-row-2">
                      <div className="adm-form-group">
                        <label className="adm-form-label">Parent Company Legal Entity</label>
                        <input
                          type="text"
                          className="adm-form-control"
                          value={settings.businessName}
                          onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="adm-form-group">
                        <label className="adm-form-label">Platform Brand Name</label>
                        <input
                          type="text"
                          className="adm-form-control"
                          value={settings.brandName}
                          onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="adm-form-row-2">
                      <div className="adm-form-group">
                        <label className="adm-form-label">Primary Engineer Hotline</label>
                        <input
                          type="text"
                          className="adm-form-control"
                          value={settings.supportPhone}
                          onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                          required
                        />
                      </div>
                      <div className="adm-form-group">
                        <label className="adm-form-label">Official Support Email</label>
                        <input
                          type="email"
                          className="adm-form-control"
                          value={settings.supportEmail}
                          onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="adm-form-row-2">
                      <div className="adm-form-group">
                        <label className="adm-form-label">Service Operational Zones</label>
                        <input
                          type="text"
                          className="adm-form-control"
                          value={settings.primaryLocation}
                          onChange={(e) => setSettings({ ...settings, primaryLocation: e.target.value })}
                        />
                      </div>
                      <div className="adm-form-group">
                        <label className="adm-form-label">Required Advance Booking %</label>
                        <input
                          type="number"
                          className="adm-form-control"
                          value={settings.advancePercent}
                          onChange={(e) => setSettings({ ...settings, advancePercent: parseInt(e.target.value, 10) })}
                        />
                      </div>
                    </div>

                    <div className="adm-form-group">
                      <label className="adm-form-label">Site Operations Working Hours</label>
                      <input
                        type="text"
                        className="adm-form-control"
                        value={settings.workingHours}
                        onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                      <button type="submit" className="topbar-action-btn btn-accent-admin">
                        💾 Save Platform Settings
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. PROFESSIONAL MODALS
      ───────────────────────────────────────────────────────────── */}

      {/* ── MODAL 1: ADD TOOL TO CATALOG ── */}
      {showAddToolModal && (
        <div className="admin-modal-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) setShowAddToolModal(false); }}>
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h3 className="modal-header-text">➕ Add Equipment to Catalog</h3>
              <button className="modal-close-btn" onClick={() => setShowAddToolModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddToolSubmit}>
              <div className="admin-modal-body">
                <div className="adm-form-group">
                  <label className="adm-form-label">Equipment Name <span className="req">*</span></label>
                  <input
                    type="text"
                    className="adm-form-control"
                    placeholder="e.g. Heavy-Duty Demolition Jackhammer 1500W"
                    value={newToolData.name}
                    onChange={(e) => setNewToolData({ ...newToolData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="adm-form-row-2">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Category <span className="req">*</span></label>
                    <select
                      className="adm-form-control"
                      value={newToolData.category}
                      onChange={(e) => setNewToolData({ ...newToolData, category: e.target.value })}
                    >
                      {toolCategories.map(c => (
                        <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Daily Rental Rate (₹) <span className="req">*</span></label>
                    <input
                      type="number"
                      className="adm-form-control"
                      placeholder="e.g. 650"
                      value={newToolData.price}
                      onChange={(e) => setNewToolData({ ...newToolData, price: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="adm-form-row-2">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Initial Availability</label>
                    <select
                      className="adm-form-control"
                      value={newToolData.availabilityStatus}
                      onChange={(e) => setNewToolData({ ...newToolData, availabilityStatus: e.target.value })}
                    >
                      <option value="Available">Available for Hire</option>
                      <option value="In Use">In Use On-Site</option>
                      <option value="Maintenance">Under Maintenance</option>
                    </select>
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Icon Emoji</label>
                    <input
                      type="text"
                      className="adm-form-control"
                      placeholder="🔨"
                      value={newToolData.icon}
                      onChange={(e) => setNewToolData({ ...newToolData, icon: e.target.value })}
                    />
                  </div>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Image URL (Optional)</label>
                  <input
                    type="url"
                    className="adm-form-control"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newToolData.image}
                    onChange={(e) => setNewToolData({ ...newToolData, image: e.target.value })}
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Specifications &amp; Capacity</label>
                  <input
                    type="text"
                    className="adm-form-control"
                    placeholder="e.g. 230V / 50Hz, 45 Joules impact energy, SDS-Max chuck"
                    value={newToolData.specs}
                    onChange={(e) => setNewToolData({ ...newToolData, specs: e.target.value })}
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Description</label>
                  <textarea
                    className="adm-form-control"
                    placeholder="Provide a clear description of suitable masonry and construction applications..."
                    value={newToolData.desc}
                    onChange={(e) => setNewToolData({ ...newToolData, desc: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="topbar-action-btn btn-secondary-admin"
                  onClick={() => setShowAddToolModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="topbar-action-btn btn-accent-admin"
                >
                  💾 Save &amp; Publish Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: EDIT TOOL ── */}
      {editingTool && (
        <div className="admin-modal-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) setEditingTool(null); }}>
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h3 className="modal-header-text">✏️ Edit Equipment: {editingTool.name}</h3>
              <button className="modal-close-btn" onClick={() => setEditingTool(null)}>✕</button>
            </div>

            <form onSubmit={handleEditToolSubmit}>
              <div className="admin-modal-body">
                <div className="adm-form-group">
                  <label className="adm-form-label">Equipment Name</label>
                  <input
                    type="text"
                    className="adm-form-control"
                    value={editingTool.name}
                    onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                    required
                  />
                </div>

                <div className="adm-form-row-2">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Category</label>
                    <select
                      className="adm-form-control"
                      value={editingTool.category}
                      onChange={(e) => setEditingTool({ ...editingTool, category: e.target.value })}
                    >
                      {toolCategories.map(c => (
                        <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Daily Rental Rate (₹)</label>
                    <input
                      type="number"
                      className="adm-form-control"
                      value={editingTool.price}
                      onChange={(e) => setEditingTool({ ...editingTool, price: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="adm-form-row-2">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Availability Status</label>
                    <select
                      className="adm-form-control"
                      value={editingTool.availabilityStatus || (editingTool.available ? 'Available' : 'Rented')}
                      onChange={(e) => setEditingTool({ ...editingTool, availabilityStatus: e.target.value })}
                    >
                      <option value="Available">Available for Hire</option>
                      <option value="In Use">In Use On-Site</option>
                      <option value="Maintenance">Under Maintenance</option>
                    </select>
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Icon Emoji</label>
                    <input
                      type="text"
                      className="adm-form-control"
                      value={editingTool.icon || '🔨'}
                      onChange={(e) => setEditingTool({ ...editingTool, icon: e.target.value })}
                    />
                  </div>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Image URL</label>
                  <input
                    type="url"
                    className="adm-form-control"
                    value={editingTool.image || ''}
                    onChange={(e) => setEditingTool({ ...editingTool, image: e.target.value })}
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Specifications</label>
                  <input
                    type="text"
                    className="adm-form-control"
                    value={editingTool.specs || ''}
                    onChange={(e) => setEditingTool({ ...editingTool, specs: e.target.value })}
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Description</label>
                  <textarea
                    className="adm-form-control"
                    value={editingTool.desc || ''}
                    onChange={(e) => setEditingTool({ ...editingTool, desc: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="topbar-action-btn btn-secondary-admin"
                  onClick={() => setEditingTool(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="topbar-action-btn btn-accent-admin"
                >
                  💾 Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 3: INSPECT BOOKING DOSSIER ── */}
      {inspectedBooking && (
        <div className="admin-modal-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) setInspectedBooking(null); }}>
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <div>
                <span className="adm-tool-category" style={{ display: 'block', marginBottom: '2px' }}>SITE DOSSIER</span>
                <h3 className="modal-header-text">{inspectedBooking.bookingId}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setInspectedBooking(null)}>✕</button>
            </div>

            <div className="admin-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: 'var(--adm-bg)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11.5px', color: 'var(--adm-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Client Name</div>
                  <strong style={{ color: 'var(--adm-primary)', fontSize: '14px' }}>{inspectedBooking.customerName}</strong>
                </div>
                <div style={{ background: 'var(--adm-bg)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11.5px', color: 'var(--adm-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Contact Phone</div>
                  <a href={`tel:${inspectedBooking.phone}`} style={{ color: 'var(--adm-accent)', fontWeight: 700, textDecoration: 'none' }}>
                    📞 {inspectedBooking.phone}
                  </a>
                </div>
                <div style={{ background: 'var(--adm-bg)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11.5px', color: 'var(--adm-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Service</div>
                  <strong style={{ color: 'var(--adm-accent)' }}>{inspectedBooking.service}</strong>
                </div>
                <div style={{ background: 'var(--adm-bg)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11.5px', color: 'var(--adm-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Scheduled Date</div>
                  <div>📅 {inspectedBooking.startDate}</div>
                </div>
                <div style={{ background: 'var(--adm-bg)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11.5px', color: 'var(--adm-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Crew Deployment</div>
                  <div>👷 {inspectedBooking.workers || 1} Master Mason(s)</div>
                </div>
                <div style={{ background: 'var(--adm-bg)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11.5px', color: 'var(--adm-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Advance / Total</div>
                  <strong style={{ color: 'var(--adm-primary)', fontSize: '15px' }}>
                    ₹{(Number(inspectedBooking.amount) || 0).toLocaleString('en-IN')} ({inspectedBooking.paymentMode || 'UPI'})
                  </strong>
                </div>
              </div>

              {inspectedBooking.notes && (
                <div style={{ background: 'var(--adm-bg)', padding: '12px 14px', borderRadius: '8px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '11.5px', color: 'var(--adm-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Site Specifications &amp; Notes</div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--adm-text-main)' }}>{inspectedBooking.notes}</p>
                </div>
              )}

              <div className="adm-form-group">
                <label className="adm-form-label">Update Booking Status</label>
                <select
                  className="adm-form-control"
                  value={inspectedBooking.status || 'Pending'}
                  onChange={(e) => handleBookingStatusChange(inspectedBooking.bookingId, e.target.value)}
                >
                  <option value="Pending">Pending Approval</option>
                  <option value="Confirmed">Confirmed &amp; Scheduled</option>
                  <option value="In Progress">Active On-Site</option>
                  <option value="Completed">Successfully Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                className="topbar-action-btn btn-secondary-admin"
                onClick={() => setInspectedBooking(null)}
              >
                Close
              </button>
              <button
                className="topbar-action-btn btn-accent-admin"
                onClick={() => openWhatsApp(inspectedBooking.phone, `Hello ${inspectedBooking.customerName}, this is Mason Mate confirming your construction booking ref ${inspectedBooking.bookingId}.`)}
              >
                💬 Contact via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: DELETE CONFIRMATION ── */}
      {deletingItem && (
        <div className="admin-modal-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) setDeletingItem(null); }}>
          <div className="admin-modal-box" style={{ maxWidth: '440px' }}>
            <div className="admin-modal-header">
              <h3 className="modal-header-text" style={{ color: 'var(--adm-danger)' }}>⚠️ Confirm Removal</h3>
              <button className="modal-close-btn" onClick={() => setDeletingItem(null)}>✕</button>
            </div>

            <div className="admin-modal-body">
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--adm-text-main)', lineHeight: 1.5 }}>
                Are you sure you want to permanently remove <strong>"{deletingItem.name}"</strong>?
              </p>
              <p style={{ marginTop: '8px', fontSize: '12.5px', color: 'var(--adm-text-muted)' }}>
                This action will take immediate effect across the active catalog and console.
              </p>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="topbar-action-btn btn-secondary-admin"
                onClick={() => setDeletingItem(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="topbar-action-btn btn-danger-admin"
                onClick={handleConfirmDelete}
              >
                🗑️ Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 5: ADD NEW PROJECT ── */}
      {showAddProjectModal && (
        <div className="admin-modal-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) setShowAddProjectModal(false); }}>
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <div>
                <span className="adm-tool-category" style={{ display: 'block', marginBottom: '2px' }}>PORTFOLIO SHOWCASE</span>
                <h3 className="modal-header-text">Add New Project</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowAddProjectModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddProjectSubmit}>
              <div className="admin-modal-body">
                <div className="adm-form-group">
                  <label className="adm-form-label">Project Name / Title *</label>
                  <input
                    type="text"
                    required
                    className="adm-form-control"
                    placeholder="e.g. Royal Emerald Villa, Fairlands"
                    value={newProjectData.title}
                    onChange={(e) => setNewProjectData({ ...newProjectData, title: e.target.value })}
                  />
                </div>

                <div className="adm-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Category *</label>
                    <select
                      className="adm-form-control"
                      value={newProjectData.category}
                      onChange={(e) => setNewProjectData({ ...newProjectData, category: e.target.value })}
                    >
                      {projectCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Location (City/District) *</label>
                    <input
                      type="text"
                      required
                      className="adm-form-control"
                      placeholder="e.g. Fairlands, Salem"
                      value={newProjectData.location}
                      onChange={(e) => setNewProjectData({ ...newProjectData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="adm-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Built-Up Area</label>
                    <input
                      type="text"
                      className="adm-form-control"
                      placeholder="e.g. 4,200 sq.ft"
                      value={newProjectData.area}
                      onChange={(e) => setNewProjectData({ ...newProjectData, area: e.target.value })}
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Client / Year</label>
                    <input
                      type="text"
                      className="adm-form-control"
                      placeholder="e.g. Dr. Rajesh Kumar (2026)"
                      value={newProjectData.client}
                      onChange={(e) => setNewProjectData({ ...newProjectData, client: e.target.value })}
                    />
                  </div>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Project Image URL</label>
                  <input
                    type="url"
                    className="adm-form-control"
                    placeholder="https://images.unsplash.com/..."
                    value={newProjectData.image}
                    onChange={(e) => setNewProjectData({ ...newProjectData, image: e.target.value })}
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Description &amp; Engineering Scope</label>
                  <textarea
                    rows={3}
                    className="adm-form-control"
                    placeholder="Turnkey residential build with customized RCC framing, Italian marble flooring, and modular elevation."
                    value={newProjectData.description}
                    onChange={(e) => setNewProjectData({ ...newProjectData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="topbar-action-btn btn-secondary-admin"
                  onClick={() => setShowAddProjectModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="topbar-action-btn btn-accent-admin"
                >
                  ➕ Add to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 6: EDIT PROJECT ── */}
      {editingProject && (
        <div className="admin-modal-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) setEditingProject(null); }}>
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <div>
                <span className="adm-tool-category" style={{ display: 'block', marginBottom: '2px' }}>PROJECT DOSSIER</span>
                <h3 className="modal-header-text">Edit Project</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setEditingProject(null)}>✕</button>
            </div>

            <form onSubmit={handleEditProjectSubmit}>
              <div className="admin-modal-body">
                <div className="adm-form-group">
                  <label className="adm-form-label">Project Name / Title *</label>
                  <input
                    type="text"
                    required
                    className="adm-form-control"
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  />
                </div>

                <div className="adm-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Category *</label>
                    <select
                      className="adm-form-control"
                      value={editingProject.category || 'Turnkey Build'}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    >
                      {projectCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Location *</label>
                    <input
                      type="text"
                      required
                      className="adm-form-control"
                      value={editingProject.location || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="adm-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Built-Up Area</label>
                    <input
                      type="text"
                      className="adm-form-control"
                      value={editingProject.area || editingProject.specs || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, area: e.target.value })}
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Project Status</label>
                    <select
                      className="adm-form-control"
                      value={editingProject.status || 'Completed'}
                      onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                    >
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress (Active On-Site)</option>
                      <option value="Planning">Planning &amp; Foundation</option>
                    </select>
                  </div>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Project Image URL</label>
                  <input
                    type="url"
                    className="adm-form-control"
                    value={editingProject.image || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Description &amp; Engineering Scope</label>
                  <textarea
                    rows={3}
                    className="adm-form-control"
                    value={editingProject.description || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="topbar-action-btn btn-secondary-admin"
                  onClick={() => setEditingProject(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="topbar-action-btn btn-accent-admin"
                >
                  💾 Save Project Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
