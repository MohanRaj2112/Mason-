import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  Building2,
  Truck,
  Calendar,
  Users,
  CreditCard,
  Settings as SettingsIcon,
  LogOut,
  Search,
  Plus,
  Check,
  X,
  AlertTriangle,
  Edit2,
  Eye,
  Download,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  Menu,
  ShieldCheck,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { initialToolsData, toolCategories } from '../data/tools';
import { servicesData } from '../data/services';
import { projectsData } from '../data/projects';

// Default mock datasets for initial hydration
const defaultAdminBookings = [
  {
    bookingId: 'MM-883921',
    transactionId: 'TXN-88392101',
    customerName: 'Santhosh Kumar',
    phone: '+91 9159687408',
    email: 'santhosh@example.com',
    service: 'Turnkey House Construction',
    bookingType: 'construction',
    startDate: '2026-08-20',
    durationDays: 90,
    workers: 4,
    paymentMode: 'UPI',
    paymentStatus: 'Paid',
    amount: 107940,
    status: 'Confirmed',
    location: 'Fairlands, Salem',
    notes: '2400 sq.ft residential villa foundation stage.'
  },
  {
    bookingId: 'MM-491024',
    transactionId: 'TXN-49102402',
    customerName: 'Priya Rajan',
    phone: '+91 9840123456',
    email: 'priya.r@gmail.com',
    service: 'Renovation & Remodeling',
    bookingType: 'construction',
    startDate: '2026-08-25',
    durationDays: 30,
    workers: 2,
    paymentMode: 'Card',
    paymentStatus: 'Paid',
    amount: 99875,
    status: 'Confirmed',
    location: 'RS Puram, Coimbatore',
    notes: 'Kitchen & living room structural remodeling.'
  },
  {
    bookingId: 'MM-310948',
    transactionId: 'TXN-31094803',
    customerName: 'Karthik Raja',
    phone: '+91 9443210987',
    email: 'karthik.raja@outlook.com',
    service: 'Tool & Equipment Rental',
    bookingType: 'tool_rental',
    toolName: 'Heavy-Duty Demolition Rotary Hammer',
    toolId: 'tool_rotary_hammer',
    quantity: 1,
    durationDays: 3,
    startDate: '2026-08-18',
    workers: 1,
    paymentMode: 'Cash on Delivery',
    paymentStatus: 'Pending',
    amount: 1350,
    status: 'In Progress',
    rentalStatus: 'Dispatched / Active',
    location: 'Suramangalam, Salem',
    notes: 'Rotary hammer drill for 3 days site work.'
  },
  {
    bookingId: 'MM-209412',
    transactionId: 'TXN-20941204',
    customerName: 'Anand Sundaram',
    phone: '+91 9789012345',
    email: 'anand.s@yahoo.com',
    service: 'Master Mason Hiring',
    bookingType: 'mason',
    startDate: '2026-08-15',
    durationDays: 3,
    workers: 3,
    paymentMode: 'Net Banking',
    paymentStatus: 'Paid',
    amount: 3600,
    status: 'Completed',
    location: 'Gandhipuram, Coimbatore',
    notes: 'Compound wall & brick partition masonry.'
  },
  {
    bookingId: 'MM-119283',
    transactionId: 'TXN-11928305',
    customerName: 'Murugan Builders',
    phone: '+91 9842112233',
    email: 'murugan.civil@gmail.com',
    service: 'Tool & Equipment Rental',
    bookingType: 'tool_rental',
    toolName: 'Diesel Concrete Mixer 10/7 CFT',
    toolId: 'tool_concrete_mixer',
    quantity: 2,
    durationDays: 7,
    startDate: '2026-08-22',
    paymentMode: 'UPI',
    paymentStatus: 'Paid',
    amount: 11200,
    status: 'Confirmed',
    rentalStatus: 'Pending Delivery',
    location: 'Saravanampatti, Coimbatore',
    notes: '2 diesel concrete mixers required with site operators.'
  }
];

const defaultAdminTransactions = [
  {
    transactionId: 'TXN-88392101',
    orderId: 'order_MM_883921',
    bookingId: 'MM-883921',
    customerName: 'Santhosh Kumar',
    phone: '+91 9159687408',
    service: 'Turnkey House Construction',
    amount: 107940,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    gatewayReference: 'UPI:santhosh@okicici',
    createdAt: '2026-08-18'
  },
  {
    transactionId: 'TXN-49102402',
    orderId: 'order_MM_491024',
    bookingId: 'MM-491024',
    customerName: 'Priya Rajan',
    phone: '+91 9840123456',
    service: 'Renovation & Remodeling',
    amount: 99875,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    gatewayReference: 'CARD:****4829',
    createdAt: '2026-08-19'
  },
  {
    transactionId: 'TXN-11928305',
    orderId: 'order_MM_119283',
    bookingId: 'MM-119283',
    customerName: 'Murugan Builders',
    phone: '+91 9842112233',
    service: 'Tool & Equipment Rental',
    amount: 11200,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    gatewayReference: 'UPI:murugan@axis',
    createdAt: '2026-08-22'
  },
  {
    transactionId: 'TXN-20941204',
    orderId: 'order_MM_209412',
    bookingId: 'MM-209412',
    customerName: 'Anand Sundaram',
    phone: '+91 9789012345',
    service: 'Master Mason Hiring',
    amount: 3600,
    paymentMethod: 'Net Banking',
    paymentStatus: 'Paid',
    gatewayReference: 'NETBANKING:SBI',
    createdAt: '2026-08-15'
  }
];

const defaultAdminCustomers = [
  { id: 'c1', name: 'Santhosh Kumar', phone: '+91 9159687408', email: 'santhosh@example.com', joinedDate: '2026-07-10', totalBookings: 2, location: 'Salem' },
  { id: 'c2', name: 'Priya Rajan', phone: '+91 9840123456', email: 'priya.r@gmail.com', joinedDate: '2026-07-22', totalBookings: 1, location: 'Coimbatore' },
  { id: 'c3', name: 'Karthik Raja', phone: '+91 9443210987', email: 'karthik.raja@outlook.com', joinedDate: '2026-08-01', totalBookings: 3, location: 'Salem' },
  { id: 'c4', name: 'Anand Sundaram', phone: '+91 9789012345', email: 'anand.s@yahoo.com', joinedDate: '2026-08-05', totalBookings: 1, location: 'Coimbatore' },
  { id: 'c5', name: 'Murugan Builders', phone: '+91 9842112233', email: 'murugan.civil@gmail.com', joinedDate: '2026-08-11', totalBookings: 2, location: 'Coimbatore' }
];

export const Admin = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Active navigation tab (Exact requested order: Dashboard, Services, Tools, Rentals, Bookings, Customers, Payments, Settings)
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
  const [customers, setCustomers] = useState(defaultAdminCustomers);
  const [transactions, setTransactions] = useState(defaultAdminTransactions);

  // Settings State
  const [settings, setSettings] = useState({
    businessName: 'SRM Akash Construction',
    brandName: 'MasonMate',
    founderName: 'S. SIVAJI',
    supportPhone: '+91 9159687408',
    supportEmail: 'contact@masonmate.in',
    primaryLocation: 'Salem & Coimbatore, Tamil Nadu',
    advancePercent: 20,
    workingHours: '8:00 AM – 7:30 PM (Mon–Sat)',
    currency: 'INR (₹)'
  });

  // Global & Tab Filters
  const [globalSearch, setGlobalSearch] = useState('');
  const [toolCategoryFilter, setToolCategoryFilter] = useState('all');
  const [toolViewMode, setToolViewMode] = useState('table'); // 'table' or 'grid'
  const [rentalFilter, setRentalFilter] = useState('all');
  const [bookingFilter, setBookingFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Modals state
  const [inspectedBooking, setInspectedBooking] = useState(null);
  const [showAddToolModal, setShowAddToolModal] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null); // { type: 'tool'|'service'|'booking', id: string, name: string, warning?: string }
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingTool, setIsSavingTool] = useState(false);

  // New Tool Form State
  const [newToolData, setNewToolData] = useState({
    name: '',
    category: 'power-tools',
    price: '',
    image: '',
    desc: '',
    specs: '',
    availabilityStatus: 'Available'
  });

  // New Service Form State
  const [newServiceData, setNewServiceData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'construction',
    priceRange: '₹1,500 – ₹2,500 / Sq.Ft',
    image: '',
    tag: 'Engineering Service'
  });

  // Sync with API on mount
  useEffect(() => {
    const syncServer = async () => {
      try {
        const token = localStorage.getItem('mm_token') || '';
        const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
        const [bRes, pRes, sRes, tRes] = await Promise.allSettled([
          fetch('/api/bookings'),
          fetch('/api/tools'),
          fetch('/api/services'),
          fetch('/api/transactions', { headers: authHeaders })
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
              _id: item._id || item.toolId || item.id || `tool_${Date.now()}`,
              id: item.toolId || item._id || item.id,
              availabilityStatus: item.availabilityStatus || (item.available !== false ? 'Available' : 'Rented')
            })));
          }
        }
        if (sRes.status === 'fulfilled' && sRes.value.ok) {
          const data = await sRes.value.json();
          if (Array.isArray(data) && data.length > 0) setServices(data);
        }
        if (tRes.status === 'fulfilled' && tRes.value.ok) {
          const data = await tRes.value.json();
          if (Array.isArray(data) && data.length > 0) setTransactions(data);
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

  // Statistics Computations
  const totalBookingsCount = bookings.length;
  const pendingBookingsCount = bookings.filter(b => (b.status || '').toLowerCase() === 'pending').length;
  const totalToolsCount = tools.length;
  const availableToolsCount = tools.filter(t => t.availabilityStatus === 'Available' || t.available === true).length;
  const inUseToolsCount = tools.filter(t => t.availabilityStatus === 'In Use' || t.availabilityStatus === 'Rented').length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  // Separated Rentals vs Site Construction Bookings
  const rentalRequests = useMemo(() => {
    return bookings.filter(b => 
      b.bookingType === 'tool_rental' ||
      b.bookingType === 'tools' ||
      (b.service && (b.service.toLowerCase().includes('rental') || b.service.toLowerCase().includes('tool') || b.service.toLowerCase().includes('equipment')))
    );
  }, [bookings]);

  const siteBookings = useMemo(() => {
    return bookings.filter(b => 
      b.bookingType !== 'tool_rental' &&
      b.bookingType !== 'tools' &&
      !(b.service && (b.service.toLowerCase().includes('rental') || b.service.toLowerCase().includes('tool') || b.service.toLowerCase().includes('equipment')))
    );
  }, [bookings]);

  // Filtered Tools
  const filteredTools = useMemo(() => {
    return tools.filter(t => {
      const search = globalSearch.toLowerCase().trim();
      const matchesSearch = !search ||
        t.name?.toLowerCase().includes(search) ||
        t.desc?.toLowerCase().includes(search) ||
        t.specs?.toLowerCase().includes(search);
      const matchesCategory = toolCategoryFilter === 'all' || t.category === toolCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [tools, globalSearch, toolCategoryFilter]);

  // Filtered Rentals
  const filteredRentals = useMemo(() => {
    return rentalRequests.filter(r => {
      const search = globalSearch.toLowerCase().trim();
      const matchesSearch = !search ||
        r.customerName?.toLowerCase().includes(search) ||
        r.bookingId?.toLowerCase().includes(search) ||
        r.phone?.toLowerCase().includes(search) ||
        r.toolName?.toLowerCase().includes(search);
      const matchesStatus = rentalFilter === 'all' || 
        (r.rentalStatus || r.status || '').toLowerCase().includes(rentalFilter.toLowerCase());
      return matchesSearch && matchesStatus;
    });
  }, [rentalRequests, globalSearch, rentalFilter]);

  // Filtered Site Bookings
  const filteredSiteBookings = useMemo(() => {
    return siteBookings.filter(b => {
      const search = globalSearch.toLowerCase().trim();
      const matchesSearch = !search ||
        b.bookingId?.toLowerCase().includes(search) ||
        b.customerName?.toLowerCase().includes(search) ||
        b.phone?.toLowerCase().includes(search) ||
        b.service?.toLowerCase().includes(search);
      const matchesStatus = bookingFilter === 'all' || 
        (b.status || 'Pending').toLowerCase() === bookingFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [siteBookings, globalSearch, bookingFilter]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const search = globalSearch.toLowerCase().trim();
      return !search ||
        c.name.toLowerCase().includes(search) ||
        c.phone.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search);
    });
  }, [customers, globalSearch]);

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return transactions.filter(t => {
      const search = globalSearch.toLowerCase().trim();
      const matchesSearch = !search ||
        t.transactionId?.toLowerCase().includes(search) ||
        t.customerName?.toLowerCase().includes(search) ||
        t.service?.toLowerCase().includes(search);
      const matchesStatus = paymentFilter === 'all' || 
        (t.paymentStatus || '').toLowerCase() === paymentFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [transactions, globalSearch, paymentFilter]);

  // Helper for authenticated API headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('mm_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'x-user-role': 'admin'
    };
  };

  // WhatsApp Helper
  const openWhatsApp = (phoneNum, msg) => {
    const clean = (phoneNum || '919159687408').replace(/[^0-9]/g, '');
    const target = clean.startsWith('91') ? clean : `91${clean}`;
    const text = encodeURIComponent(msg || 'Hello, this is SRM Akash Construction (MasonMate) admin team regarding your request.');
    window.open(`https://wa.me/${target}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  // Status Change Handler (Bookings & Rentals)
  const handleBookingStatusChange = async (bookingId, newStatus) => {
    const updated = bookings.map(b => b.bookingId === bookingId ? { ...b, status: newStatus } : b);
    setBookings(updated);
    if (inspectedBooking && inspectedBooking.bookingId === bookingId) {
      setInspectedBooking({ ...inspectedBooking, status: newStatus });
    }
    showToast(`Booking ${bookingId} marked as ${newStatus}`, 'success');

    try {
      localStorage.setItem('cp_my_bookings', JSON.stringify(updated));
      await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.warn('Booking status sync error:', e);
    }
  };

  // Rental Status Change Handler
  const handleRentalStatusChange = async (bookingId, newRentalStatus) => {
    const updated = bookings.map(b => b.bookingId === bookingId ? { ...b, rentalStatus: newRentalStatus } : b);
    setBookings(updated);
    showToast(`Rental ${bookingId} status updated to ${newRentalStatus}`, 'success');

    try {
      localStorage.setItem('cp_my_bookings', JSON.stringify(updated));
      await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rentalStatus: newRentalStatus })
      });
    } catch (e) {
      console.warn('Rental status sync error:', e);
    }
  };

  // Payment Status Change Handler
  const handlePaymentStatusChange = async (bookingId, newPayStatus) => {
    const updated = bookings.map(b => b.bookingId === bookingId ? { ...b, paymentStatus: newPayStatus } : b);
    setBookings(updated);
    setTransactions(prev => prev.map(t => t.bookingId === bookingId ? { ...t, paymentStatus: newPayStatus } : t));
    showToast(`Payment status for ${bookingId} updated to ${newPayStatus}`, 'success');

    try {
      localStorage.setItem('cp_my_bookings', JSON.stringify(updated));
      await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ paymentStatus: newPayStatus })
      });
    } catch (e) {
      console.warn('Payment status sync error:', e);
    }
  };

  // Add Tool Handler
  const handleAddToolSubmit = async (e) => {
    e.preventDefault();
    if (!newToolData.name.trim() || !newToolData.price) {
      showToast('Please provide both the tool name and daily rental rate.', 'error');
      return;
    }

    setIsSavingTool(true);
    const toolId = 'tool_' + Date.now();
    const created = {
      _id: toolId,
      id: toolId,
      toolId: toolId,
      name: newToolData.name.trim(),
      category: newToolData.category,
      price: parseInt(newToolData.price, 10),
      pricePerDay: parseInt(newToolData.price, 10),
      period: 'Per Day',
      image: newToolData.image || '',
      desc: newToolData.desc.trim() || 'Heavy-duty certified construction equipment calibrated for civil job site performance.',
      specs: newToolData.specs.trim() || 'Commercial Standard · Certified Quality',
      availabilityStatus: newToolData.availabilityStatus,
      available: newToolData.availabilityStatus === 'Available'
    };

    setTools(prev => [created, ...prev]);
    setShowAddToolModal(false);
    setNewToolData({
      name: '',
      category: 'power-tools',
      price: '',
      image: '',
      desc: '',
      specs: '',
      availabilityStatus: 'Available'
    });
    setIsSavingTool(false);
    showToast(`Added "${created.name}" to Equipment Catalog.`, 'success');

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(created)
      });
    } catch (err) {
      console.warn('Tool create API error:', err);
    }
  };

  // Edit Tool Handler (Preserves existing record without creating duplicates!)
  const handleEditToolSubmit = async (e) => {
    e.preventDefault();
    if (!editingTool) return;

    if (!editingTool.name?.trim() || !editingTool.price) {
      showToast('Tool name and rental rate are required.', 'error');
      return;
    }

    setIsSavingTool(true);
    const targetId = editingTool._id || editingTool.id || editingTool.toolId;
    const priceNum = parseInt(editingTool.price, 10);

    const updatedRecord = {
      ...editingTool,
      name: editingTool.name.trim(),
      price: priceNum,
      pricePerDay: priceNum,
      specs: editingTool.specs || '',
      desc: editingTool.desc || '',
      availabilityStatus: editingTool.availabilityStatus,
      available: editingTool.availabilityStatus === 'Available'
    };

    // Update state in-place without duplicating
    setTools(prev => prev.map(t => (t._id === targetId || t.id === targetId || t.toolId === targetId) ? updatedRecord : t));
    setEditingTool(null);
    setIsSavingTool(false);
    showToast(`Updated "${updatedRecord.name}" successfully.`, 'success');

    try {
      await fetch(`/api/products/${targetId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedRecord)
      });
    } catch (err) {
      console.warn('Tool update API error:', err);
    }
  };

  // Edit Service Handler
  const handleEditServiceSubmit = async (e) => {
    e.preventDefault();
    if (!editingService) return;

    const targetId = editingService.id || editingService._id || editingService.serviceId;
    const updatedRecord = {
      ...editingService,
      title: editingService.title.trim(),
      shortDescription: editingService.shortDescription?.trim(),
      description: editingService.description?.trim(),
      priceRange: editingService.priceRange || ''
    };

    setServices(prev => prev.map(s => (s.id === targetId || s._id === targetId || s.serviceId === targetId) ? updatedRecord : s));
    setEditingService(null);
    showToast(`Updated "${updatedRecord.title}" successfully.`, 'success');

    try {
      await fetch(`/api/services/${targetId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedRecord)
      });
    } catch (err) {
      console.warn('Service update API error:', err);
    }
  };

  // Add Service Handler
  const handleAddServiceSubmit = async (e) => {
    e.preventDefault();
    if (!newServiceData.title.trim()) {
      showToast('Please provide a service title.', 'error');
      return;
    }

    const sId = 'srv-' + Date.now();
    const created = {
      id: sId,
      serviceId: sId,
      number: String(services.length + 1).padStart(2, '0'),
      title: newServiceData.title.trim(),
      category: newServiceData.category,
      tag: newServiceData.tag || 'Civil Engineering',
      shortDescription: newServiceData.shortDescription.trim() || 'Certified structural engineering solutions for residential properties.',
      description: newServiceData.description.trim() || newServiceData.shortDescription.trim(),
      priceRange: newServiceData.priceRange || '₹1,500 – ₹2,500 / Sq.Ft',
      image: newServiceData.image || 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=800&q=80',
      link: '/booking',
      buttonText: 'View Details'
    };

    setServices(prev => [...prev, created]);
    setShowAddServiceModal(false);
    setNewServiceData({
      title: '',
      shortDescription: '',
      description: '',
      category: 'construction',
      priceRange: '₹1,500 – ₹2,500 / Sq.Ft',
      image: '',
      tag: 'Engineering Service'
    });
    showToast(`Added service "${created.title}".`, 'success');

    try {
      await fetch('/api/services', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(created)
      });
    } catch (err) {
      console.warn('Service create API error:', err);
    }
  };

  // Prompt Safe Delete Modal
  const requestDelete = (type, item) => {
    let warning = '';
    const id = item._id || item.id || item.toolId || item.serviceId || item.bookingId;
    const name = item.name || item.title || item.customerName || item.bookingId;

    if (type === 'tool') {
      const activeRentalsCount = rentalRequests.filter(r => 
        (r.toolId === id || r.toolName === name) && (r.status === 'Confirmed' || r.status === 'In Progress')
      ).length;
      if (activeRentalsCount > 0) {
        warning = `Notice: This tool currently has ${activeRentalsCount} active rental record(s). Removing it from catalog will preserve past invoices and booking records.`;
      }
    } else if (type === 'service') {
      const relatedCount = bookings.filter(b => b.service === name).length;
      if (relatedCount > 0) {
        warning = `Notice: ${relatedCount} customer booking(s) reference this service. Past records will remain safe in history.`;
      }
    }

    setDeletingItem({ type, id, name, warning, rawItem: item });
  };

  // Execute Confirmed Delete via Backend API
  const handleConfirmDelete = async () => {
    if (!deletingItem || isDeleting) return;
    setIsDeleting(true);

    const { type, id, name } = deletingItem;

    try {
      if (type === 'tool') {
        setTools(prev => prev.filter(t => (t._id || t.id || t.toolId) !== id));
        showToast(`Tool "${name}" deleted.`, 'success');
        await fetch(`/api/products/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      } else if (type === 'service') {
        setServices(prev => prev.filter(s => (s.id || s._id || s.serviceId) !== id));
        showToast(`Service "${name}" deleted.`, 'success');
        await fetch(`/api/services/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      } else if (type === 'booking') {
        setBookings(prev => prev.filter(b => b.bookingId !== id));
        showToast(`Booking ${name} removed.`, 'success');
        await fetch(`/api/bookings/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      }
    } catch (err) {
      showToast('Error deleting item from server.', 'error');
    } finally {
      setIsDeleting(false);
      setDeletingItem(null);
    }
  };

  // Export Bookings CSV
  const handleExportCSV = () => {
    if (bookings.length === 0) {
      showToast('No booking records to export.', 'error');
      return;
    }
    const headers = ['Booking ID', 'Customer Name', 'Phone', 'Email', 'Service', 'Booking Type', 'Start Date', 'Workers/Units', 'Payment Mode', 'Payment Status', 'Amount (INR)', 'Status', 'Location'];
    const rows = bookings.map(b => [
      `"${b.bookingId || ''}"`,
      `"${b.customerName || ''}"`,
      `"${b.phone || ''}"`,
      `"${b.email || ''}"`,
      `"${b.service || ''}"`,
      `"${b.bookingType || 'construction'}"`,
      `"${b.startDate || ''}"`,
      b.workers || b.quantity || 1,
      `"${b.paymentMode || ''}"`,
      `"${b.paymentStatus || 'Pending'}"`,
      b.amount || 0,
      `"${b.status || ''}"`,
      `"${b.location || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `srm_akash_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported booking records to CSV file.', 'success');
  };

  // Settings Save Handler
  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast('SRM Akash Construction settings saved successfully.', 'success');
  };

  return (
    <div className="admin-layout" id="adminLayout">
      {/* Mobile Drawer Overlay */}
      <div
        className={`mobile-sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ─────────────────────────────────────────────────────────────
          1. PROFESSIONAL DARK SIDEBAR (Exact requested order)
          Dashboard, Services, Tools, Rentals, Bookings, Customers, Payments, Settings, Logout
      ───────────────────────────────────────────────────────────── */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} id="adminSidebar">
        {/* Brand Header */}
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand">
            <div className="brand-icon-box">
              <Building2 size={20} color="#FFFFFF" />
            </div>
            <div className="brand-info">
              <div className="brand-title">MASON <span>MATE</span></div>
              <div className="brand-subtitle">SRM AKASH CONSTRUCTION</div>
            </div>
          </Link>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        {/* Sidebar Nav List (Exact order requested) */}
        <div className="sidebar-nav">
          <div>
            <div className="nav-section-title">Console Management</div>
            <ul className="nav-list">
              {[
                { id: 'overview', icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
                { id: 'services', icon: <Building2 size={17} />, label: 'Services', badge: services.length },
                { id: 'tools', icon: <Wrench size={17} />, label: 'Tools', badge: tools.length },
                { id: 'rentals', icon: <Truck size={17} />, label: 'Rentals', badge: rentalRequests.length },
                { id: 'bookings', icon: <Calendar size={17} />, label: 'Bookings', badge: pendingBookingsCount },
                { id: 'customers', icon: <Users size={17} />, label: 'Customers', badge: customers.length },
                { id: 'payments', icon: <CreditCard size={17} />, label: 'Payments', badge: transactions.length },
                { id: 'settings', icon: <SettingsIcon size={17} />, label: 'Settings' }
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

        {/* Sidebar Footer with Founder Profile & Logout */}
        <div className="sidebar-footer">
          <div className="admin-profile-compact">
            <div className="admin-avatar">SS</div>
            <div className="admin-profile-info">
              <div className="admin-profile-name">S. SIVAJI</div>
              <div className="admin-profile-role">Founder &amp; Owner</div>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={() => {
              if (window.confirm('Log out of administrator dashboard?')) {
                logout();
                navigate('/auth');
              }
            }}
            title="Log out"
          >
            <LogOut size={13} />
            <span>Exit</span>
          </button>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN WRAPPER & TOPBAR
      ───────────────────────────────────────────────────────────── */}
      <div className="admin-main-wrapper">
        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-sidebar-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            <div className="topbar-page-header">
              <h1 className="topbar-title">
                {activeTab === 'overview' && 'Console Dashboard'}
                {activeTab === 'services' && 'Construction Services'}
                {activeTab === 'tools' && 'Equipment & Tool Inventory'}
                {activeTab === 'rentals' && 'Tool & Machinery Rentals'}
                {activeTab === 'bookings' && 'Site Construction Bookings'}
                {activeTab === 'customers' && 'Client Directory'}
                {activeTab === 'payments' && 'Payment Ledger & Invoices'}
                {activeTab === 'settings' && 'Business Profile & Settings'}
              </h1>
              <p className="topbar-subtitle">
                {activeTab === 'overview' && 'Real-time overview of bookings, rentals, tools, and revenue.'}
                {activeTab === 'services' && 'Manage civil offerings, turnkey packages, and descriptions.'}
                {activeTab === 'tools' && 'Manage rental fleet catalog, rates, availability, and specs.'}
                {activeTab === 'rentals' && 'Track equipment dispatch, site deliveries, and returned machinery.'}
                {activeTab === 'bookings' && 'Review residential construction and master mason appointments.'}
                {activeTab === 'customers' && 'View verified customer records and project histories.'}
                {activeTab === 'payments' && 'Authoritative transaction logs and gateway status.'}
                {activeTab === 'settings' && 'Configure SRM Akash Construction business details.'}
              </p>
            </div>
          </div>

          <div className="topbar-right">
            {/* Search Input if supported */}
            <div className="topbar-search-box">
              <Search className="topbar-search-icon" size={14} />
              <input
                type="text"
                className="topbar-search-input"
                placeholder="Search..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
            </div>

            {/* Contextual Quick Actions */}
            {activeTab === 'tools' && (
              <button
                type="button"
                className="topbar-action-btn btn-primary-admin"
                onClick={() => setShowAddToolModal(true)}
              >
                <Plus size={15} />
                <span>Add Tool</span>
              </button>
            )}

            {activeTab === 'services' && (
              <button
                type="button"
                className="topbar-action-btn btn-primary-admin"
                onClick={() => setShowAddServiceModal(true)}
              >
                <Plus size={15} />
                <span>Add Service</span>
              </button>
            )}

            {activeTab === 'bookings' && (
              <button
                type="button"
                className="topbar-action-btn btn-secondary-admin"
                onClick={handleExportCSV}
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            )}

            <Link
              to="/"
              className="topbar-action-btn btn-secondary-admin"
              title="View Public Website"
            >
              <ExternalLink size={14} />
              <span className="hidden-mobile">View Site</span>
            </Link>
          </div>
        </header>

        {/* ─────────────────────────────────────────────────────────────
            3. MAIN CONTENT PANELS
        ───────────────────────────────────────────────────────────── */}
        <main className="admin-view-content">

          {/* ════ TAB 1: DASHBOARD OVERVIEW ════ */}
          {activeTab === 'overview' && (
            <div className="admin-page-panel active" id="panel-overview">
              {/* Stat Cards */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="stat-card-top">
                    <span className="stat-card-title">Total Bookings</span>
                    <div className="stat-card-icon-pill blue">
                      <Calendar size={17} />
                    </div>
                  </div>
                  <div className="stat-card-val tabular-nums">{totalBookingsCount}</div>
                  <div className="stat-card-footer">
                    <span className="stat-badge-trend up tabular-nums">{pendingBookingsCount} Pending</span>
                    <span className="stat-footer-label">Action required</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-top">
                    <span className="stat-card-title">Active Rentals</span>
                    <div className="stat-card-icon-pill amber">
                      <Truck size={17} />
                    </div>
                  </div>
                  <div className="stat-card-val tabular-nums">{rentalRequests.length}</div>
                  <div className="stat-card-footer">
                    <span className="stat-badge-trend neutral tabular-nums">{inUseToolsCount} units</span>
                    <span className="stat-footer-label">Deployed on-site</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-top">
                    <span className="stat-card-title">Tools in Inventory</span>
                    <div className="stat-card-icon-pill emerald">
                      <Wrench size={17} />
                    </div>
                  </div>
                  <div className="stat-card-val tabular-nums">{totalToolsCount}</div>
                  <div className="stat-card-footer">
                    <span className="stat-badge-trend up tabular-nums">{availableToolsCount} Available</span>
                    <span className="stat-footer-label">Ready for dispatch</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-top">
                    <span className="stat-card-title">Recorded Volume</span>
                    <div className="stat-card-icon-pill slate">
                      <CreditCard size={17} />
                    </div>
                  </div>
                  <div className="stat-card-val tabular-nums">₹{totalRevenue.toLocaleString('en-IN')}</div>
                  <div className="stat-card-footer">
                    <span className="stat-badge-trend up">Verified</span>
                    <span className="stat-footer-label">Across Salem &amp; Kovai</span>
                  </div>
                </div>
              </div>

              {/* Recent Bookings & Rentals Grid */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <div className="card-header-titles">
                    <h3 className="card-title-text">Recent Construction &amp; Rental Requests</h3>
                    <p className="card-subtitle-text">Latest requests submitted by residential clients across Tamil Nadu</p>
                  </div>
                  <div className="card-header-actions">
                    <button
                      type="button"
                      className="topbar-action-btn btn-secondary-admin"
                      onClick={() => setActiveTab('bookings')}
                    >
                      <span>View All Bookings</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Client</th>
                        <th>Service / Tool</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 5).map(b => (
                        <tr key={b.bookingId}>
                          <td>
                            <strong className="tabular-nums" style={{ color: '#F59E0B' }}>{b.bookingId}</strong>
                          </td>
                          <td>
                            <div>
                              <div style={{ fontWeight: 600 }}>{b.customerName}</div>
                              <div style={{ fontSize: '11.5px', color: 'var(--admin-muted)' }}>{b.phone}</div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div style={{ fontWeight: 600 }}>{b.toolName || b.service}</div>
                              <div style={{ fontSize: '11px', color: 'var(--admin-muted)' }}>{b.location}</div>
                            </div>
                          </td>
                          <td className="tabular-nums" style={{ fontSize: '12.5px' }}>
                            {b.startDate || 'Immediate'}
                          </td>
                          <td className="tabular-nums">
                            <strong>₹{Number(b.amount || 0).toLocaleString('en-IN')}</strong>
                          </td>
                          <td>
                            <span className={`status-pill status-${(b.status || 'pending').toLowerCase().replace(/\s+/g, '-')}`}>
                              {b.status || 'Pending'}
                            </span>
                          </td>
                          <td>
                            <div className="table-action-btns">
                              <button
                                type="button"
                                className="table-mini-btn"
                                onClick={() => setInspectedBooking(b)}
                                title="View details"
                              >
                                <Eye size={12} />
                                <span>Inspect</span>
                              </button>
                              <button
                                type="button"
                                className="table-mini-btn"
                                onClick={() => openWhatsApp(b.phone, `Hello ${b.customerName}, regarding your MasonMate request ${b.bookingId}...`)}
                                title="WhatsApp client"
                              >
                                <MessageSquare size={12} />
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

          {/* ════ TAB 2: SERVICES MANAGEMENT ════ */}
          {activeTab === 'services' && (
            <div className="admin-page-panel active" id="panel-services">
              <div className="admin-card">
                <div className="admin-card-header">
                  <div className="card-header-titles">
                    <h3 className="card-title-text">Service Offerings &amp; Turnkey Packages ({services.length})</h3>
                    <p className="card-subtitle-text">Manage the 6 core civil engineering &amp; master masonry services</p>
                  </div>
                  <div className="card-header-actions">
                    <button
                      type="button"
                      className="topbar-action-btn btn-primary-admin"
                      onClick={() => setShowAddServiceModal(true)}
                    >
                      <Plus size={14} />
                      <span>Add Service</span>
                    </button>
                  </div>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Service Title</th>
                        <th>Short Description (1 Sentence)</th>
                        <th>Rate / Price Range</th>
                        <th>Category</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((s, idx) => (
                        <tr key={s.id || s._id || idx}>
                          <td className="tabular-nums" style={{ color: 'var(--admin-muted)', fontWeight: 700 }}>
                            {String(idx + 1).padStart(2, '0')}
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {s.image && (
                                <img
                                  src={s.image}
                                  alt={s.title}
                                  style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }}
                                />
                              )}
                              <div>
                                <strong style={{ color: 'var(--admin-text)' }}>{s.title}</strong>
                                <div style={{ fontSize: '11px', color: 'var(--admin-muted)' }}>{s.tag || 'Civil Build'}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ maxWidth: '320px', fontSize: '13px', color: 'var(--admin-muted)', lineHeight: 1.45 }}>
                            {s.shortDescription || s.description}
                          </td>
                          <td className="tabular-nums" style={{ fontWeight: 600 }}>
                            {s.priceRange || 'Milestone BOQ'}
                          </td>
                          <td>
                            <span className="status-pill status-available">
                              {s.category || 'Construction'}
                            </span>
                          </td>
                          <td>
                            <div className="table-action-btns">
                              <button
                                type="button"
                                className="table-mini-btn btn-edit"
                                onClick={() => setEditingService(s)}
                              >
                                <Edit2 size={12} />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                className="btn-delete-clean"
                                onClick={() => requestDelete('service', s)}
                              >
                                Delete
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

          {/* ════ TAB 3: TOOLS MANAGEMENT ════ */}
          {activeTab === 'tools' && (
            <div className="admin-page-panel active" id="panel-tools">
              <div className="admin-card">
                <div className="admin-card-header">
                  <div className="card-header-titles">
                    <h3 className="card-title-text">Construction Tools &amp; Machinery Fleet ({filteredTools.length})</h3>
                    <p className="card-subtitle-text">Manage calibrated equipment, specifications, and daily rates</p>
                  </div>
                  <div className="card-header-actions">
                    <select
                      className="admin-select"
                      value={toolCategoryFilter}
                      onChange={(e) => setToolCategoryFilter(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      {toolCategories.filter(c => c.id !== 'all').map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>

                    <div className="admin-view-toggle">
                      <button
                        type="button"
                        className={`view-toggle-btn ${toolViewMode === 'table' ? 'active' : ''}`}
                        onClick={() => setToolViewMode('table')}
                      >
                        Table
                      </button>
                      <button
                        type="button"
                        className={`view-toggle-btn ${toolViewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setToolViewMode('grid')}
                      >
                        Cards
                      </button>
                    </div>

                    <button
                      type="button"
                      className="topbar-action-btn btn-primary-admin"
                      onClick={() => setShowAddToolModal(true)}
                    >
                      <Plus size={14} />
                      <span>Add Tool</span>
                    </button>
                  </div>
                </div>

                {toolViewMode === 'table' ? (
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Equipment</th>
                          <th>Category</th>
                          <th>Daily Rate</th>
                          <th>Specifications</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTools.map(t => (
                          <tr key={t._id || t.id}>
                            <td>
                              <div className="table-tool-cell">
                                <div className="table-tool-thumb">
                                  {t.image ? (
                                    <img src={t.image} alt={t.name} />
                                  ) : (
                                    <span>🔨</span>
                                  )}
                                </div>
                                <div>
                                  <strong style={{ color: 'var(--admin-text)' }}>{t.name}</strong>
                                  <div style={{ fontSize: '11px', color: 'var(--admin-muted)' }}>
                                    {t._id || t.id}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td style={{ textTransform: 'capitalize', color: 'var(--admin-muted)' }}>
                              {t.category?.replace('-', ' ')}
                            </td>
                            <td className="tabular-nums">
                              <strong>₹{t.price || t.pricePerDay || 500}</strong>
                              <span style={{ fontSize: '11px', color: 'var(--admin-muted)' }}> / Day</span>
                            </td>
                            <td style={{ fontSize: '12px', color: 'var(--admin-muted)', maxWidth: '240px' }}>
                              {t.specs || 'Standard heavy duty'}
                            </td>
                            <td>
                              <span className={`status-pill status-${(t.availabilityStatus || 'available').toLowerCase().replace(/\s+/g, '-')}`}>
                                {t.availabilityStatus || 'Available'}
                              </span>
                            </td>
                            <td>
                              <div className="table-action-btns">
                                <button
                                  type="button"
                                  className="table-mini-btn btn-edit"
                                  onClick={() => setEditingTool(t)}
                                >
                                  <Edit2 size={12} />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  className="btn-delete-clean"
                                  onClick={() => requestDelete('tool', t)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="admin-tools-grid">
                    {filteredTools.map(t => (
                      <div key={t._id || t.id} className="adm-tool-card">
                        <div className="adm-tool-media">
                          {t.image ? (
                            <img src={t.image} alt={t.name} />
                          ) : (
                            <span style={{ fontSize: '40px' }}>🔨</span>
                          )}
                          <div className={`adm-tool-status-pill ${(t.availabilityStatus || 'available').toLowerCase()}`}>
                            <span className="adm-status-dot" />
                            <span>{t.availabilityStatus || 'Available'}</span>
                          </div>
                        </div>

                        <div className="adm-tool-content">
                          <div className="adm-tool-meta-row">
                            <span className="adm-tool-category">{t.category}</span>
                            <span className="adm-tool-id-tag">{t._id?.slice(-6) || 'TOOL'}</span>
                          </div>

                          <h4 className="adm-tool-title">{t.name}</h4>
                          <p className="adm-tool-desc">{t.specs || t.desc}</p>

                          <div className="adm-tool-price-strip">
                            <div>
                              <span className="adm-tool-rate tabular-nums">₹{t.price || t.pricePerDay}</span>
                              <span className="adm-tool-period"> / Day</span>
                            </div>
                            <span style={{ fontSize: '11.5px', color: 'var(--admin-muted)' }}>Site Delivery</span>
                          </div>

                          <div className="adm-tool-actions-row">
                            <button
                              type="button"
                              className="topbar-action-btn btn-secondary-admin"
                              onClick={() => setEditingTool(t)}
                            >
                              <Edit2 size={12} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className="btn-delete-clean"
                              onClick={() => requestDelete('tool', t)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════ TAB 4: RENTALS MANAGEMENT ════ */}
          {activeTab === 'rentals' && (
            <div className="admin-page-panel active" id="panel-rentals">
              {/* Rentals KPI Summary */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="stat-card-top">
                    <span className="stat-card-title">Total Rental Requests</span>
                    <div className="stat-card-icon-pill amber">
                      <Truck size={17} />
                    </div>
                  </div>
                  <div className="stat-card-val tabular-nums">{rentalRequests.length}</div>
                  <div className="stat-card-footer">
                    <span className="stat-footer-label">Machinery &amp; tool contracts</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-top">
                    <span className="stat-card-title">Active Dispatched</span>
                    <div className="stat-card-icon-pill emerald">
                      <ShieldCheck size={17} />
                    </div>
                  </div>
                  <div className="stat-card-val tabular-nums">
                    {rentalRequests.filter(r => (r.rentalStatus || '').includes('Dispatched') || r.status === 'In Progress').length}
                  </div>
                  <div className="stat-card-footer">
                    <span className="stat-badge-trend up">On site now</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-top">
                    <span className="stat-card-title">Pending Delivery</span>
                    <div className="stat-card-icon-pill slate">
                      <Clock size={17} />
                    </div>
                  </div>
                  <div className="stat-card-val tabular-nums">
                    {rentalRequests.filter(r => (r.rentalStatus || '').includes('Pending') || r.status === 'Confirmed').length}
                  </div>
                  <div className="stat-card-footer">
                    <span className="stat-footer-label">Dispatch queue</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-card-top">
                    <span className="stat-card-title">Fleet Utilization</span>
                    <div className="stat-card-icon-pill blue">
                      <Wrench size={17} />
                    </div>
                  </div>
                  <div className="stat-card-val tabular-nums">
                    {Math.round((inUseToolsCount / Math.max(1, totalToolsCount)) * 100)}%
                  </div>
                  <div className="stat-card-footer">
                    <span className="stat-footer-label">{availableToolsCount} ready in yard</span>
                  </div>
                </div>
              </div>

              {/* Rental Contracts Table */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <div className="card-header-titles">
                    <h3 className="card-title-text">Tool &amp; Machinery Rental Orders</h3>
                    <p className="card-subtitle-text">Track equipment dispatched to job sites across Salem and Coimbatore</p>
                  </div>
                  <div className="card-header-actions">
                    <select
                      className="admin-select"
                      value={rentalFilter}
                      onChange={(e) => setRentalFilter(e.target.value)}
                    >
                      <option value="all">All Rental Statuses</option>
                      <option value="pending">Pending Delivery</option>
                      <option value="dispatched">Dispatched / Active</option>
                      <option value="completed">Completed / Returned</option>
                    </select>
                  </div>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Rental ID</th>
                        <th>Client &amp; Site</th>
                        <th>Equipment Rented</th>
                        <th>Duration / Units</th>
                        <th>Total Rent</th>
                        <th>Payment</th>
                        <th>Rental Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRentals.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--admin-muted)' }}>
                            No rental records found matching your filter.
                          </td>
                        </tr>
                      ) : (
                        filteredRentals.map(r => (
                          <tr key={r.bookingId}>
                            <td>
                              <strong className="tabular-nums" style={{ color: '#F59E0B' }}>{r.bookingId}</strong>
                            </td>
                            <td>
                              <div>
                                <div style={{ fontWeight: 600 }}>{r.customerName}</div>
                                <div style={{ fontSize: '11px', color: 'var(--admin-muted)' }}>
                                  <MapPin size={11} style={{ display: 'inline', marginRight: '3px' }} />
                                  {r.location}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong style={{ color: 'var(--admin-text)' }}>{r.toolName || r.service}</strong>
                                <div style={{ fontSize: '11px', color: 'var(--admin-muted)' }}>
                                  {r.notes || 'Direct site delivery'}
                                </div>
                              </div>
                            </td>
                            <td className="tabular-nums">
                              <div>{r.durationDays || 3} Days</div>
                              <div style={{ fontSize: '11px', color: 'var(--admin-muted)' }}>{r.quantity || 1} Unit(s)</div>
                            </td>
                            <td className="tabular-nums">
                              <strong>₹{Number(r.amount || 0).toLocaleString('en-IN')}</strong>
                            </td>
                            <td>
                              <span className={`status-pill status-${(r.paymentStatus || 'pending').toLowerCase()}`}>
                                {r.paymentStatus || 'Pending'}
                              </span>
                            </td>
                            <td>
                              <select
                                className="admin-select"
                                style={{ height: '32px', fontSize: '12px' }}
                                value={r.rentalStatus || (r.status === 'Completed' ? 'Completed' : 'Dispatched / Active')}
                                onChange={(e) => handleRentalStatusChange(r.bookingId, e.target.value)}
                              >
                                <option value="Pending Delivery">Pending Delivery</option>
                                <option value="Dispatched / Active">Dispatched / Active</option>
                                <option value="Returned & Inspected">Returned &amp; Inspected</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td>
                              <div className="table-action-btns">
                                <button
                                  type="button"
                                  className="table-mini-btn"
                                  onClick={() => openWhatsApp(r.phone, `Hello ${r.customerName}, this is SRM Akash Construction regarding your equipment rental (${r.bookingId}).`)}
                                  title="WhatsApp"
                                >
                                  <MessageSquare size={12} />
                                </button>
                                <button
                                  type="button"
                                  className="table-mini-btn"
                                  onClick={() => setInspectedBooking(r)}
                                  title="Inspect details"
                                >
                                  <Eye size={12} />
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

          {/* ════ TAB 5: BOOKINGS MANAGEMENT ════ */}
          {activeTab === 'bookings' && (
            <div className="admin-page-panel active" id="panel-bookings">
              <div className="admin-card">
                <div className="admin-card-header">
                  <div className="card-header-titles">
                    <h3 className="card-title-text">Site Construction &amp; Master Mason Bookings</h3>
                    <p className="card-subtitle-text">Turnkey building projects, workforce appointments, and civil assessments</p>
                  </div>
                  <div className="card-header-actions">
                    <select
                      className="admin-select"
                      value={bookingFilter}
                      onChange={(e) => setBookingFilter(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>

                    <button
                      type="button"
                      className="topbar-action-btn btn-secondary-admin"
                      onClick={handleExportCSV}
                    >
                      <Download size={14} />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Customer</th>
                        <th>Service Requested</th>
                        <th>Schedule</th>
                        <th>Amount</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSiteBookings.map(b => (
                        <tr key={b.bookingId}>
                          <td>
                            <strong className="tabular-nums" style={{ color: '#F59E0B' }}>{b.bookingId}</strong>
                          </td>
                          <td>
                            <div>
                              <div style={{ fontWeight: 600 }}>{b.customerName}</div>
                              <div style={{ fontSize: '11px', color: 'var(--admin-muted)' }}>{b.phone}</div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <strong style={{ color: 'var(--admin-text)' }}>{b.service}</strong>
                              <div style={{ fontSize: '11px', color: 'var(--admin-muted)' }}>{b.location}</div>
                            </div>
                          </td>
                          <td className="tabular-nums" style={{ fontSize: '12.5px' }}>
                            <div>{b.startDate}</div>
                            <div style={{ fontSize: '11px', color: 'var(--admin-muted)' }}>{b.workers || 1} Worker(s)</div>
                          </td>
                          <td className="tabular-nums">
                            <strong>₹{Number(b.amount || 0).toLocaleString('en-IN')}</strong>
                          </td>
                          <td>
                            <select
                              className="admin-select"
                              style={{ height: '30px', fontSize: '12px', padding: '0 8px' }}
                              value={b.paymentStatus || 'Pending'}
                              onChange={(e) => handlePaymentStatusChange(b.bookingId, e.target.value)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Paid">Paid</option>
                              <option value="Advance Paid">Advance Paid</option>
                            </select>
                          </td>
                          <td>
                            <select
                              className="admin-select"
                              style={{ height: '30px', fontSize: '12px', padding: '0 8px' }}
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
                                type="button"
                                className="table-mini-btn"
                                onClick={() => setInspectedBooking(b)}
                                title="Inspect"
                              >
                                <Eye size={12} />
                              </button>
                              <button
                                type="button"
                                className="table-mini-btn"
                                onClick={() => openWhatsApp(b.phone, `Hello ${b.customerName}, SRM Akash Construction regarding booking ${b.bookingId}.`)}
                                title="WhatsApp"
                              >
                                <MessageSquare size={12} />
                              </button>
                              <button
                                type="button"
                                className="btn-delete-clean"
                                onClick={() => requestDelete('booking', b)}
                              >
                                Delete
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

          {/* ════ TAB 6: CUSTOMERS DIRECTORY ════ */}
          {activeTab === 'customers' && (
            <div className="admin-page-panel active" id="panel-customers">
              <div className="admin-card">
                <div className="admin-card-header">
                  <div className="card-header-titles">
                    <h3 className="card-title-text">Registered Clients &amp; Builders ({filteredCustomers.length})</h3>
                    <p className="card-subtitle-text">Verified homeowners and civil contractors in Tamil Nadu</p>
                  </div>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Contact Number</th>
                        <th>Email Address</th>
                        <th>Location</th>
                        <th>Total Orders</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map(c => (
                        <tr key={c.id}>
                          <td>
                            <div className="table-user-cell">
                              <div className="table-avatar-circle">
                                {c.name.slice(0, 2).toUpperCase()}
                              </div>
                              <strong style={{ color: 'var(--admin-text)' }}>{c.name}</strong>
                            </div>
                          </td>
                          <td className="tabular-nums">{c.phone}</td>
                          <td style={{ color: 'var(--admin-muted)' }}>{c.email}</td>
                          <td>{c.location || 'Salem'}</td>
                          <td className="tabular-nums">
                            <span className="status-pill status-available">
                              {c.totalBookings || 1} Booking(s)
                            </span>
                          </td>
                          <td>
                            <div className="table-action-btns">
                              <a
                                href={`tel:${c.phone}`}
                                className="table-mini-btn"
                                title="Call client"
                              >
                                <Phone size={12} />
                                <span>Call</span>
                              </a>
                              <button
                                type="button"
                                className="table-mini-btn"
                                onClick={() => openWhatsApp(c.phone, `Hello ${c.name}, greetings from SRM Akash Construction!`)}
                                title="WhatsApp"
                              >
                                <MessageSquare size={12} />
                                <span>WhatsApp</span>
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

          {/* ════ TAB 7: PAYMENTS & INVOICES ════ */}
          {activeTab === 'payments' && (
            <div className="admin-page-panel active" id="panel-payments">
              <div className="admin-card">
                <div className="admin-card-header">
                  <div className="card-header-titles">
                    <h3 className="card-title-text">Authoritative Transaction Ledger</h3>
                    <p className="card-subtitle-text">Itemized UPI, Card, and Net Banking payments with transaction IDs</p>
                  </div>
                  <div className="card-header-actions">
                    <select
                      className="admin-select"
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value)}
                    >
                      <option value="all">All Payment Statuses</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Booking ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Payment Mode</th>
                        <th>Reference</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.map(t => (
                        <tr key={t.transactionId}>
                          <td>
                            <strong className="tabular-nums" style={{ color: '#F59E0B' }}>
                              {t.transactionId}
                            </strong>
                          </td>
                          <td className="tabular-nums">{t.bookingId}</td>
                          <td>{t.customerName}</td>
                          <td className="tabular-nums">
                            <strong>₹{Number(t.amount || 0).toLocaleString('en-IN')}</strong>
                          </td>
                          <td>
                            <span className="status-pill status-available">
                              {t.paymentMethod || 'UPI'}
                            </span>
                          </td>
                          <td style={{ fontSize: '11.5px', fontFamily: 'monospace', color: 'var(--admin-muted)' }}>
                            {t.gatewayReference || 'DIRECT_TRANSFER'}
                          </td>
                          <td className="tabular-nums" style={{ fontSize: '12px' }}>
                            {t.createdAt || '2026-08-18'}
                          </td>
                          <td>
                            <span className={`status-pill status-${(t.paymentStatus || 'paid').toLowerCase()}`}>
                              {t.paymentStatus || 'Paid'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════ TAB 8: SETTINGS ════ */}
          {activeTab === 'settings' && (
            <div className="admin-page-panel active" id="panel-settings">
              <div className="admin-card" style={{ maxWidth: '800px' }}>
                <div className="admin-card-header">
                  <div className="card-header-titles">
                    <h3 className="card-title-text">Business Profile &amp; Operational Config</h3>
                    <p className="card-subtitle-text">Official identity details for SRM Akash Construction &amp; S. SIVAJI</p>
                  </div>
                </div>

                <form onSubmit={handleSaveSettings} style={{ padding: '24px' }}>
                  <div className="adm-form-row-2">
                    <div className="adm-form-group">
                      <label className="adm-form-label">Business Registered Name</label>
                      <input
                        type="text"
                        className="adm-form-control"
                        value={settings.businessName}
                        onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-form-label">Digital Platform Brand</label>
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
                      <label className="adm-form-label">Founder &amp; Managing Director</label>
                      <input
                        type="text"
                        className="adm-form-control"
                        value={settings.founderName}
                        onChange={(e) => setSettings({ ...settings, founderName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-form-label">Official Helpline / WhatsApp</label>
                      <input
                        type="text"
                        className="adm-form-control"
                        value={settings.supportPhone}
                        onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="adm-form-row-2">
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
                    <div className="adm-form-group">
                      <label className="adm-form-label">Primary Operational Coverage</label>
                      <input
                        type="text"
                        className="adm-form-control"
                        value={settings.primaryLocation}
                        onChange={(e) => setSettings({ ...settings, primaryLocation: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="adm-form-row-2">
                    <div className="adm-form-group">
                      <label className="adm-form-label">Working Hours</label>
                      <input
                        type="text"
                        className="adm-form-control"
                        value={settings.workingHours}
                        onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                      />
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-form-label">Booking Advance Requirement</label>
                      <input
                        type="text"
                        className="adm-form-control"
                        value={`${settings.advancePercent}% Stage Advance`}
                        disabled
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button type="submit" className="topbar-action-btn btn-primary-admin">
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. MODAL: EDIT TOOL (Section 5 Redesign)
          Professional dark layout, 2 columns on desktop, loads existing data,
          updates database & state without duplicates!
      ───────────────────────────────────────────────────────────── */}
      {editingTool && (
        <div
          className="admin-modal-backdrop active"
          onClick={(e) => { if (e.target === e.currentTarget) setEditingTool(null); }}
        >
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h3 className="modal-header-text">Edit Tool: {editingTool.name}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEditingTool(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditToolSubmit}>
              <div className="admin-modal-body">
                {/* Tool Name */}
                <div className="adm-form-group">
                  <label className="adm-form-label">
                    Tool Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className="adm-form-control"
                    placeholder="e.g. Rotary Hammer Drill 800W"
                    value={editingTool.name || ''}
                    onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                    required
                  />
                </div>

                {/* Category & Rental Price */}
                <div className="adm-form-row-2">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Category</label>
                    <select
                      className="adm-form-control"
                      value={editingTool.category || 'power-tools'}
                      onChange={(e) => setEditingTool({ ...editingTool, category: e.target.value })}
                    >
                      {toolCategories.filter(c => c.id !== 'all').map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">
                      Rental Price (₹ / Day) <span className="req">*</span>
                    </label>
                    <input
                      type="number"
                      className="adm-form-control"
                      placeholder="e.g. 450"
                      min="50"
                      value={editingTool.price || editingTool.pricePerDay || ''}
                      onChange={(e) => setEditingTool({ ...editingTool, price: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Availability Status */}
                <div className="adm-form-row-2">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Availability</label>
                    <select
                      className="adm-form-control"
                      value={editingTool.availabilityStatus || (editingTool.available ? 'Available' : 'Rented')}
                      onChange={(e) => setEditingTool({ ...editingTool, availabilityStatus: e.target.value })}
                    >
                      <option value="Available">Available</option>
                      <option value="In Use">In Use On-Site</option>
                      <option value="Maintenance">Under Maintenance</option>
                    </select>
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Specifications Summary</label>
                    <input
                      type="text"
                      className="adm-form-control"
                      placeholder="e.g. 800W · 220V · 2.5 kg"
                      value={editingTool.specs || ''}
                      onChange={(e) => setEditingTool({ ...editingTool, specs: e.target.value })}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="adm-form-group">
                  <label className="adm-form-label">Description</label>
                  <textarea
                    className="adm-form-control"
                    rows={3}
                    placeholder="Complete tool description and site applications..."
                    value={editingTool.desc || ''}
                    onChange={(e) => setEditingTool({ ...editingTool, desc: e.target.value })}
                  />
                </div>

                {/* Tool Image */}
                <div className="adm-form-group">
                  <label className="adm-form-label">Tool Image</label>
                  <input
                    type="url"
                    className="adm-form-control"
                    placeholder="Image URL or asset path"
                    value={editingTool.image || ''}
                    onChange={(e) => setEditingTool({ ...editingTool, image: e.target.value })}
                  />
                  {editingTool.image && (
                    <div className="adm-image-preview-wrap">
                      <img src={editingTool.image} alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="topbar-action-btn btn-secondary-admin"
                  onClick={() => setEditingTool(null)}
                  disabled={isSavingTool}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="topbar-action-btn btn-primary-admin"
                  disabled={isSavingTool}
                >
                  {isSavingTool ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. MODAL: ADD TOOL
      ───────────────────────────────────────────────────────────── */}
      {showAddToolModal && (
        <div
          className="admin-modal-backdrop active"
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddToolModal(false); }}
        >
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h3 className="modal-header-text">Add Tool to Catalog</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAddToolModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddToolSubmit}>
              <div className="admin-modal-body">
                <div className="adm-form-group">
                  <label className="adm-form-label">
                    Tool Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className="adm-form-control"
                    placeholder="e.g. Commercial Concrete Mixer 10/7"
                    value={newToolData.name}
                    onChange={(e) => setNewToolData({ ...newToolData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="adm-form-row-2">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Category</label>
                    <select
                      className="adm-form-control"
                      value={newToolData.category}
                      onChange={(e) => setNewToolData({ ...newToolData, category: e.target.value })}
                    >
                      {toolCategories.filter(c => c.id !== 'all').map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">
                      Rental Price (₹ / Day) <span className="req">*</span>
                    </label>
                    <input
                      type="number"
                      className="adm-form-control"
                      placeholder="e.g. 800"
                      min="50"
                      value={newToolData.price}
                      onChange={(e) => setNewToolData({ ...newToolData, price: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="adm-form-row-2">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Availability</label>
                    <select
                      className="adm-form-control"
                      value={newToolData.availabilityStatus}
                      onChange={(e) => setNewToolData({ ...newToolData, availabilityStatus: e.target.value })}
                    >
                      <option value="Available">Available</option>
                      <option value="In Use">In Use On-Site</option>
                      <option value="Maintenance">Under Maintenance</option>
                    </select>
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Specifications Summary</label>
                    <input
                      type="text"
                      className="adm-form-control"
                      placeholder="e.g. Diesel Engine · 200L Drum"
                      value={newToolData.specs}
                      onChange={(e) => setNewToolData({ ...newToolData, specs: e.target.value })}
                    />
                  </div>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Description</label>
                  <textarea
                    className="adm-form-control"
                    rows={3}
                    placeholder="Enter tool description..."
                    value={newToolData.desc}
                    onChange={(e) => setNewToolData({ ...newToolData, desc: e.target.value })}
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Image URL</label>
                  <input
                    type="url"
                    className="adm-form-control"
                    placeholder="Paste image URL"
                    value={newToolData.image}
                    onChange={(e) => setNewToolData({ ...newToolData, image: e.target.value })}
                  />
                  {newToolData.image && (
                    <div className="adm-image-preview-wrap">
                      <img src={newToolData.image} alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="topbar-action-btn btn-secondary-admin"
                  onClick={() => setShowAddToolModal(false)}
                  disabled={isSavingTool}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="topbar-action-btn btn-primary-admin"
                  disabled={isSavingTool}
                >
                  {isSavingTool ? 'Saving...' : 'Add Tool'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. MODAL: EDIT SERVICE
      ───────────────────────────────────────────────────────────── */}
      {editingService && (
        <div
          className="admin-modal-backdrop active"
          onClick={(e) => { if (e.target === e.currentTarget) setEditingService(null); }}
        >
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h3 className="modal-header-text">Edit Service: {editingService.title}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEditingService(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditServiceSubmit}>
              <div className="admin-modal-body">
                <div className="adm-form-group">
                  <label className="adm-form-label">Service Title *</label>
                  <input
                    type="text"
                    className="adm-form-control"
                    value={editingService.title}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    required
                  />
                </div>

                <div className="adm-form-row-2">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Category</label>
                    <input
                      type="text"
                      className="adm-form-control"
                      value={editingService.category || 'construction'}
                      onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Rate / Price Range</label>
                    <input
                      type="text"
                      className="adm-form-control"
                      value={editingService.priceRange || ''}
                      onChange={(e) => setEditingService({ ...editingService, priceRange: e.target.value })}
                    />
                  </div>
                </div>

                {/* 1 Short Sentence Description Rule */}
                <div className="adm-form-group">
                  <label className="adm-form-label">
                    Short Description (1 Sentence · 8–15 words) *
                  </label>
                  <input
                    type="text"
                    className="adm-form-control"
                    placeholder="One concise sentence for the public card..."
                    value={editingService.shortDescription || ''}
                    onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                    required
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Full Comprehensive Description</label>
                  <textarea
                    className="adm-form-control"
                    rows={3}
                    value={editingService.description || ''}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Service Image URL</label>
                  <input
                    type="url"
                    className="adm-form-control"
                    value={editingService.image || ''}
                    onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="topbar-action-btn btn-secondary-admin"
                  onClick={() => setEditingService(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="topbar-action-btn btn-primary-admin">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          7. MODAL: ADD SERVICE
      ───────────────────────────────────────────────────────────── */}
      {showAddServiceModal && (
        <div
          className="admin-modal-backdrop active"
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddServiceModal(false); }}
        >
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h3 className="modal-header-text">Add Construction Service</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAddServiceModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddServiceSubmit}>
              <div className="admin-modal-body">
                <div className="adm-form-group">
                  <label className="adm-form-label">Service Title *</label>
                  <input
                    type="text"
                    className="adm-form-control"
                    placeholder="e.g. Structural Retrofitting & Strengthening"
                    value={newServiceData.title}
                    onChange={(e) => setNewServiceData({ ...newServiceData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="adm-form-row-2">
                  <div className="adm-form-group">
                    <label className="adm-form-label">Category</label>
                    <input
                      type="text"
                      className="adm-form-control"
                      value={newServiceData.category}
                      onChange={(e) => setNewServiceData({ ...newServiceData, category: e.target.value })}
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Price Range / Rate</label>
                    <input
                      type="text"
                      className="adm-form-control"
                      placeholder="e.g. ₹1,200 / Sq.Ft"
                      value={newServiceData.priceRange}
                      onChange={(e) => setNewServiceData({ ...newServiceData, priceRange: e.target.value })}
                    />
                  </div>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">
                    Short Description (1 Sentence · 8–15 words) *
                  </label>
                  <input
                    type="text"
                    className="adm-form-control"
                    placeholder="Reliable structural reinforcement solutions for residential and commercial buildings."
                    value={newServiceData.shortDescription}
                    onChange={(e) => setNewServiceData({ ...newServiceData, shortDescription: e.target.value })}
                    required
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Full Description</label>
                  <textarea
                    className="adm-form-control"
                    rows={3}
                    placeholder="Complete detailed description..."
                    value={newServiceData.description}
                    onChange={(e) => setNewServiceData({ ...newServiceData, description: e.target.value })}
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Image URL</label>
                  <input
                    type="url"
                    className="adm-form-control"
                    placeholder="Image URL"
                    value={newServiceData.image}
                    onChange={(e) => setNewServiceData({ ...newServiceData, image: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="topbar-action-btn btn-secondary-admin"
                  onClick={() => setShowAddServiceModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="topbar-action-btn btn-primary-admin">
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          8. SAFE DELETE CONFIRMATION DIALOG (Section 6 & 7)
          NO emojis, clean text "Delete", restrained danger style,
          calls authorized backend deletion API.
      ───────────────────────────────────────────────────────────── */}
      {deletingItem && (
        <div
          className="admin-modal-backdrop active"
          onClick={(e) => { if (e.target === e.currentTarget && !isDeleting) setDeletingItem(null); }}
        >
          <div className="admin-modal-box" style={{ maxWidth: '460px' }}>
            <div className="admin-modal-header">
              <h3 className="modal-header-text">
                Delete {deletingItem.type === 'tool' ? 'Tool' : deletingItem.type === 'service' ? 'Service' : 'Booking'}?
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setDeletingItem(null)}
                disabled={isDeleting}
              >
                ✕
              </button>
            </div>

            <div className="admin-modal-body">
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: 'rgba(220, 38, 38, 0.15)',
                    color: '#F87171',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--admin-text)' }}>
                    Are you sure you want to delete <strong>&ldquo;{deletingItem.name}&rdquo;</strong>?
                  </p>
                  <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--admin-muted)', lineHeight: 1.5 }}>
                    This action will remove the record using the authorized system API. This operation cannot be undone.
                  </p>
                  {deletingItem.warning && (
                    <div
                      style={{
                        marginTop: '12px',
                        padding: '10px 12px',
                        background: 'rgba(245, 158, 11, 0.12)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#FBBF24'
                      }}
                    >
                      {deletingItem.warning}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="topbar-action-btn btn-secondary-admin"
                onClick={() => setDeletingItem(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-delete-clean"
                style={{ padding: '8px 18px', background: 'rgba(220, 38, 38, 0.15)', borderColor: '#DC2626' }}
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          9. MODAL: INSPECT BOOKING / RENTAL DETAILS
      ───────────────────────────────────────────────────────────── */}
      {inspectedBooking && (
        <div
          className="admin-modal-backdrop active"
          onClick={(e) => { if (e.target === e.currentTarget) setInspectedBooking(null); }}
        >
          <div className="admin-modal-box" style={{ maxWidth: '600px' }}>
            <div className="admin-modal-header">
              <h3 className="modal-header-text">Booking Inspection: {inspectedBooking.bookingId}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setInspectedBooking(null)}
              >
                ✕
              </button>
            </div>

            <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Client Name
                  </span>
                  <div style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--admin-text)' }}>
                    {inspectedBooking.customerName}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Phone / WhatsApp
                  </span>
                  <div style={{ fontSize: '14px', color: 'var(--admin-text)' }}>
                    {inspectedBooking.phone}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Service / Item
                  </span>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#F59E0B' }}>
                    {inspectedBooking.toolName || inspectedBooking.service}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Location
                  </span>
                  <div style={{ fontSize: '14px', color: 'var(--admin-text)' }}>
                    {inspectedBooking.location || 'Salem & Coimbatore'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Start Date
                  </span>
                  <div className="tabular-nums" style={{ fontSize: '13px' }}>
                    {inspectedBooking.startDate || 'Immediate'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Amount
                  </span>
                  <div className="tabular-nums" style={{ fontSize: '14px', fontWeight: 700 }}>
                    ₹{Number(inspectedBooking.amount || 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Payment Mode
                  </span>
                  <div style={{ fontSize: '13px' }}>
                    {inspectedBooking.paymentMode || 'UPI'}
                  </div>
                </div>
              </div>

              {inspectedBooking.notes && (
                <div style={{ background: 'var(--admin-input)', padding: '12px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--admin-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Client Project Notes
                  </span>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--admin-text)' }}>
                    {inspectedBooking.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="topbar-action-btn btn-secondary-admin"
                onClick={() => openWhatsApp(inspectedBooking.phone, `Hello ${inspectedBooking.customerName}, regarding your request ${inspectedBooking.bookingId}...`)}
              >
                <MessageSquare size={13} />
                <span>WhatsApp Client</span>
              </button>
              <button
                type="button"
                className="topbar-action-btn btn-primary-admin"
                onClick={() => setInspectedBooking(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
