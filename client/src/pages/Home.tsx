import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowUpLeft,
  Check,
  ChevronDown,
  Heart,
  Leaf,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";

type Material = "بلاستيك" | "صوف" | "ورق" | "قماش";
type Filter = "الكل" | "بلاستيك" | "صوف" | "ورق" | "قماش";

type Product = {
  id: number;
  name: string;
  material: Material;
  price: number;
  oldPrice?: number;
  rating: string;
  image: string;
  tag?: string;
  note: string;
};

type CartItem = Product & { quantity: number };

const products: Product[] = [
  {
    id: 1,
    name: "باقة شمس الصباح",
    material: "قماش",
    price: 159,
    oldPrice: 189,
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=85",
    tag: "الأكثر طلباً",
    note: "ألوان دافئة تنعش الزاوية الهادئة",
  },
  {
    id: 2,
    name: "زهرة لافندر ناعمة",
    material: "صوف",
    price: 89,
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1470509037663-253afd7f0f51?auto=format&fit=crop&w=900&q=85",
    tag: "جديد",
    note: "تفاصيل يدوية بنعومة لا تُقاوم",
  },
  {
    id: 3,
    name: "غصن زهر الكرز",
    material: "ورق",
    price: 119,
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=85",
    note: "خفيف، أنيق، ويحب الضوء الطبيعي",
  },
  {
    id: 4,
    name: "أوراق مونستيرا",
    material: "بلاستيك",
    price: 74,
    oldPrice: 99,
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1531058240690-006c040fdcf4?auto=format&fit=crop&w=900&q=85",
    tag: "خصم 25%",
    note: "خضرة مستديمة بلا عناية يومية",
  },
  {
    id: 5,
    name: "توليب وردي صغير",
    material: "قماش",
    price: 109,
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=900&q=85",
    note: "لمسة مرحة للمكتب أو طاولة القهوة",
  },
  {
    id: 6,
    name: "باقة بوهيمية برّية",
    material: "صوف",
    price: 179,
    rating: "5.0",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85",
    tag: "قطعة محدودة",
    note: "تكوين غني يصنع نقطة التركيز",
  },
];

const categories: { name: Filter; count: string; accent: string; icon: string }[] = [
  { name: "بلاستيك", count: "24 قطعة", accent: "bg-[#dce9b1]", icon: "✦" },
  { name: "صوف", count: "18 قطعة", accent: "bg-[#ffc8ba]", icon: "◌" },
  { name: "ورق", count: "16 قطعة", accent: "bg-[#f3dfbd]", icon: "❋" },
  { name: "قماش", count: "29 قطعة", accent: "bg-[#c8d9ed]", icon: "✽" },
];

const money = (value: number) => `${value.toLocaleString("ar-SA")} ر.س`;

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<Filter>("الكل");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesFilter = activeFilter === "الكل" || product.material === activeFilter;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || `${product.name} ${product.material}`.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...current, { ...product, quantity: 1 }];
    });
    toast.success("أضيفت القطعة إلى سلتك", { description: product.name });
  };

  const changeQuantity = (id: number, delta: number) => {
    setCart((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const toggleWishlist = (id: number) => {
    setWishlist((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
    toast(wishlist.includes(id) ? "أزيلت من المفضلة" : "أضيفت إلى المفضلة", { icon: <Heart className="h-4 w-4" /> });
  };

  const scrollToShop = () => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div dir="rtl" className="min-h-screen overflow-hidden bg-[#f7f3ec] text-[#20352a] selection:bg-[#ffc1b4] selection:text-[#20352a]">
      <div className="relative overflow-hidden bg-[#193c2c] px-4 py-2.5 text-center text-[11px] font-semibold tracking-[0.16em] text-[#f7f3ec] sm:text-xs">
        <span className="inline-flex items-center gap-2"><Sparkles className="h-3.5 w-3.5 text-[#d6e67e]" /> الشحن مجاني للطلبات فوق ٢٥٠ ر.س <span className="hidden text-[#a8c796] sm:inline">— احتفلي بالربيع، كل يوم</span></span>
      </div>

      <header className="sticky top-0 z-40 border-b border-[#20352a]/10 bg-[#f7f3ec]/90 backdrop-blur-xl">
        <div className="container flex h-[76px] items-center justify-between gap-4">
          <a href="#top" className="group flex items-center gap-3" aria-label="نَبْتة - الصفحة الرئيسية">
            <span className="grid h-11 w-11 place-items-center rounded-[18px] bg-[#193c2c] text-[#d6e67e] shadow-[0_8px_20px_rgba(25,60,44,0.18)] transition-transform duration-200 group-hover:-rotate-6"><Leaf className="h-5 w-5" /></span>
            <span className="leading-none"><strong className="block font-display text-xl font-bold tracking-tight">نَبْتة</strong><small className="mt-1 block text-[10px] font-semibold tracking-[0.16em] text-[#6b766f]">EVERLASTING BLOOMS</small></span>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#536259] lg:flex">
            <a href="#shop" className="transition-colors hover:text-[#d86655]">تسوّقي الآن</a>
            <a href="#collection" className="transition-colors hover:text-[#d86655]">المجموعات</a>
            <a href="#story" className="transition-colors hover:text-[#d86655]">حكاية نَبْتة</a>
            <a href="#journal" className="transition-colors hover:text-[#d86655]">المجلة</a>
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen((open) => !open)} className="grid h-11 w-11 place-items-center rounded-full border border-[#20352a]/10 transition hover:border-[#20352a]/30 hover:bg-white" aria-label="بحث"><Search className="h-[18px] w-[18px]" /></button>
            <button onClick={() => setCartOpen(true)} className="relative flex h-11 items-center gap-2 rounded-full bg-[#ffb09e] px-4 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-[#ffa18c]" aria-label="فتح السلة"><ShoppingBag className="h-[18px] w-[18px]" /><span className="hidden sm:inline">سلّتي</span>{cartCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#193c2c] px-1 text-[10px] text-white">{cartCount}</span>}</button>
            <button onClick={() => setMobileOpen((open) => !open)} className="grid h-11 w-11 place-items-center rounded-full border border-[#20352a]/10 lg:hidden" aria-label="القائمة"><Menu className="h-[18px] w-[18px]" /></button>
          </div>
        </div>
        {searchOpen && <div className="border-t border-[#20352a]/10 px-4 py-3"><div className="container relative"><Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#758178]" /><input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="ابحثي عن زهرة أو خامة..." className="h-12 w-full rounded-2xl border border-[#20352a]/10 bg-white pr-11 pl-4 text-sm outline-none transition placeholder:text-[#9aa39e] focus:border-[#193c2c]" /></div></div>}
        {mobileOpen && <div className="border-t border-[#20352a]/10 bg-[#f7f3ec] px-4 py-4 lg:hidden"><nav className="container grid gap-4 text-sm font-semibold"><a href="#shop" onClick={() => setMobileOpen(false)}>تسوّقي الآن</a><a href="#collection" onClick={() => setMobileOpen(false)}>المجموعات</a><a href="#story" onClick={() => setMobileOpen(false)}>حكاية نَبْتة</a><a href="#journal" onClick={() => setMobileOpen(false)}>المجلة</a></nav></div>}
      </header>

      <main id="top">
        <section className="relative mx-auto max-w-[1440px] px-4 pb-20 pt-10 sm:px-8 lg:px-12 lg:pb-28 lg:pt-16">
          <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#d6e67e]/40 blur-3xl" />
          <div className="pointer-events-none absolute bottom-8 right-0 h-72 w-72 rounded-full bg-[#ffc1b4]/30 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="order-2 lg:order-1">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#193c2c]/15 bg-white/55 px-3 py-2 text-[11px] font-bold tracking-[0.12em] text-[#4e6458]"><span className="h-2 w-2 rounded-full bg-[#d86655]" /> زهور تُحبّها البيوت
              </div>
              <h1 className="max-w-[620px] font-display text-[clamp(3.6rem,8vw,7.25rem)] font-bold leading-[0.93] tracking-[-0.075em] text-[#193c2c]">الجمال الذي<br /><em className="font-serif font-normal text-[#d86655]">لا يذبل.</em></h1>
              <p className="mt-7 max-w-[500px] text-lg leading-8 text-[#617067] sm:text-xl">زهور صناعية مصمّمة بعناية لتمنح مساحتك روحاً دافئة، من أول نظرة وحتى آخر موسم.</p>
              <div className="mt-9 flex flex-wrap items-center gap-3"><button onClick={scrollToShop} className="group inline-flex h-14 items-center gap-4 rounded-full bg-[#193c2c] px-7 text-sm font-bold text-white shadow-[0_15px_30px_rgba(25,60,44,0.18)] transition duration-200 hover:-translate-y-1 hover:bg-[#285642] active:scale-[0.98]">اكتشفي التشكيلة <span className="grid h-8 w-8 place-items-center rounded-full bg-[#d6e67e] text-[#193c2c] transition-transform group-hover:-rotate-45"><ArrowUpLeft className="h-4 w-4" /></span></button><a href="#story" className="inline-flex h-14 items-center gap-2 rounded-full px-4 text-sm font-bold text-[#536259] transition hover:text-[#d86655]">لماذا نَبْتة؟ <ArrowLeft className="h-4 w-4" /></a></div>
              <div className="mt-12 flex items-center gap-5 border-t border-[#20352a]/10 pt-6"><div className="flex -space-x-3 space-x-reverse">{["#ffc1b4", "#c8d9ed", "#d6e67e", "#f3dfbd"].map((color, index) => <span key={color} style={{ backgroundColor: color }} className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#f7f3ec] text-[10px] font-black text-[#193c2c]">{["س", "ل", "ن", "+"][index]}</span>)}</div><p className="text-xs leading-5 text-[#6b766f]"><strong className="block text-sm text-[#20352a]">+٢٢,٠٠٠ عميلة سعيدة</strong>اختارت أن تزهر مساحتها</p></div>
            </div>
            <div className="relative order-1 min-h-[450px] lg:order-2 lg:min-h-[590px]">
              <div className="absolute right-0 top-0 h-[90%] w-[83%] overflow-hidden rounded-[38%_38%_18%_18%] bg-[#dce9b1] shadow-[0_28px_70px_rgba(25,60,44,0.14)]"><img src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=90" alt="باقة زهور بألوان طبيعية" className="h-full w-full object-cover mix-blend-multiply opacity-90" /></div>
              <div className="absolute bottom-0 left-0 w-[48%] overflow-hidden rounded-[26px] border-[10px] border-[#f7f3ec] bg-[#ffc1b4] shadow-[0_18px_40px_rgba(25,60,44,0.15)]"><img src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=700&q=90" alt="زهور ورقية ملونة" className="aspect-[0.84] w-full object-cover" /></div>
              <div className="absolute left-[2%] top-[14%] grid h-24 w-24 place-items-center rounded-full bg-[#193c2c] text-center text-xs font-bold leading-5 text-[#f7f3ec] shadow-[0_15px_30px_rgba(25,60,44,0.25)]"><Sparkles className="mx-auto mb-1 h-4 w-4 text-[#d6e67e]" />مصنوعة<br />بالحب</div>
              <div className="absolute bottom-[8%] right-[8%] rounded-2xl bg-[#f7f3ec]/90 px-4 py-3 shadow-lg backdrop-blur"><div className="flex items-center gap-1 text-[#d86655]"><Star className="h-3.5 w-3.5 fill-current" /><span className="text-xs font-black">4.9/5</span></div><span className="mt-1 block text-[10px] text-[#6b766f]">تقييمات حقيقية</span></div>
            </div>
          </div>
        </section>

        <section id="collection" className="bg-[#fffdf8] py-20 sm:py-24">
          <div className="container">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><span className="text-xs font-black tracking-[0.18em] text-[#d86655]">اختاري خامتك</span><h2 className="mt-3 font-display text-4xl font-bold tracking-[-0.05em] sm:text-5xl">كل زهرة لها <em className="font-serif font-normal text-[#d86655]">حكاية.</em></h2></div><p className="max-w-[320px] text-sm leading-6 text-[#6b766f]">من الملمس الناعم إلى اللمعة الجريئة، صمّمنا لك عالماً من التفاصيل التي تدوم.</p></div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">{categories.map((category) => <button key={category.name} onClick={() => { setActiveFilter(category.name); scrollToShop(); }} className={`group relative overflow-hidden rounded-[26px] ${category.accent} p-5 text-right transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(32,53,42,0.12)] sm:p-7`}><div className="flex items-start justify-between"><span className="grid h-10 w-10 place-items-center rounded-full bg-white/50 font-serif text-xl transition-transform group-hover:rotate-12">{category.icon}</span><ArrowUpLeft className="h-5 w-5 text-[#20352a]/50 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" /></div><div className="mt-16 sm:mt-20"><h3 className="font-display text-2xl font-bold">{category.name}</h3><p className="mt-1 text-xs text-[#536259]">{category.count}</p></div><span className="pointer-events-none absolute -bottom-7 -left-3 text-[120px] font-black leading-none text-white/25">{category.icon}</span></button>)}</div>
          </div>
        </section>

        <section id="shop" className="scroll-mt-20 bg-[#f7f3ec] py-20 sm:py-24">
          <div className="container">
            <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><span className="text-xs font-black tracking-[0.18em] text-[#d86655]">منتجاتنا المفضلة</span><h2 className="mt-3 font-display text-4xl font-bold tracking-[-0.05em] sm:text-5xl">أزهري <span className="relative inline-block"><span className="relative z-10">بطريقتك</span><span className="absolute bottom-1 right-0 -z-0 h-3 w-full -rotate-2 rounded-full bg-[#d6e67e]" /></span></h2></div><div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm font-bold text-[#6b766f]">{(["الكل", "بلاستيك", "صوف", "ورق", "قماش"] as Filter[]).map((filter) => <button key={filter} onClick={() => setActiveFilter(filter)} className={`whitespace-nowrap rounded-full px-4 py-2.5 transition ${activeFilter === filter ? "bg-[#193c2c] text-white" : "hover:bg-white"}`}>{filter}</button>)}</div></div>
            {filteredProducts.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filteredProducts.map((product, index) => <article key={product.id} className="group relative"><div className="relative overflow-hidden rounded-[26px] bg-[#e6e1d7]"><img src={product.image} alt={product.name} className="aspect-[0.93] w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-x-0 top-0 flex items-start justify-between p-4"><span className={`rounded-full px-3 py-1.5 text-[10px] font-black ${product.tag ? "bg-[#f7f3ec] text-[#d86655]" : "bg-transparent text-transparent"}`}>{product.tag || "—"}</span><button onClick={() => toggleWishlist(product.id)} className={`grid h-10 w-10 place-items-center rounded-full backdrop-blur-md transition ${wishlist.includes(product.id) ? "bg-[#d86655] text-white" : "bg-[#f7f3ec]/80 text-[#20352a] hover:bg-white"}`} aria-label="إضافة إلى المفضلة"><Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-current" : ""}`} /></button></div><button onClick={() => addToCart(product)} className="absolute bottom-4 left-4 right-4 flex h-12 translate-y-16 items-center justify-center gap-2 rounded-full bg-[#193c2c] text-sm font-bold text-white opacity-0 shadow-xl transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-[#285642]">أضيفي إلى السلة <Plus className="h-4 w-4" /></button></div><div className="flex items-start justify-between gap-3 px-1 pt-4"><div><div className="mb-1 flex items-center gap-2"><span className="text-[10px] font-black tracking-[0.12em] text-[#d86655]">{product.material}</span><span className="h-1 w-1 rounded-full bg-[#aab3ad]" /><span className="flex items-center gap-0.5 text-[11px] text-[#6b766f]"><Star className="h-3 w-3 fill-[#e9ac52] text-[#e9ac52]" /> {product.rating}</span></div><h3 className="font-display text-xl font-bold">{product.name}</h3><p className="mt-1 text-xs text-[#77827b]">{product.note}</p></div><div className="text-left"><strong className="block whitespace-nowrap text-lg font-black">{money(product.price)}</strong>{product.oldPrice && <del className="text-xs text-[#9ba49e]">{money(product.oldPrice)}</del>}</div></div></article>)}</div> : <div className="rounded-[26px] bg-white px-6 py-16 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#dce9b1]"><Search className="h-5 w-5" /></div><h3 className="mt-4 font-display text-2xl font-bold">لم نجد هذه الزهرة</h3><p className="mt-2 text-sm text-[#6b766f]">جرّبي البحث بكلمة أخرى أو اختاري خامة مختلفة.</p><button onClick={() => { setSearchQuery(""); setActiveFilter("الكل"); }} className="mt-5 rounded-full bg-[#193c2c] px-5 py-3 text-sm font-bold text-white">عرض الكل</button></div>}
          </div>
        </section>

        <section id="story" className="relative overflow-hidden bg-[#193c2c] py-20 text-[#f7f3ec] sm:py-28"><div className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full border-[70px] border-[#d6e67e]/15" /><div className="container relative grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]"><div className="relative mx-auto w-full max-w-[460px]"><div className="rotate-[-5deg] overflow-hidden rounded-[30px] border-[10px] border-[#f7f3ec]/10 bg-[#f3dfbd] shadow-2xl"><img src="https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=900&q=90" alt="تفاصيل زهور طبيعية" className="aspect-[0.92] w-full object-cover" /></div><div className="absolute -bottom-6 -right-5 rotate-[7deg] rounded-2xl bg-[#d6e67e] px-5 py-4 text-center text-[#193c2c] shadow-xl"><strong className="block font-display text-2xl">١٠٠٪</strong><span className="text-[10px] font-bold">تفاصيل مصنوعة يدوياً</span></div></div><div><span className="text-xs font-black tracking-[0.18em] text-[#d6e67e]">حكاية نَبْتة</span><h2 className="mt-4 max-w-[650px] font-display text-4xl font-bold leading-tight tracking-[-0.055em] sm:text-6xl">نؤمن أن البيت<br /><em className="font-serif font-normal text-[#ffb09e]">يستحق أن يزهر.</em></h2><p className="mt-7 max-w-[570px] text-base leading-8 text-[#c0cec3]">بدأت نَبْتة من سؤال بسيط: لماذا ننتظر موسماً واحداً لنعيش إحساس الحديقة؟ لذلك نجمع خامات محبوبة، ونحوّلها إلى زهور تعيش معك أطول، وتمنح كل ركن سبباً جديداً للابتسام.</p><div className="mt-9 grid max-w-[580px] grid-cols-3 gap-4 border-t border-white/15 pt-7"><div><strong className="block font-display text-3xl text-[#d6e67e]">٤</strong><span className="mt-1 block text-xs text-[#b1c0b4]">خامات مختلفة</span></div><div><strong className="block font-display text-3xl text-[#d6e67e]">٧</strong><span className="mt-1 block text-xs text-[#b1c0b4]">سنوات من الشغف</span></div><div><strong className="block font-display text-3xl text-[#d6e67e]">٣٠K</strong><span className="mt-1 block text-xs text-[#b1c0b4]">زهرة في البيوت</span></div></div></div></div></section>

        <section id="journal" className="bg-[#fffdf8] py-20 sm:py-24"><div className="container"><div className="mb-10 flex items-end justify-between"><div><span className="text-xs font-black tracking-[0.18em] text-[#d86655]">من مجلة نَبْتة</span><h2 className="mt-3 font-display text-4xl font-bold tracking-[-0.05em] sm:text-5xl">أفكار <em className="font-serif font-normal text-[#d86655]">تزهر.</em></h2></div><a href="#journal" className="hidden items-center gap-2 text-sm font-bold text-[#536259] transition hover:text-[#d86655] sm:flex">كل المقالات <ArrowLeft className="h-4 w-4" /></a></div><div className="grid gap-5 lg:grid-cols-3"><article className="group lg:col-span-2"><div className="grid h-full items-end overflow-hidden rounded-[28px] bg-[#dce9b1] sm:grid-cols-2"><img src="https://images.unsplash.com/photo-1495231916356-a86217efff12?auto=format&fit=crop&w=1000&q=90" alt="تنسيق الزهور في المنزل" className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-full" /><div className="p-6 sm:p-8"><span className="text-[10px] font-black tracking-[0.15em] text-[#536259]">تنسيق المنزل · ٤ دقائق</span><h3 className="mt-4 font-display text-3xl font-bold leading-tight">كيف تختارين الزهرة التي تشبهك؟</h3><p className="mt-4 text-sm leading-6 text-[#536259]">دليل صغير يساعدك على خلق تنسيق يعكس مزاجك ومساحتك.</p><a href="#journal" className="mt-8 inline-flex items-center gap-2 text-sm font-black text-[#193c2c]">اقرئي القصة <ArrowLeft className="h-4 w-4" /></a></div></div></article><article className="group overflow-hidden rounded-[28px] bg-[#ffc8ba]"><img src="https://images.unsplash.com/photo-1455659817273-f96807779a8a?auto=format&fit=crop&w=800&q=90" alt="زهور بألوان باستيل" className="aspect-[1.65] w-full object-cover transition duration-500 group-hover:scale-105" /><div className="p-6"><span className="text-[10px] font-black tracking-[0.15em] text-[#73534e]">العناية · دقيقتان</span><h3 className="mt-3 font-display text-2xl font-bold leading-tight">سرّ عمر أطول لزهورك الصناعية</h3><a href="#journal" className="mt-7 inline-flex items-center gap-2 text-sm font-black text-[#193c2c]">تعلّمي أكثر <ArrowLeft className="h-4 w-4" /></a></div></article></div></div></section>

        <section className="bg-[#f3dfbd] py-16"><div className="container"><div className="grid items-center gap-7 md:grid-cols-[1fr_auto]"><div><span className="text-xs font-black tracking-[0.18em] text-[#8b6248]">رسائل صغيرة، أثر كبير</span><h2 className="mt-3 max-w-[550px] font-display text-3xl font-bold tracking-[-0.04em] sm:text-4xl">خلي نَبْتة تزهر في بريدك.</h2><p className="mt-3 text-sm leading-6 text-[#735c4a]">إلهام منزلي، وصول مبكر للتشكيلات، وخصم ١٠٪ على أول طلب.</p></div><form onSubmit={(event) => { event.preventDefault(); toast.success("أهلاً بك في نادي نَبْتة", { description: "تحققي من بريدك لتفعيل الخصم." }); }} className="flex w-full max-w-[470px] gap-2 rounded-full bg-[#fffdf8] p-2 shadow-sm"><input required type="email" placeholder="بريدك الإلكتروني" className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-[#9b8a77]" aria-label="البريد الإلكتروني" /><button className="rounded-full bg-[#193c2c] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#285642]">انضمي الآن</button></form></div></div></section>
      </main>

      <footer className="bg-[#193c2c] py-12 text-[#f7f3ec]"><div className="container"><div className="grid gap-10 border-b border-white/15 pb-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]"><div><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-[15px] bg-[#d6e67e] text-[#193c2c]"><Leaf className="h-5 w-5" /></span><span className="font-display text-2xl font-bold">نَبْتة</span></div><p className="mt-5 max-w-[250px] text-sm leading-6 text-[#b1c0b4]">زهور مصمّمة لتبقى، وذكريات صغيرة تستحق أن تزهر كل يوم.</p></div><div><h3 className="text-sm font-bold text-[#d6e67e]">تسوّقي</h3><div className="mt-4 grid gap-3 text-sm text-[#c0cec3]"><a href="#shop" className="hover:text-white">كل المنتجات</a><a href="#collection" className="hover:text-white">حسب الخامة</a><a href="#shop" className="hover:text-white">الأكثر مبيعاً</a></div></div><div><h3 className="text-sm font-bold text-[#d6e67e]">نساعدك</h3><div className="mt-4 grid gap-3 text-sm text-[#c0cec3]"><a href="#story" className="hover:text-white">عن نَبْتة</a><a href="#journal" className="hover:text-white">مجلة نَبْتة</a><a href="#top" className="hover:text-white">تواصلي معنا</a></div></div><div><h3 className="text-sm font-bold text-[#d6e67e]">خدمة تشبهك</h3><div className="mt-4 flex items-start gap-3 text-sm text-[#c0cec3]"><Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#ffb09e]" /><p className="leading-6">شحن سريع وتغليف يليق بالهدية، إلى كل مدن المملكة.</p></div><div className="mt-4 flex items-center gap-2 text-xs text-[#c0cec3]"><Check className="h-4 w-4 text-[#d6e67e]" /> استبدال سهل خلال ٧ أيام</div></div></div><div className="flex flex-col justify-between gap-3 pt-6 text-xs text-[#8fa295] sm:flex-row"><span>© ٢٠٢٦ نَبْتة. صُنع ليبقى.</span><span>دُمتِ مزهرة أينما كنتِ.</span></div></div></footer>

      {cartOpen && <div className="fixed inset-0 z-50"><button className="absolute inset-0 bg-[#193c2c]/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} aria-label="إغلاق السلة" /><aside className="absolute bottom-0 right-0 top-0 flex w-full max-w-[440px] flex-col bg-[#f7f3ec] p-5 shadow-2xl sm:p-7"><div className="flex items-center justify-between border-b border-[#20352a]/10 pb-5"><div><span className="text-xs font-black tracking-[0.15em] text-[#d86655]">سلة نَبْتة</span><h2 className="mt-1 font-display text-3xl font-bold">اختياراتك</h2></div><button onClick={() => setCartOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-[#20352a]/10" aria-label="إغلاق"><X className="h-5 w-5" /></button></div><div className="flex-1 overflow-y-auto py-5">{cart.length ? <div className="grid gap-4">{cart.map((item) => <div key={item.id} className="flex gap-3 rounded-2xl bg-white p-3"><img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl object-cover" /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><span className="text-[10px] font-black text-[#d86655]">{item.material}</span><h3 className="mt-1 truncate text-sm font-bold">{item.name}</h3></div><strong className="text-sm">{money(item.price * item.quantity)}</strong></div><div className="mt-3 flex items-center gap-2"><button onClick={() => changeQuantity(item.id, -1)} className="grid h-7 w-7 place-items-center rounded-full bg-[#f0ece5]" aria-label="تقليل الكمية"><Minus className="h-3 w-3" /></button><span className="w-4 text-center text-xs font-bold">{item.quantity}</span><button onClick={() => changeQuantity(item.id, 1)} className="grid h-7 w-7 place-items-center rounded-full bg-[#dce9b1]" aria-label="زيادة الكمية"><Plus className="h-3 w-3" /></button></div></div></div>)}</div> : <div className="grid h-full place-items-center text-center"><div><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#dce9b1]"><ShoppingBag className="h-6 w-6" /></div><h3 className="mt-5 font-display text-2xl font-bold">سلتك تنتظر زهرتها الأولى</h3><p className="mt-2 text-sm text-[#6b766f]">اختاري قطعة تضيف حياة إلى مساحتك.</p><button onClick={() => { setCartOpen(false); scrollToShop(); }} className="mt-6 rounded-full bg-[#193c2c] px-5 py-3 text-sm font-bold text-white">تصفّحي المنتجات</button></div></div>}</div>{cart.length > 0 && <div className="border-t border-[#20352a]/10 pt-5"><div className="mb-4 flex items-center justify-between text-sm"><span className="text-[#6b766f]">المجموع الفرعي</span><strong className="text-xl">{money(cartTotal)}</strong></div><button onClick={() => toast("الدفع الإلكتروني قادم قريباً", { description: "يمكنك حالياً إتمام الطلب عبر واتساب." })} className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#193c2c] text-sm font-bold text-white transition hover:bg-[#285642]">إتمام الطلب <ArrowLeft className="h-4 w-4" /></button><p className="mt-3 text-center text-[10px] text-[#8b968e]">الدفع الآمن متاح قريباً · شحن مجاني فوق ٢٥٠ ر.س</p></div>}</aside></div>}
    </div>
  );
}
