import { useEffect, useState } from 'react'
import { Bell, CalendarDays, ChevronLeft, LayoutDashboard, LogOut, Package, Plus, Search, Settings, Sparkles, Users, X } from 'lucide-react'
import './admin.css'

const fallbackBookings = [
  { name: 'سارة أحمد', service: 'طقس التوهج', date: 'اليوم، 09:00', status: 'confirmed' },
  { name: 'ريم خالد', service: 'توازن البشرة', date: 'اليوم، 10:30', status: 'pending' },
  { name: 'لينا محمد', service: 'وقت لكِ', date: 'اليوم، 12:00', status: 'confirmed' },
  { name: 'جود العتيبي', service: 'طقس التوهج', date: 'غداً، 01:30', status: 'confirmed' },
]
const products = [
  ['زيت الوجه المضيء', '64 طلب', 'متوفر', '245 ر.س'],
  ['مقشر الجسم بالملح', '52 طلب', 'متوفر', '180 ر.س'],
  ['رذاذ النوم الهادئ', '38 طلب', 'منخفض', '155 ر.س'],
]

function Admin() {
  const [bookings, setBookings] = useState(fallbackBookings)
  const [active, setActive] = useState('overview')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    fetch('/api/bookings').then((response) => response.ok ? response.json() : []).then((data) => {
      if (data.length) setBookings(data.map((booking) => ({ ...booking, date: booking.date, status: booking.status === 'pending' ? 'pending' : 'confirmed' })))
    }).catch(() => {})
  }, [])

  function notify(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2800)
  }

  return <div className="admin-shell" dir="rtl">
    <aside className="admin-sidebar"><a className="admin-logo" href="/"><b>NŌRA</b><small>BEAUTY STUDIO</small></a><div className="workspace"><span className="workspace-avatar">ن</span><span><b>NŌRA Studio</b><small>مساحة العمل الرئيسية</small></span><ChevronLeft size={15} /></div><nav className="admin-nav"><span className="nav-caption">مساحة العمل</span><button className={active === 'overview' ? 'active' : ''} onClick={() => setActive('overview')}><LayoutDashboard size={17} /> نظرة عامة</button><button className={active === 'bookings' ? 'active' : ''} onClick={() => setActive('bookings')}><CalendarDays size={17} /> الحجوزات <i>{bookings.length}</i></button><button onClick={() => notify('قسم المنتجات جاهز للإدارة')}><Package size={17} /> المنتجات</button><button onClick={() => notify('قسم العملاء قيد التحديث')}><Users size={17} /> العملاء</button><span className="nav-caption nav-bottom">الإعدادات</span><button onClick={() => notify('سيتم فتح إعدادات الحساب قريباً')}><Settings size={17} /> إعدادات الحساب</button></nav><a className="back-site" href="/"><LogOut size={16} /> العودة للموقع</a></aside>
    <main className="admin-main"><header className="admin-header"><div className="admin-search"><Search size={17} /><input placeholder="ابحثي في لوحة التحكم" /></div><div className="admin-header-actions"><button className="notification" onClick={() => notify('لا توجد تنبيهات جديدة')}><Bell size={18} /><i /></button><span className="header-divider" /><span className="admin-user"><span className="user-avatar">ن</span><span><b>نورة محمد</b><small>مديرة الاستوديو</small></span><ChevronLeft size={15} /></span></div></header>{notice && <div className="admin-notice"><Sparkles size={16} /> {notice}<button onClick={() => setNotice('')}><X size={14} /></button></div>}{active === 'bookings' ? <Bookings bookings={bookings} onNotify={notify} /> : <Overview bookings={bookings} onNotify={notify} />}</main>
  </div>
}

function Overview({ bookings, onNotify }) {
  return <><div className="admin-page-heading"><div><span className="admin-eyebrow">الثلاثاء، ٢٥ أغسطس ٢٠٢٦</span><h1>صباح الخير، نورة</h1><p>إليكِ لمحة سريعة عن أداء نُورا اليوم.</p></div><button className="admin-primary" onClick={() => onNotify('تم فتح نموذج الموعد الجديد')}><Plus size={17} /> موعد جديد</button></div><div className="admin-stats"><Stat label="مواعيد اليوم" value="12" change="+18% عن الأسبوع الماضي" /><Stat label="مبيعات الشهر" value="24,850" unit="ر.س" change="+12.4% عن الشهر الماضي" /><Stat label="عملاء جدد" value="48" change="هذا الشهر" /><Stat dark label="تقييم التجربة" value="4.9" unit="/ 5" change="من ٥٠٠+ تقييم" /></div><div className="admin-grid"><section className="admin-panel appointments-panel"><PanelTitle title="المواعيد القادمة" action="عرض الكل" onClick={() => onNotify('يمكنك إدارة الحجوزات من تبويب الحجوزات')} />{bookings.slice(0, 4).map((booking, index) => <div className="booking-row" key={`${booking.name}-${index}`}><time>{booking.date}</time><span className="booking-avatar">{booking.name?.[0] || 'ن'}</span><span className="booking-details"><b>{booking.name}</b><small>{booking.service}</small></span><span className={`booking-status ${booking.status}`}>{booking.status === 'pending' ? 'بانتظار التأكيد' : 'مؤكد'}</span></div>)}</section><section className="admin-panel"><PanelTitle title="الأكثر طلباً" action="إدارة المنتجات" onClick={() => onNotify('تم فتح إدارة المنتجات')} />{products.map((product, index) => <div className="product-row" key={product[0]}><span className={`product-thumb thumb-${index}`}><Package size={18} /></span><span><b>{product[0]}</b><small>{product[1]} هذا الشهر</small></span><span className={product[2] === 'منخفض' ? 'stock low' : 'stock'}>{product[2]}</span><strong>{product[3]}</strong></div>)}</section></div><section className="admin-panel activity-panel"><PanelTitle title="ملخص الأداء" action="هذا الشهر" onClick={() => onNotify('يتم عرض بيانات هذا الشهر')} /><div className="chart"><div className="chart-bars">{[42, 64, 51, 78, 56, 89, 70, 95, 62, 82, 73, 100].map((height, index) => <span style={{ height: `${height}%` }} key={index} />)}</div><div className="chart-labels"><span>يناير</span><span>فبراير</span><span>مارس</span><span>أبريل</span><span>مايو</span><span>يونيو</span></div></div></section></>
}

function Stat({ label, value, unit, change, dark }) { return <div className={`admin-stat ${dark ? 'dark' : ''}`}><small>{label}</small><strong>{value} <em>{unit}</em></strong><span>{change}</span></div> }
function PanelTitle({ title, action, onClick }) { return <div className="panel-title"><h2>{title}</h2><button onClick={onClick}>{action}<ChevronLeft size={14} /></button></div> }
function Bookings({ bookings, onNotify }) { return <><div className="admin-page-heading"><div><span className="admin-eyebrow">إدارة الحجوزات</span><h1>كل المواعيد</h1><p>راجعي طلبات العميلات ونظّمي جدول الاستوديو.</p></div><button className="admin-primary" onClick={() => onNotify('تم فتح نموذج الموعد الجديد')}><Plus size={17} /> موعد جديد</button></div><section className="admin-panel all-bookings"><div className="booking-filter"><b>قائمة الحجوزات <small>{bookings.length} مواعيد</small></b><button onClick={() => onNotify('الفلاتر جاهزة للاستخدام')}>هذا الأسبوع <ChevronLeft size={14} /></button></div><div className="table-head"><span>العميلة</span><span>الخدمة</span><span>الموعد</span><span>الحالة</span><span>إجراء</span></div>{bookings.map((booking, index) => <div className="table-row" key={`${booking.name}-${index}`}><span className="table-client"><span className="booking-avatar">{booking.name?.[0] || 'ن'}</span><b>{booking.name}</b></span><span>{booking.service}</span><span>{booking.date}</span><span className={`booking-status ${booking.status}`}>{booking.status === 'pending' ? 'بانتظار التأكيد' : 'مؤكد'}</span><button className="row-action" onClick={() => onNotify(`تم فتح تفاصيل ${booking.name}`)}>التفاصيل</button></div>)}</section></> }

export default Admin
