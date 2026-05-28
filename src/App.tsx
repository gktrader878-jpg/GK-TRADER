import React, { useState, useEffect } from 'react';
import { 
  Car, Box, Zap, Home, Settings, Hammer, Phone, Mail, MapPin, 
  User, Award, CheckCircle2, ArrowRight, ShieldCheck, Layers, 
  Flame, ChevronRight, ExternalLink, Factory, PhoneCall, Check,
  Clock, Package, FileText, Download, Building2, HelpCircle, ArrowUpRight,
  Loader2, X
} from 'lucide-react';

// Materials specifications for the interactive Material & Process Assistant
interface MaterialSpec {
  name: string;
  fullName: string;
  strength: 'Medium-Low' | 'Medium' | 'Medium-High' | 'High' | 'Very High';
  shrinkage: string;
  mouldingTemp: string;
  grindingFeasibility: 'Perfect' | 'Excellent' | 'Very Good' | 'Good' | 'Moderate';
  bestFor: string;
  description: string;
}

const materialDataset: MaterialSpec[] = [
  {
    name: 'ABS',
    fullName: 'Acrylonitrile Butadiene Styrene',
    strength: 'Medium-High',
    shrinkage: '0.4% - 0.7%',
    mouldingTemp: '200°C - 240°C',
    grindingFeasibility: 'Excellent',
    bestFor: 'Automotive internal logs, heavy housings, domestic electronic casings, rigid components.',
    description: 'Highly versatile polymer with exceptional mechanical toughness, impact resistance, and superb dimensional stability.'
  },
  {
    name: 'PP',
    fullName: 'Polypropylene',
    strength: 'Medium',
    shrinkage: '1.5% - 2.0%',
    mouldingTemp: '200°C - 280°C',
    grindingFeasibility: 'Very Good',
    bestFor: 'Industrial crates, automotive bumpers, shipping containers, flexible closures, battery tubs.',
    description: 'An economical semi-crystalline polymer with high fatigue resistance, chemical durability, and supreme tensile elasticity.'
  },
  {
    name: 'PC',
    fullName: 'Polycarbonate',
    strength: 'High',
    shrinkage: '0.5% - 0.7%',
    mouldingTemp: '280°C - 320°C',
    grindingFeasibility: 'Good',
    bestFor: 'Heavy-duty safety goggles, flame-retardant electrical barriers, protective panels, structural gears.',
    description: 'An engineering thermoplastic boasting near-optical transparency, extreme high heat resistance, and structural impact strength.'
  },
  {
    name: 'Nylon 6',
    fullName: 'Polyamide 6 (PA 6)',
    strength: 'Very High',
    shrinkage: '0.8% - 1.5%',
    mouldingTemp: '230°C - 280°C',
    grindingFeasibility: 'Good',
    bestFor: 'High-stress structural brackets, mechanical rollers, high-torque gears, structural automotive mounts.',
    description: 'Boasts phenomenal wear resistance, low coefficient of friction, high flexural strength, and thermal sustainability.'
  },
  {
    name: 'HDPE',
    fullName: 'High-Density Polyethylene',
    strength: 'Medium-Low',
    shrinkage: '1.8% - 2.5%',
    mouldingTemp: '180°C - 220°C',
    grindingFeasibility: 'Perfect',
    bestFor: 'Chemical containers, thick-wall pipes, heavy-duty B2B containers, custom storage drums.',
    description: 'Lightweight yet highly damage-resistant, providing excellent moisture vapor barriers and chemical inertness.'
  },
  {
    name: 'POM',
    fullName: 'Polyacetal (Delrin)',
    strength: 'High',
    shrinkage: '1.8% - 2.2%',
    mouldingTemp: '190°C - 215°C',
    grindingFeasibility: 'Moderate',
    bestFor: 'High precision engineering gears, fuel filter valves, low-wear slide pads, functional fasteners.',
    description: 'Highly crystalline thermoplastic characterized by high stiffness, dimensional stability, and dry frictional properties.'
  }
];

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  polymer: string;
  weight: string;
  dimensions: string;
  application: string;
  cycleTime: string;
  cavities: string;
  clampingForce: string;
  gateStyle: string;
  regrindedFeasibility: string;
  description: string;
}

const productsDataset: Product[] = [
  {
    id: "SSE-RNG-06",
    name: "Multi-Ring Collar Bushing Sprue",
    category: "Sprues & Runners",
    image: "/src/assets/images/sse_multiring_sprue_1779946503930.png",
    polymer: "POM (Polyacetal / Delrin)",
    weight: "28g (Total tree) / 4.2g (Per individual ring)",
    dimensions: "Outer Ø 22mm, Inner Ø 14mm, Depth 8mm",
    application: "Mechanical spacer rings, pivot bushes, low-friction sleeve bearings for consumer products.",
    cycleTime: "18.5 seconds",
    cavities: "6-Cavity Cold Runner (Sub-gated)",
    clampingForce: "80 Tonnes High-Speed Injection",
    gateStyle: "Submarine (Self-shearing)",
    regrindedFeasibility: "Excellent (Supports up to 20% recycled regrind blend)",
    description: "An efficiently nested 6-cavity moulding tree delivering extremely low-tolerance collar bushings. Engineered with precision runner balancing to prevent unbalanced cavity pack, assuring identical part density across all 6 segments of the runner structure."
  },
  {
    id: "SSE-IMP-44",
    name: "High-Precision Radial Gear Impeller",
    category: "Gears & Impellers",
    image: "/src/assets/images/sse_gear_impeller_1779946524326.png",
    polymer: "PA6 (Polyamide / Nylon 6) + 15% Glass Fiber reinforcing",
    weight: "12.5g",
    dimensions: "Outer Ø 56mm, Central Bore Ø 8.05mm, 36 radial vanes",
    application: "Cooling rotor impellers, fluid fuel pump vanes, and rotary gear fan hubs.",
    cycleTime: "22.0 seconds",
    cavities: "2-Cavity Hot Tip Sprue",
    clampingForce: "120 Tonnes Micro-Control Hydraulic",
    gateStyle: "Direct Valve Pin-point Hot runner",
    regrindedFeasibility: "Very Good (Requires moisture pre-conditioning if regrind blended)",
    description: "High-spec mechanical impeller requiring near-perfect concentricity to prevent vibrational fatigue at 4,500 RPM. The 15% glass reinforcement increases tensile modulus and stiffness, while strict heat-cycling controls avoid sink marks on the 36 individual high-aspect ratio fins."
  },
  {
    id: "SSE-BRK-12",
    name: "Heavy-Duty Slider Guide Bracket",
    category: "Clips & Mounts",
    image: "/src/assets/images/sse_nylon_bracket_1779946543951.png",
    polymer: "ABS (Acrylonitrile Butadiene Styrene) - High Impact",
    weight: "19.8g",
    dimensions: "48mm Length x 32mm Width x 15mm Height",
    application: "Internal drawer sliders, wiring harness cable guide channels, and automobile trunk clip housings.",
    cycleTime: "24.5 seconds",
    cavities: "4-Cavity Balanced Runner Layout",
    clampingForce: "150 Tonnes Toggle Clamp",
    gateStyle: "Tunnel/Edge gate with auto runner drop",
    regrindedFeasibility: "Excellent (Tested at 25% regrind ratio with zero tensile impact drop)",
    description: "Designed for intensive lateral friction environments. Moulded under specific holding pressure profile to ensure maximum polymer pack and zero internal voiding, maintaining heavy load bearing structural capacity."
  },
  {
    id: "SSE-VIA-08",
    name: "Hinged Micro-Vial & Fluidic Vessel",
    category: "Vials & Containers",
    image: "/src/assets/images/sse_blue_vial_1779946561789.png",
    polymer: "Medical-Grade Ultra-Clear Polypropylene (PP)",
    weight: "1.8g",
    dimensions: "Ø 12mm Chamber x 34mm Length (0.8 mL liquid capacity)",
    application: "Industrial storage vials, chemical specimen collection, and aerospace fluid pods.",
    cycleTime: "14.0 seconds",
    cavities: "16-Cavity Ultra-Modular Plate",
    clampingForce: "110 Tonnes All-Electric High Precision",
    gateStyle: "Pin-point submarine under-gate",
    regrindedFeasibility: "Perfect (Virgin grade only for medical certification, 100% regrindable for standard use)",
    description: "A dual-chamber body and lid moulded in a single stroke with a living hinge. Superb living-hinge tooling design enables the PP flow to fuse beautifully across the thin 0.3mm bending section, surviving over 10,000 flexing opening/closing operations."
  },
  {
    id: "SSE-GRM-03",
    name: "Stepped Collar Bushing & Dust Cap Set",
    category: "Caps & Grommets",
    image: "/src/assets/images/sse_grommets_caps_1779946576291.png",
    polymer: "LDPE / Flexible Polypropylene",
    weight: "2.4g (Average component weight)",
    dimensions: "Suits bore seating diameters from 12mm to 28mm",
    application: "Automotive chassis dust barriers, hydraulic line protective plugs, screw sleeve caps.",
    cycleTime: "12.5 seconds",
    cavities: "8-Cavity Family Plate",
    clampingForce: "85 Tonnes High Speed",
    gateStyle: "Sub-gate direct",
    regrindedFeasibility: "Perfect (Supports multi-cycle grinding without chain degradation)",
    description: "An array of custom sealing caps and plug sleeves. Manufactured using low-clamping pressures to maintain elastic tolerances and perfect seal wall compliance, avoiding split parting-line flashes on thin circular borders."
  },
  {
    id: "SSE-DSL-88",
    name: "High-Temp Silicone Diaphragm Seal",
    category: "Seals & Gaskets",
    image: "/src/assets/images/sse_red_seal_1779946596984.png",
    polymer: "LSR (Liquid Silicone Rubber) / Soft TPU",
    weight: "8.4g",
    dimensions: "Ø 85mm Outer Rim x 6mm Deep profile, 1.2mm center diaphragm",
    application: "High-pressure fluid pump gaskets, valve diaphragms, expansion lids.",
    cycleTime: "28.0 seconds",
    cavities: "1-Cavity Overmoulding / Compression-Injection",
    clampingForce: "100 Tonnes Vacuum Valve Press",
    gateStyle: "Direct central sprue dome gate",
    regrindedFeasibility: "None (Thermosetting rubber structure)",
    description: "Specialized flexible membrane seal molded using precision heat-activated liquid injection moulds. Delivers outstanding thermal stability and fluid proofing, preventing pressure drop-down across cyclic pneumatic systems."
  }
];

export default function App() {
  // Navigation scrolling indicator
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Products Gallery States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productFilter, setProductFilter] = useState<string>("All");

  // Interactive Material Assistant Selection
  const [selectedSpec, setSelectedSpec] = useState<MaterialSpec>(materialDataset[0]);

  // Form states and submission trackers
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    service: 'Plastic Grinding',
    quantity: '',
    material: 'ABS Thermoplastic',
    timeline: '',
    description: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [lastSubmissionRef, setLastSubmissionRef] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Offset for navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    // Front-end Validation
    if (!formData.name.trim() || !formData.company.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.service.trim() || !formData.description.trim()) {
      setSubmitError("Please fill out all required fields.");
      return;
    }

    if (formData.description.trim().length < 10) {
      setSubmitError("Please provide a more detailed project description (minimum 10 characters).");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setSubmitError("Please enter a valid corporate email address.");
      return;
    }

    // Phone validation
    const digitsOnly = formData.phone.replace(/[^\d]/g, "");
    if (digitsOnly.length < 10) {
      setSubmitError("Please enter a valid numeric phone number with at least 10 digits.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rfq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          company: formData.company.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          service: formData.service,
          quantity: formData.quantity.trim(),
          timeline: formData.timeline.trim(),
          description: formData.description.trim()
        })
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        setSubmitSuccess("Thank you! We'll contact you within 24 hours.");
        setLastSubmissionRef(resData.rfq?.id || `RFQ-${Math.floor(100 + Math.random() * 900)}`);
        setIsSubmitted(true);
        scrollToSection('rfq-section');
      } else {
        setSubmitError(resData.error || "Something went wrong. Please call us directly.");
      }
    } catch (err: any) {
      console.error("Failed to submit RFQ:", err);
      setSubmitError("Something went wrong. Please call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      company: '',
      phone: '',
      email: '',
      service: 'Plastic Grinding',
      quantity: '',
      material: 'ABS Thermoplastic',
      timeline: '',
      description: ''
    });
    setIsSubmitted(false);
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  return (
    <div className="font-sans min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* 1. FIXED GLASSMORPHIC NAVIGATION BAR */}
      <nav 
        id="navbar-app" 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-[#0a192f] backdrop-blur-md border-b border-blue-600/30 py-3 shadow-xl' 
            : 'bg-[#0a192f]/90 backdrop-blur-sm py-5 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Company Badge / Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative flex items-center justify-center bg-gradient-to-br from-blue-700 to-blue-900 border-2 border-slate-300 text-white font-condensed font-black text-2xl tracking-tighter w-14 h-11 shadow-inner rounded-l-md rounded-r-[15px]">
              SSE
              <span className="absolute -bottom-1 -right-1 text-[7px] px-1 bg-blue-600 font-sans font-bold uppercase tracking-widest text-white border border-[#0a192f] rounded-sm">
                PUNE
              </span>
            </div>
            <div className="leading-tight">
              <span className="block text-lg font-condensed font-extrabold tracking-wide text-white uppercase hover:text-blue-400 transition-colors duration-200">
                SHREE SAI ENTERPRISES
              </span>
              <span className="block text-[9px] text-blue-400 font-condensed font-medium tracking-widest uppercase">
                Unit: II Jyotirling Prasanna II
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 font-condensed tracking-wide">
            <button 
              onClick={() => scrollToSection('about-section')} 
              className="text-slate-300 hover:text-white pb-1 border-b-2 border-transparent hover:border-blue-400 transition-all text-sm uppercase font-semibold"
            >
              About Us
            </button>
            <button 
              onClick={() => scrollToSection('services-section')} 
              className="text-slate-300 hover:text-white pb-1 border-b-2 border-transparent hover:border-blue-400 transition-all text-sm uppercase font-semibold"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('materials-section')} 
              className="text-slate-300 hover:text-white pb-1 border-b-2 border-transparent hover:border-blue-400 transition-all text-sm uppercase font-semibold"
            >
              Material Specs
            </button>
            <button 
              onClick={() => scrollToSection('products-section')} 
              className="text-slate-300 hover:text-white pb-1 border-b-2 border-transparent hover:border-blue-400 transition-all text-sm uppercase font-semibold"
            >
              Products Showcase
            </button>
            <button 
              onClick={() => scrollToSection('industries-section')} 
              className="text-slate-300 hover:text-white pb-1 border-b-2 border-transparent hover:border-blue-400 transition-all text-sm uppercase font-semibold"
            >
              Industries
            </button>
          </div>

          {/* Get a Quote CTA Button */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => scrollToSection('rfq-section')}
              className="relative inline-flex items-center justify-center bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-condensed font-bold tracking-wider text-xs uppercase px-5 py-2.5 rounded-md border border-blue-400/30 shadow-lg shadow-blue-950/30 transition-transform active:scale-95 group"
            >
              Get a Quote
              <ArrowRight className="ml-1.5 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header id="hero-section" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-16 bg-[#040e1c]">
        
        {/* Absolute Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/images/moulding_hero_1779876549510.png" 
            alt="Moulding Machine background" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-40 scale-105 transform hover:scale-100 transition-transform duration-10000"
          />
          {/* Master Gradients for industrial ambiance */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#040e1c] via-[#040e1c]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#040e1c] via-transparent to-[#040e1c]/80"></div>
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#040e1c]/50 to-[#040e1c]"></div>
          {/* Grid absolute decorative backdrop overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700/10 via-blue-900/5 to-transparent"></div>
        </div>

        {/* Hero Elements */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12 w-full">
          
          <div className="max-w-3xl space-y-8 flex-1">
            <div className="inline-flex items-center space-x-2 bg-blue-600/10 border border-blue-500/30 px-3 py-1.5 rounded text-xs font-semibold text-blue-300 uppercase tracking-widest animate-pulse">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>An ISO Compliant Manufacturing Suite</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-condensed font-black tracking-tight leading-none text-white uppercase">
                <span className="block text-blue-400 text-lg sm:text-2xl font-semibold tracking-widest mb-2 font-sans">
                  PRECISION PLASTIC MANUFACTURING YOU CAN TRUST
                </span>
                MOULDED TO PERFORM.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-200">
                  BUILT TO LAST.
                </span>
              </h1>
              
              <p className="text-lg text-slate-300 font-normal leading-relaxed max-w-2xl border-l-4 border-blue-500 pl-4 py-1">
                Shree Sai Enterprises (SSE) is Pune’s premier B2B plastic contract manufacturer. 
                We specialize in all types of <span className="text-white font-semibold">Plastic Grinding Works</span> &amp; heavy-duty <span className="text-white font-semibold">Injection Moulding</span>, executing your high-capacity industrial scale runs with unmatched precision and reliability.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <button 
                onClick={() => scrollToSection('rfq-section')}
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-950 text-white font-condensed font-bold tracking-wider text-sm uppercase px-8 py-4 rounded shadow-2xl shadow-blue-950/40 transform hover:-translate-y-1 transition-all flex items-center gap-2 group cursor-pointer"
              >
                Request a Quote
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button 
                onClick={() => scrollToSection('services-section')}
                className="bg-transparent hover:bg-white/5 border-2 border-slate-600 hover:border-slate-300 text-white font-condensed font-bold tracking-wider text-sm uppercase px-8 py-3.5 rounded transition-all flex items-center gap-2 cursor-pointer"
              >
                Our Services
              </button>
            </div>
            
            {/* Quick trust badges from industrial partners */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-x-6 gap-y-3 justify-center md:justify-start text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-blue-400" /> 100% Quality Assurance</span>
              <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-blue-400" /> State-of-the-art Machinery</span>
              <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-blue-400" /> Polypropylene, ABS, PC, Nylon expertise</span>
            </div>
          </div>
        </div>

        {/* Industrial Section Wave Separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] text-slate-50 fill-current">
            <path d="M1200 120L0 120 309.75 0 1200 120Z" className="fill-slate-50"></path>
          </svg>
        </div>
      </header>

      {/* 3. ABOUT SECTION */}
      <section id="about-section" className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center md:text-left mb-16 space-y-3">
            <div className="inline-flex items-center space-x-2 text-blue-700 font-condensed font-bold uppercase tracking-widest text-sm">
              <span>ESTABLISHED MANUFACTURER</span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
              <span>BHOSARI PUNE</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-condensed font-black text-slate-900 uppercase tracking-tight border-l-4 border-blue-600 pl-4">
              PROUD LEADERSHIP IN <span className="text-blue-700">CUSTOM THERMOPLASTICS</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Description + Highlight Cards */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-condensed font-bold uppercase text-slate-800">
                  SHREE SAI ENTERPRISES: ENGINEERING PRECISION PATHWAY
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Located strategically in the high-density industrial hub of <strong>Bhosari, Pune</strong>, Shree Sai Enterprises has built a powerful foundation of manufacturing integrity. We specialize actively in turning post-industrial secondary waste polymers back into high-fidelity polymer pellets and compounding stock while powering high-throughput injection moulding pipelines.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Whether you require clean technical regrinds of advanced glass-filled polymers or rapid-run injection services for custom machinery casing parts, our workshop operates under rigorous quality controls, offering B2B industrial partnerships customized reliability, optimized mold lifespans, and low wastage rates.
                </p>
              </div>

              {/* 3 Highlight Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-white border border-slate-200 p-5 rounded shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-300 group border-t-2 border-t-blue-600">
                  <div className="bg-slate-50 w-12 h-12 flex items-center justify-center rounded mb-4 border border-slate-100 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                    <Factory className="w-6 h-6 text-blue-600 group-hover:text-white" />
                  </div>
                  <h4 className="font-condensed font-bold text-lg text-slate-950 uppercase tracking-wide group-hover:text-blue-700 transition-all">
                    Plastic Grinding
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Custom mechanical grinding of PP, ABS, PC, Nylon and raw poly feedstocks to precise mesh chips.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-300 group border-t-2 border-t-blue-700">
                  <div className="bg-slate-50 w-12 h-12 flex items-center justify-center rounded mb-4 border border-slate-100 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                    <Layers className="w-6 h-6 text-blue-600 group-hover:text-white" />
                  </div>
                  <h4 className="font-condensed font-bold text-lg text-slate-950 uppercase tracking-wide group-hover:text-blue-700 transition-all">
                    Injection Moulding
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Precision engineering for custom parts, robust mold testing, insert moulding, and micro-clamping steps.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-300 group border-t-2 border-t-blue-800">
                  <div className="bg-slate-50 w-12 h-12 flex items-center justify-center rounded mb-4 border border-slate-100 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                    <ShieldCheck className="w-6 h-6 text-blue-600 group-hover:text-white" />
                  </div>
                  <h4 className="font-condensed font-bold text-lg text-slate-950 uppercase tracking-wide group-hover:text-blue-700 transition-all">
                    Quality Assurance
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Comprehensive stress tolerance screening, flawless wall thickness testing, and precise density checks.
                  </p>
                </div>

              </div>
            </div>

            {/* Right Column: Dark Navy Contact Card */}
            <div className="lg:col-span-4 w-full">
              <div className="relative overflow-hidden bg-gradient-to-b from-[#0a192f] to-[#040e1c] border-2 border-blue-500/30 p-8 rounded shadow-2xl space-y-8 flex flex-col justify-between border-t-4 border-t-blue-600">
                
                {/* Decorative Spark Badge */}
                <div className="absolute top-0 right-0 h-28 w-28 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full pointer-events-none"></div>
                <div className="absolute -bottom-8 -left-8 h-32 w-32 bg-blue-600/5 rounded-full blur-2xl pointer-events-none"></div>

                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-5">
                    <div className="inline-block bg-blue-600 text-white font-condensed font-black tracking-widest text-[10px] px-2.5 py-1 uppercase rounded-sm mb-3">
                      OFFICIAL BUSINESS CONTACTS
                    </div>
                    <h3 className="text-3xl font-condensed font-black tracking-wide text-white uppercase">
                      SHREE SAI ENTERPRISES
                    </h3>
                    <p className="text-xs text-blue-400 uppercase tracking-wide font-medium mt-1">
                      UNIT II: II JYOTIRLING PRASANNA II
                    </p>
                  </div>

                  {/* Owner info */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-600/10 border border-blue-500/20 p-2.5 rounded mt-1 shrink-0">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">PROPRIETOR &amp; MOULDING CHIEF</p>
                      <p className="text-xl font-bold text-white tracking-wide">Mr. Sampat S. Kumbhar</p>
                      <p className="text-xs text-blue-400">Over 2 Decades of Thermal Polymers Stewardship</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <a href="tel:+917507126049" className="flex items-start space-x-4 p-2 -mx-2 hover:bg-white/5 rounded transition-all group">
                    <div className="bg-blue-950 border border-blue-900 p-2.5 rounded mt-1 shrink-0 group-hover:border-blue-400 transition-all">
                      <Phone className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">DIRECT MOBILE LINE</p>
                      <p className="text-lg font-bold text-white tracking-wide group-hover:text-blue-400 transition-all">
                        +91 75071 26049
                      </p>
                      <p className="text-xs text-slate-400">Call for immediate grinding and logistics assistance</p>
                    </div>
                  </a>

                  {/* Email */}
                  <a href="mailto:sampatskumbhar@gmail.com" className="flex items-start space-x-4 p-2 -mx-2 hover:bg-white/5 rounded transition-all group">
                    <div className="bg-blue-950 border border-blue-900 p-2.5 rounded mt-1 shrink-0 group-hover:border-blue-400 transition-all">
                      <Mail className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">OFFICIAL EMAIL</p>
                      <p className="text-white font-medium group-hover:text-blue-400 transition-all">
                        sampatskumbhar@gmail.com
                      </p>
                      <p className="text-xs text-slate-400">Send custom mold blueprints &amp; PDF datasheets</p>
                    </div>
                  </a>

                  {/* Address */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-950 border border-blue-900 p-2.5 rounded mt-1 shrink-0">
                      <MapPin className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">FACTORY ADDRESS</p>
                      <p className="text-sm text-slate-200 leading-relaxed font-medium">
                        Sr. No. 71/1, Shiv Ganesh Nagar, Sopan Dhawade Marg, Dhawade Wasti, Bhosari, Pune – 411 039
                      </p>
                      <p className="text-[11px] text-blue-400 mt-1 uppercase font-semibold tracking-wider">Maharashtra, India</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                  <a 
                    href="https://wa.me/917507126049" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-condensed font-bold uppercase tracking-wider text-xs py-3 px-4 rounded text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                    WhatsApp Chat
                  </a>
                  <a 
                    href="https://maps.google.com/?q=Sr.+No.+71/1,+Shiv+Ganesh+Nagar,+Sopan+Dhawade+Marg,+Dhawade+Wasti,+Bhosari,+Pune+411039"
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-condensed font-bold uppercase tracking-wider text-xs py-3 px-4 rounded text-center flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Navigate to SSE
                  </a>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. SERVICES SECTION */}
      <section id="services-section" className="py-24 bg-slate-100 relative">
        {/* Dynamic ambient lights */}
        <div className="absolute right-0 top-1/4 h-96 w-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <div className="inline-flex items-center space-x-2 text-blue-700 font-condensed font-bold uppercase tracking-widest text-sm">
              <span className="w-6 h-[1px] bg-blue-600"></span>
              <span>SPECIALIZED PORTFOLIO</span>
              <span className="w-6 h-[1px] bg-blue-600"></span>
            </div>
            <h2 className="text-3xl md:text-5xl font-condensed font-black text-slate-900 uppercase tracking-tight border-b-2 border-blue-600 pb-4 inline-block">
              CORE MANUFACTURING CAPABILITIES
            </h2>
            <p className="text-slate-600 font-normal leading-relaxed text-sm md:text-base pt-2">
              Shree Sai Enterprises offers unmatched specialized facilities tailored for secondary polymer refining and industrial continuous moulding runs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* SERVICE CARD 1: PLASTIC GRINDING */}
            <div className="flex flex-col bg-white border border-slate-200/85 hover:border-blue-500 p-8 rounded shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border-t-4 border-t-blue-600">
              <div className="bg-slate-50 w-14 h-14 rounded flex items-center justify-center border border-slate-100 mb-6 group-hover:bg-blue-600 transition-all duration-300">
                <Settings className="w-7 h-7 text-blue-600 group-hover:text-white animate-spin-slow" />
              </div>
              
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-condensed font-bold uppercase text-slate-900 tracking-wide group-hover:text-blue-700 transition-all">
                  Plastic Grinding Works
                </h3>
                
                <div className="relative h-44 rounded overflow-hidden my-4 border border-slate-100">
                  <img 
                    src="/src/assets/images/plastic_grinding_1779876570097.png" 
                    alt="Plastic regrinds raw feedstock" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                  <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-black font-condensed">
                    Processing Depot
                  </span>
                </div>

                <p className="text-sm text-slate-650 leading-relaxed">
                  We crush, shred, and granulate all types of post-industrial polymer waste, surplus parts, and extruder runners into pristine, highly reusable polymer flakes. Utilizing high-strength rotating blades, we ensure contaminant-free, uniform sizing.
                </p>

                <div className="space-y-4 pt-4 border-t border-slate-100 font-sans">
                  <div>
                    <h4 className="text-[11px] uppercase font-bold text-blue-700 tracking-wider mb-1">Processed Materials:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {['PP (Polypropylene)', 'ABS Thermoplastic', 'HDPE Regrind', 'LDPE', 'Polycarbonate', 'Nylon 6'].map(tag => (
                        <span key={tag} className="bg-slate-50 border border-slate-200 text-slate-700 text-[10px] px-2.5 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] uppercase font-bold text-blue-700 tracking-wider mb-1">Grinding Capabilities:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {['Rotary Pulverisation', 'Linear Deshredding', 'Metal-Detect Separation', 'Dust Extraction Screening'].map(tag => (
                        <span key={tag} className="bg-blue-50/60 text-blue-700 border border-blue-200/50 text-[10px] px-2 py-0.5 rounded font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <button 
                  onClick={() => scrollToSection('rfq-section')}
                  className="w-full bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white font-condensed font-bold uppercase tracking-wider text-xs py-3 rounded border border-slate-200 hover:border-blue-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Book Grinding Lot <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SERVICE CARD 2: INJECTION MOULDING */}
            <div className="flex flex-col bg-white border border-slate-200/85 hover:border-blue-500 p-8 rounded shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border-t-4 border-t-blue-700">
              <div className="bg-slate-50 w-14 h-14 rounded flex items-center justify-center border border-slate-100 mb-6 group-hover:bg-blue-600 transition-all duration-300">
                <Layers className="w-7 h-7 text-blue-600 group-hover:text-white" />
              </div>
              
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-condensed font-bold uppercase text-slate-900 tracking-wide group-hover:text-blue-700 transition-all">
                  Injection Moulding
                </h3>
                
                <div className="relative h-44 rounded overflow-hidden my-4 border border-slate-100 bg-slate-50">
                  <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
                    {/* SVG placeholder illustration of premium moulding clamp */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent z-10"></div>
                    <div className="relative z-20 flex flex-col items-center justify-center text-center p-4">
                      <Layers className="w-12 h-12 text-blue-600 mb-2" />
                      <span className="font-condensed font-black text-slate-900 text-sm uppercase tracking-widest">CLAMPS &amp; PRESSES</span>
                      <span className="text-[10px] text-slate-500 max-w-[200px]">Micro-controlled molten polymer continuous injectors.</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                  <span className="absolute bottom-2 left-2 bg-blue-700 text-white text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-black font-condensed">
                    Industrial Presses
                  </span>
                </div>

                <p className="text-sm text-slate-650 leading-relaxed">
                  We mold custom polymer parts ranging from complex structural components to commercial housings. Equipped with reliable multi-ton clamp moulding machines, we accommodate short testing prototypes as well as rapid 24/7 client production cycles.
                </p>

                <div className="space-y-4 pt-4 border-t border-slate-100 font-sans">
                  <div>
                    <h4 className="text-[11px] uppercase font-bold text-blue-700 tracking-wider mb-1">Engineered Polymers:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {['Polycarbonate (PC)', 'Polyamide (Nylon 66)', 'Polyacetal (POM)', 'PBT Compounds', 'Aesthetic Acrylic'].map(tag => (
                        <span key={tag} className="bg-slate-50 border border-slate-200 text-slate-700 text-[10px] px-2.5 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] uppercase font-bold text-blue-700 tracking-wider mb-1">Moulding Specs:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {['Insert Overmoulding', 'Internal Screwing Threads', 'High-Gloss Aesthetics', 'Glass-Filled Compounds'].map(tag => (
                        <span key={tag} className="bg-blue-50/60 text-blue-700 border border-blue-200/50 text-[10px] px-2 py-0.5 rounded font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <button 
                  onClick={() => scrollToSection('rfq-section')}
                  className="w-full bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white font-condensed font-bold uppercase tracking-wider text-xs py-3 rounded border border-slate-200 hover:border-blue-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Book Moulding Run <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SERVICE CARD 3: CONTRACT PROCESSING */}
            <div className="flex flex-col bg-white border border-slate-200/85 hover:border-blue-500 p-8 rounded shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border-t-4 border-t-blue-800">
              <div className="bg-slate-50 w-14 h-14 rounded flex items-center justify-center border border-slate-100 mb-6 group-hover:bg-blue-600 transition-all duration-300">
                <Box className="w-7 h-7 text-blue-600 group-hover:text-white" />
              </div>
              
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-condensed font-bold uppercase text-slate-900 tracking-wide group-hover:text-blue-700 transition-all">
                  Contract Processing
                </h3>
                
                <div className="relative h-44 rounded overflow-hidden my-4 border border-slate-100 bg-slate-50">
                  <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent z-10"></div>
                    <div className="relative z-20 flex flex-col items-center justify-center text-center p-4">
                      <Award className="w-12 h-12 text-blue-650 text-blue-600 mb-2" />
                      <span className="font-condensed font-black text-slate-900 text-sm uppercase tracking-widest">TURNKEY SUPPLY</span>
                      <span className="text-[10px] text-slate-500 max-w-[200px]">Continuous tooling test runs &amp; packing logistics.</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                  <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-black font-condensed">
                    Turnkey B2B
                  </span>
                </div>

                <p className="text-sm text-slate-650 leading-relaxed">
                  Consolidate your entire supply pipeline under SSE. Deliver your custom molds to our Bhosari facility, and our team will execute raw polymer procurement, continuous moulding outputs, quality screening checklists, and sub-assembly packaging.
                </p>

                <div className="space-y-4 pt-4 border-t border-slate-100 font-sans">
                  <div>
                    <h4 className="text-[11px] uppercase font-bold text-blue-700 tracking-wider mb-1">Speciality Support:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {['OEM Sub-Assembly', 'Pre-Compound Mixing', 'Masterbatch Dye Blending', 'Custom Packing'].map(tag => (
                        <span key={tag} className="bg-slate-50 border border-slate-200 text-slate-700 text-[10px] px-2.5 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] uppercase font-bold text-blue-700 tracking-wider mb-1">Logistics Advantages:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {['Just-In-Time (JIT) Trucks', 'Bhosari Hub Location', 'Buffer Feedstock Storage', 'Component Boxing'].map(tag => (
                        <span key={tag} className="bg-blue-50/60 text-blue-700 border border-blue-200/50 text-[10px] px-2 py-0.5 rounded font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <button 
                  onClick={() => scrollToSection('rfq-section')}
                  className="w-full bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white font-condensed font-bold uppercase tracking-wider text-xs py-3 rounded border border-slate-200 hover:border-blue-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Initiate Contract Discussions <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* NEW INTERACTIVE SECTION: MATERIAL EXPERTISE HUB */}
      <section id="materials-section" className="py-24 bg-white border-t border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center md:text-left mb-16 space-y-3">
            <div className="inline-flex items-center space-x-2 text-blue-700 font-condensed font-bold uppercase tracking-widest text-sm">
              <span>B2B PROCUREMENT UTILITY</span>
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              <span>THERMAL SPECS</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-condensed font-black text-slate-900 uppercase tracking-tight border-l-4 border-blue-600 pl-4">
              POLYMER SPECIFICATIONS &amp; GRINDING GUIDE
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl font-normal mt-2">
              Select an industrial raw polymer below to view complex compound behaviors, heating ratings, and regrind compatibility statistics prepared by SSE engineers.
            </p>
          </div>

          <div className="bg-slate-50 border-2 border-slate-200 rounded overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12">
            
            {/* Sidebar Material Chooser */}
            <div className="lg:col-span-4 bg-white border-r border-slate-200 p-6 space-y-2">
              <span className="block text-[11px] font-condensed font-black text-slate-500 uppercase tracking-widest mb-4">
                SELECT PRIMARY RESIN TYPE:
              </span>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 border-slate-200">
                {materialDataset.map(mat => {
                  const isSelected = selectedSpec.name === mat.name;
                  return (
                    <button 
                      key={mat.name}
                      onClick={() => setSelectedSpec(mat)}
                      className={`text-left font-condensed font-bold uppercase tracking-wider px-4 py-3.5 rounded-sm text-sm transition-all flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-gradient-to-r from-blue-700 to-blue-800 text-white border-l-4 border-l-blue-400 shadow-md' 
                          : 'bg-slate-50 text-slate-650 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/50 border-l-4 border-l-transparent'
                      }`}
                    >
                      <span>{mat.name}</span>
                      <span className={`text-[10px] uppercase font-sans font-normal px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-blue-900 text-blue-200 font-semibold' : 'bg-slate-250 bg-slate-200 text-slate-500'
                      }`}>
                        {mat.strength === 'Very High' || mat.strength === 'High' ? 'Engineered' : 'Commodity'}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="hidden lg:block pt-8 text-xs text-slate-550 text-slate-400 text-center">
                Need a custom compound or recycled polymer blend? Let us know in the quote form!
              </div>
            </div>

            {/* Spec Display Dashboard */}
            <div className="lg:col-span-8 p-8 space-y-8 flex flex-col justify-between">
              
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="text-3xl font-condensed font-black tracking-wide text-slate-900 uppercase">
                      {selectedSpec.fullName} &mdash; ({selectedSpec.name})
                    </h3>
                    <p className="text-xs text-blue-750 font-medium uppercase tracking-widest mt-1">
                      Industrial Grade Material Metric Sheet
                    </p>
                  </div>
                  <div className="bg-white border border-slate-200 px-3 py-1.5 rounded text-xs text-slate-700 flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> SSE Certified Processing
                  </div>
                </div>

                <p className="text-slate-650 leading-relaxed text-sm italic">
                  &ldquo;{selectedSpec.description}&rdquo;
                </p>

                {/* Dashboard Metrics Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  
                  <div className="bg-white border border-slate-200 p-4 rounded shadow-sm">
                    <span className="block text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Tensile Strength</span>
                    <span className="text-lg font-condensed font-extrabold text-slate-900 tracking-wide uppercase">
                      {selectedSpec.strength}
                    </span>
                  </div>

                  <div className="bg-white border border-slate-200 p-4 rounded shadow-sm">
                    <span className="block text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Moulding Shrinkage</span>
                    <span className="text-lg font-condensed font-extrabold text-blue-700 tracking-wide">
                      {selectedSpec.shrinkage}
                    </span>
                  </div>

                  <div className="bg-white border border-slate-200 p-4 rounded shadow-sm">
                    <span className="block text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Cylinder Melting Range</span>
                    <span className="text-lg font-condensed font-extrabold text-slate-800 tracking-wide">
                      {selectedSpec.mouldingTemp}
                    </span>
                  </div>

                  <div className="bg-white border border-slate-200 p-4 rounded shadow-sm">
                    <span className="block text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Grinding Feasibility</span>
                    <span className="inline-flex items-center gap-1 text-lg font-condensed font-extrabold text-emerald-600 tracking-wide uppercase">
                      {selectedSpec.grindingFeasibility}
                    </span>
                  </div>

                </div>

                <div className="bg-blue-50/60 border border-blue-200/65 p-5 rounded space-y-2 mt-4 text-sm font-sans">
                  <h4 className="font-condensed font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-blue-600" />
                    RECOMMENDED B2B APPLICATIONS IN PUNE MARKET:
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-xs">
                    {selectedSpec.bestFor}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
                <div className="text-xs text-slate-600">
                  Selected <span className="text-blue-700 font-extrabold">{selectedSpec.name}</span> for your project? Click right to populate this in your RFQ request automatically.
                </div>
                <button 
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      material: `${selectedSpec.name} ${selectedSpec.fullName}`,
                      description: `Interested in evaluating contract runs using high-grade ${selectedSpec.name} polymers.`
                    }));
                    scrollToSection('rfq-section');
                  }}
                  className="bg-transparent hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-600 hover:border-blue-600 font-condensed font-bold uppercase tracking-wider text-xs px-5 py-2.5 rounded transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Apply {selectedSpec.name} to RFQ File <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. PRODUCTS SECTION */}
      <section id="products-section" className="py-24 bg-[#f8fafc] border-t border-slate-100 relative">
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-[radial-gradient(#2563eb_1.5px,transparent_1.5px)] [background-size:32px_32px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center space-x-2 text-blue-800 font-condensed font-bold uppercase tracking-widest text-sm">
              <span className="w-6 h-[1px] bg-blue-600"></span>
              <span>FINISHED PARTS SHOWCASE</span>
              <span className="w-6 h-[1px] bg-blue-600"></span>
            </div>
            <h2 className="text-3xl md:text-5xl font-condensed font-black text-slate-900 uppercase tracking-tight border-b-2 border-blue-600 pb-4 inline-block">
              CUSTOM MOULDED PRODUCTS
            </h2>
            <p className="text-slate-600 text-sm md:text-base font-sans leading-relaxed">
              Below is a curated gallery of actual components manufactured and quality-inspected at Shree Sai Enterprises. 
              We specialize in low-tolerance engineering thermoplastics, flexible elastomers, and custom family dies.
            </p>
          </div>

          {/* Interactive Category Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {["All", "Sprues & Runners", "Gears & Impellers", "Clips & Mounts", "Vials & Containers", "Caps & Grommets", "Seals & Gaskets"].map((category) => (
              <button
                key={category}
                onClick={() => setProductFilter(category)}
                className={`px-4 py-2 text-xs md:text-sm font-condensed font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                  productFilter === category
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productsDataset
              .filter((p) => productFilter === "All" || p.category === productFilter)
              .map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-lg overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col group transform hover:-translate-y-1"
                >
                  {/* Card Image Wrapper */}
                  <div className="relative h-64 bg-slate-900 overflow-hidden flex items-center justify-center">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-blue-600 text-white px-2.5 py-1 text-[10px] font-condensed font-bold uppercase tracking-wider rounded shadow-sm z-10">
                      {product.id}
                    </div>
                    <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-sm text-slate-200 px-2.5 py-1 text-[10px] font-condensed font-semibold rounded uppercase tracking-wider z-10 border border-slate-700">
                      {product.category}
                    </div>
                    {/* Ambiance shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-60"></div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[11px] text-blue-600 font-bold uppercase tracking-widest font-sans block">
                        {product.polymer.split(" (")[0]}
                      </span>
                      <h3 className="text-xl font-condensed font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors uppercase">
                        {product.name}
                      </h3>
                      <p className="text-slate-600 text-xs line-clamp-2 font-sans">
                        {product.description}
                      </p>
                    </div>

                    {/* Stats Strip */}
                    <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-slate-100 bg-slate-50 px-3 rounded-md text-[11px] font-sans text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Dimensions:</span>
                        <span className="font-semibold text-slate-800 line-clamp-1">{product.dimensions}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Weight:</span>
                        <span className="font-semibold text-slate-800 line-clamp-1">{product.weight}</span>
                      </div>
                    </div>

                    {/* Action CTA */}
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="w-full bg-slate-100 hover:bg-blue-600 text-slate-800 hover:text-white font-condensed font-bold uppercase tracking-wider text-xs py-3 rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/50 hover:border-blue-600"
                    >
                      Review Blueprint Specs <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Empty State when no items matched */}
          {productsDataset.filter((p) => productFilter === "All" || p.category === productFilter).length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300 p-8 max-w-md mx-auto">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-condensed font-black text-slate-700 uppercase">No parts found</h4>
              <p className="text-slate-500 text-sm mt-1">Please select another product tier to view Pune production specifications.</p>
            </div>
          )}

        </div>
      </section>

      {/* PRODUCT BLUEPRINT MODAL OVERLAY */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop backing */}
          <div 
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setSelectedProduct(null)}
          ></div>
          
          {/* Dialog Container */}
          <div className="relative bg-white text-slate-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 z-10 flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 z-20">
              <div>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest font-sans">
                  {selectedProduct.id} // TECHNICAL BLUEPRINT SPECIFICATION
                </span>
                <h3 className="text-xl md:text-2xl font-condensed font-black uppercase tracking-tight">
                  {selectedProduct.name}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 space-y-6 flex-1 overflow-y-auto bg-white text-slate-850">
              
              {/* Image Banner */}
              <div className="relative h-64 md:h-80 bg-slate-950 rounded-md overflow-hidden flex items-center justify-center border border-slate-200">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-slate-905/90 bg-slate-900/90 backdrop-blur-sm border border-slate-700 text-white rounded px-3 py-1.5 text-xs font-condensed font-bold uppercase tracking-wider">
                  Category: {selectedProduct.category}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="font-condensed font-black text-sm text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5">
                  Engineering Description
                </h4>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-sans">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Technical Specs Bento Grid */}
              <div className="space-y-4">
                <h4 className="font-condensed font-black text-sm text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5">
                  Pune Casting Tooling Parameters
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-xs font-sans text-slate-600">
                  
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                     <span className="font-bold text-slate-500 uppercase shrink-0">Polymer Class:</span>
                     <span className="font-bold text-slate-800 text-right">{selectedProduct.polymer}</span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                     <span className="font-bold text-slate-500 uppercase shrink-0">Part Weight:</span>
                     <span className="font-bold text-slate-800 text-right">{selectedProduct.weight}</span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                     <span className="font-bold text-slate-500 uppercase shrink-0">Dimensions:</span>
                     <span className="font-bold text-slate-800 text-right">{selectedProduct.dimensions}</span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                     <span className="font-bold text-slate-500 uppercase shrink-0">Cavity Nesting:</span>
                     <span className="font-bold text-slate-800 text-right">{selectedProduct.cavities}</span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                     <span className="font-bold text-slate-500 uppercase shrink-0">Clamping Force:</span>
                     <span className="font-bold text-slate-800 text-right">{selectedProduct.clampingForce}</span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                     <span className="font-bold text-slate-500 uppercase shrink-0">Gating Style:</span>
                     <span className="font-bold text-slate-800 text-right">{selectedProduct.gateStyle}</span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                     <span className="font-bold text-slate-500 uppercase shrink-0">Est. Cycle Time:</span>
                     <span className="font-bold text-blue-600 text-right">{selectedProduct.cycleTime}</span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                     <span className="font-bold text-slate-500 uppercase shrink-0">Regrind Blend:</span>
                     <span className="font-bold text-slate-800 text-right">{selectedProduct.regrindedFeasibility}</span>
                  </div>

                </div>
              </div>

              {/* Primary Applications */}
              <div className="space-y-2">
                <h4 className="font-condensed font-black text-sm text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5">
                  Pre-approved B2B Applications
                </h4>
                <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                  <p className="text-slate-600 text-sm font-sans flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span>{selectedProduct.application}</span>
                  </p>
                </div>
              </div>

            </div>

            {/* Footer Modal CTA Action */}
            <div className="sticky bottom-0 bg-slate-50 p-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-end gap-3 z-20">
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-full md:w-auto px-6 py-3 border border-slate-300 hover:bg-slate-100 font-condensed font-bold uppercase tracking-wider text-xs rounded transition-all cursor-pointer"
              >
                Go Back
              </button>
              <button
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    service: "Injection Moulding",
                    material: selectedProduct.polymer.split(" (")[0],
                    description: `Requesting a contract feasibility estimate and tooling analysis for custom injection moulding production runs of parts matching reference ${selectedProduct.id} (${selectedProduct.name}). Key specifications: ${selectedProduct.dimensions}, in polymer ${selectedProduct.polymer}.`
                  }));
                  setSelectedProduct(null);
                  scrollToSection("rfq-section");
                }}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-800 text-white font-condensed font-bold uppercase tracking-wider text-xs rounded shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Auto-fill RFQ for this Part <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. INDUSTRIES SECTION */}
      <section id="industries-section" className="py-24 bg-slate-50 relative">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <div className="inline-flex items-center space-x-2 text-blue-750 font-condensed font-bold uppercase tracking-widest text-sm">
              <span className="w-6 h-[1px] bg-blue-600"></span>
              <span>SECTORS WE SUPPLY</span>
              <span className="w-6 h-[1px] bg-blue-600"></span>
            </div>
            <h2 className="text-3xl md:text-5xl font-condensed font-black text-slate-900 uppercase tracking-tight border-b-2 border-blue-600 pb-4 inline-block">
              SOLUTIONS FOR EVERY INDUSTRY
            </h2>
            <p className="text-slate-650 font-normal leading-relaxed text-sm md:text-base pt-2">
              Shree Sai Enterprises processes rigid components and regrinds to satisfy the demanding requirements of various sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 font-sans">
            
            {/* Industry 1: Automotive */}
            <div className="bg-white border border-slate-200 p-6 rounded-sm text-center shadow hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 group-hover:bg-blue-600 transition-all">
                <Car className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="font-condensed font-bold text-lg text-slate-900 uppercase tracking-wide group-hover:text-blue-700 transition-all">
                Automotive
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Precision brackets, internal structural trims, non-critical engine parts.
              </p>
            </div>

            {/* Industry 2: Packaging */}
            <div className="bg-white border border-slate-200 p-6 rounded-sm text-center shadow hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 group-hover:bg-blue-600 transition-all">
                <Box className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="font-condensed font-bold text-lg text-slate-900 uppercase tracking-wide group-hover:text-blue-700 transition-all">
                Packaging
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Industrial crates, protective master rolls, container plugs, custom trays.
              </p>
            </div>

            {/* Industry 3: Electricals */}
            <div className="bg-white border border-slate-200 p-6 rounded-sm text-center shadow hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 group-hover:bg-blue-600 transition-all">
                <Zap className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="font-condensed font-bold text-lg text-slate-900 uppercase tracking-wide group-hover:text-blue-700 transition-all">
                Electricals
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Weatherproof housings, wall switchboards, bracket isolators, conduit pipes.
              </p>
            </div>

            {/* Industry 4: Consumer Goods */}
            <div className="bg-white border border-slate-200 p-6 rounded-sm text-center shadow hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 group-hover:bg-blue-600 transition-all">
                <Home className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="font-condensed font-bold text-lg text-slate-900 uppercase tracking-wide group-hover:text-blue-700 transition-all">
                Consumer Goods
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Appliance panels, storage tubs, custom hardware knobs, home utilities.
              </p>
            </div>

            {/* Industry 5: Industrial */}
            <div className="bg-white border border-slate-200 p-6 rounded-sm text-center shadow hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 group-hover:bg-blue-600 transition-all">
                <Settings className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="font-condensed font-bold text-lg text-slate-900 uppercase tracking-wide group-hover:text-blue-700 transition-all">
                Industrial
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Tough polymer components, structural spacer blocks, gear wheels, heavy seals.
              </p>
            </div>

            {/* Industry 6: Construction */}
            <div className="bg-white border border-slate-200 p-6 rounded-sm text-center shadow hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 group-hover:bg-blue-600 transition-all">
                <Hammer className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="font-condensed font-bold text-lg text-slate-900 uppercase tracking-wide group-hover:text-blue-700 transition-all">
                Construction
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Piping joins, safety helmet components, masonry clamps, structural blocks.
              </p>
            </div>

          </div>

          {/* Quick QC Badges Banner */}
          <div className="mt-16 bg-white border border-slate-200 p-8 rounded flex flex-col md:flex-row items-center justify-around gap-6 text-center border-l-4 border-l-blue-600 border-r-4 border-r-blue-600 shadow-sm font-sans">
            <div className="space-y-1">
              <div className="text-xs font-condensed font-black tracking-widest text-blue-750 text-blue-600">CERTIFICATION LEVEL I</div>
              <div className="text-xl font-bold text-slate-900 uppercase tracking-wide">ISO 9001:2015</div>
              <div className="text-xs text-slate-500">Strict Quality Management Sourcing Policy</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-slate-200"></div>
            <div className="space-y-1">
              <div className="text-xs font-condensed font-black tracking-widest text-blue-750 text-blue-600">ENVIRONMENTAL COMPLIANCE</div>
              <div className="text-xl font-bold text-slate-900 uppercase tracking-wide">SOCIALLY RESPONSIBLE RECYCLING</div>
              <div className="text-xs text-slate-500">Low-Emission Grinding Filtration Sinks</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-slate-200"></div>
            <div className="space-y-1">
              <div className="text-xs font-condensed font-black tracking-widest text-blue-750 text-blue-600">CHEMICAL CLASSIFICATION</div>
              <div className="text-xl font-bold text-slate-900 uppercase tracking-wide">RoHS IN COMPLIANCE</div>
              <div className="text-xs text-slate-500">Zero Hazardous Lead or Cadmium Trace Limits</div>
            </div>
          </div>
        </div>
      </section>

        {/* 6. REQUEST FOR QUOTE STATEFUL FORM SECTION */}
      <section id="rfq-section" className="py-24 bg-white border-t border-slate-100 relative">
        <div className="absolute right-0 bottom-0 h-96 w-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center space-x-2 text-blue-700 font-condensed font-bold uppercase tracking-widest text-sm">
              <span>GET AN ESTIMATE</span>
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              <span>24 HR RESPONSE GUARANTEE</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-condensed font-black text-slate-900 uppercase tracking-tight border-b-2 border-blue-600 pb-4 inline-block">
              B2B REQUEST FOR QUOTE (RFQ)
            </h2>
            <p className="text-sm text-slate-650 max-w-xl mx-auto pt-2">
              Please populate the industrial parameters below. Our management panel supervised by <strong>Mr. Sampat S. Kumbhar</strong> will return a formal manufacturing evaluation within 24 hours.
            </p>
          </div>

          <div className="bg-slate-50 border-2 border-slate-200 rounded shadow-2xl p-6 sm:p-10 relative overflow-hidden">
            
            {/* Simple highlight border */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-700"></div>

            {isSubmitted ? (
              
              /* RFQ SUBMISSION RECEIPT DASHBOARD */
              <div className="space-y-8 py-4 animate-fade-in">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 mb-2">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-condensed font-black text-emerald-700 uppercase tracking-wide max-w-2xl mx-auto">
                    Thank you! We'll contact you within 24 hours.
                  </h3>
                  <p className="text-slate-650 text-sm max-w-lg mx-auto">
                    An official commercial quotation and digital evaluation receipt was generated under reference code below.
                  </p>
                  <div className="inline-block bg-white text-blue-800 border border-slate-200 font-mono text-xs px-4 py-2 rounded shadow-sm">
                    REF ID: <span className="text-blue-900 font-extrabold">{lastSubmissionRef}</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded p-6 space-y-4 text-sm font-sans shadow-sm">
                  <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
                    <span className="text-[11px] font-mono text-slate-500 uppercase">SUBMITTER TECHNICAL PROFILE</span>
                    <span className="text-xs text-blue-700 font-semibold uppercase font-condensed">Live Verification Stage</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[11px] uppercase text-slate-500">Contact Officer:</span>
                      <span className="text-slate-900 font-extrabold">{formData.name}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] uppercase text-slate-500">B2B Company:</span>
                      <span className="text-slate-900 font-extrabold">{formData.company}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] uppercase text-slate-500">Phone Connection:</span>
                      <span className="text-slate-900 font-extrabold">{formData.phone}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] uppercase text-slate-500">Corporate Email:</span>
                      <span className="text-slate-900 font-extrabold">{formData.email}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-3">
                    <h4 className="text-[11px] font-mono text-slate-500 uppercase mb-2">PROJECT METRICS EVALUATOR</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-3 rounded border border-slate-200">
                      <div>
                        <span className="block text-[10px] text-slate-500">Required Service:</span>
                        <span className="text-blue-700 font-condensed font-bold text-xs uppercase">{formData.service}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500">Target Material:</span>
                        <span className="text-slate-900 font-bold text-xs">{formData.material}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500">Order Quantity:</span>
                        <span className="text-slate-900 font-bold text-xs">{formData.quantity || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500">Est. Timeline:</span>
                        <span className="text-blue-600 font-bold text-xs uppercase">{formData.timeline || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>

                  {formData.description && (
                    <div className="border-t border-slate-200 pt-3">
                      <span className="block text-[11px] uppercase text-slate-550 text-slate-500 mb-1">Project Brief / Remarks:</span>
                      <p className="bg-slate-50 p-3 rounded text-slate-650 text-xs italic border border-slate-200">
                        &ldquo;{formData.description}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                {/* Direct Owner Hotlines */}
                <div className="bg-blue-50 border border-blue-200 rounded p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
                  <div>
                    <h4 className="font-bold text-blue-900 uppercase tracking-wider mb-1">ESCORT HOTLINE FOR BOSARI RUNS:</h4>
                    <p className="text-slate-650">Should this require emergency mechanical setup setup, please ring Sampat Kumbhar directly.</p>
                  </div>
                  <div className="flex gap-2">
                    <a href="tel:+917507126049" className="bg-blue-600 hover:bg-blue-700 text-white font-condensed font-bold px-4 py-2.5 rounded tracking-wide uppercase">
                      Ring +91 75071 26049
                    </a>
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <button 
                    onClick={resetForm}
                    className="text-slate-600 hover:text-blue-700 font-semibold underline text-sm tracking-wide cursor-pointer font-sans"
                  >
                    ← Formulate Another B2B Request
                  </button>
                </div>

              </div>

            ) : (
              
              /* RAW FORM FOR INPUTS */
              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-xs uppercase font-condensed font-bold tracking-wider text-slate-700">
                      Your Full Name <span className="text-blue-600">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                        <User className="w-4 h-4 text-blue-600" />
                      </span>
                      <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-sm pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-sans placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Company field */}
                  <div className="space-y-1.5">
                    <label htmlFor="company" className="block text-xs uppercase font-condensed font-bold tracking-wider text-slate-700">
                      B2B Company Name <span className="text-blue-600">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                        <Building2 className="w-4 h-4 text-blue-600" />
                      </span>
                      <input 
                        type="text" 
                        name="company" 
                        id="company" 
                        required
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Industrial Solutions Ltd."
                        className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-sm pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-sans placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Phone field */}
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="block text-xs uppercase font-condensed font-bold tracking-wider text-slate-700">
                      Phone Number <span className="text-blue-600">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                        <Phone className="w-4 h-4 text-blue-600" />
                      </span>
                      <input 
                        type="tel" 
                        name="phone" 
                        id="phone" 
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 75071 26049"
                        className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-sm pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-sans placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs uppercase font-condensed font-bold tracking-wider text-slate-700">
                      Corporate Email <span className="text-blue-600">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </span>
                      <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="procurement@company.com"
                        className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-sm pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-sans placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Service dropdown */}
                  <div className="space-y-1.5 col-span-1 md:col-span-2">
                    <label htmlFor="service" className="block text-xs uppercase font-condensed font-bold tracking-wider text-slate-700">
                      Service Required <span className="text-blue-600">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                        <Factory className="w-4 h-4 text-blue-600" />
                      </span>
                      <select 
                        name="service" 
                        id="service"
                        required
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-sm pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all appearance-none font-sans"
                      >
                        <option value="Plastic Grinding">Plastic Grinding</option>
                        <option value="Injection Moulding">Injection Moulding</option>
                        <option value="Contract Processing">Contract Processing</option>
                      </select>
                    </div>
                  </div>

                  {/* Estimated Quantity (Optional) */}
                  <div className="space-y-1.5">
                    <label htmlFor="quantity" className="block text-xs uppercase font-condensed font-bold tracking-wider text-slate-700">
                      Quantity (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                        <Package className="w-4 h-4 text-blue-600" />
                      </span>
                      <input 
                        type="text" 
                        name="quantity" 
                        id="quantity" 
                        value={formData.quantity}
                        onChange={handleInputChange}
                        placeholder="e.g. 500 kg/month"
                        className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-sm pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-sans placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Production Timeline (Optional) */}
                  <div className="space-y-1.5">
                    <label htmlFor="timeline" className="block text-xs uppercase font-condensed font-bold tracking-wider text-slate-700">
                      Timeline (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </span>
                      <input 
                        type="text" 
                        name="timeline" 
                        id="timeline" 
                        value={formData.timeline}
                        onChange={handleInputChange}
                        placeholder="e.g. 2 weeks, urgent"
                        className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-sm pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-sans placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                </div>

                {/* Project Description */}
                <div className="space-y-1.5">
                  <label htmlFor="description" className="block text-xs uppercase font-condensed font-bold tracking-wider text-slate-700">
                    Project Description <span className="text-blue-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute top-3 left-3 text-slate-500 pointer-events-none">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </span>
                    <textarea 
                      name="description" 
                      id="description" 
                      required
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Please details your mold characteristics, required weight for injections, polymer colors, grinding feed specs, or general contract requirements (min 10 characters)..."
                      className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-sm pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none font-sans placeholder:text-slate-400"
                    ></textarea>
                  </div>
                </div>

                {submitError && (
                  <div className="bg-red-50 border border-red-300 text-red-650 text-red-700 p-4 rounded text-xs font-mono tracking-wide text-center">
                    ❌ {submitError}
                  </div>
                )}

                {/* Action button */}
                <div className="pt-4 text-center font-sans">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-condensed font-black tracking-widest text-sm uppercase px-12 py-4 rounded-sm border border-blue-600 shadow-xl transition-all active:translate-y-0 cursor-pointer flex items-center justify-center gap-2 mx-auto ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>PROCESSING REQUEST...</span>
                      </>
                    ) : (
                      <span>SUBMIT REQUEST</span>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-500 mt-3">
                    Your form validates immediately and submits directly to our technical desk for review.
                  </p>
                </div>

              </form>
            )}

          </div>

        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 text-xs relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            
            {/* Column 1: Company Profile Logo */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-700 to-blue-900 border-2 border-blue-400 text-white font-condensed font-black text-xl tracking-tighter w-11 h-9 flex items-center justify-center rounded-sm">
                  SSE
                </div>
                <div>
                  <h4 className="font-condensed font-bold text-base text-white tracking-widest uppercase">
                    SHREE SAI ENTERPRISES
                  </h4>
                  <p className="text-[9px] text-blue-400 uppercase tracking-wider font-semibold">
                    Unit II: II Jyotirling Prasanna II
                  </p>
                </div>
              </div>
              <p className="text-slate-350 leading-relaxed text-xs font-sans">
                Your trusted single-point industrial partner for heavy duty Thermoplastics Grinding Works and high-accuracy Contract Injection Moulding runs. Delivering B2B excellence inside the Pune Bhosari industrial belt.
              </p>
              <div className="flex items-center space-x-3 pt-2 text-blue-400">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-slate-300 font-sans">ISO 9001:2015 Compliant Workshop</span>
              </div>
            </div>

            {/* Column 2: Quick Links Navigation */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="font-condensed font-black text-sm text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                Factory Index
              </h4>
              <ul className="space-y-2 font-medium font-sans">
                <li>
                  <button onClick={() => scrollToSection('navbar-app')} className="text-slate-400 hover:text-blue-450 hover:text-blue-400 transition-colors text-left cursor-pointer">
                    Top Screen
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('about-section')} className="text-slate-400 hover:text-blue-450 hover:text-blue-400 transition-colors text-left cursor-pointer font-sans">
                    Company History
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('services-section')} className="text-slate-400 hover:text-blue-450 hover:text-blue-400 transition-colors text-left cursor-pointer font-sans">
                    Services Offered
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('materials-section')} className="text-slate-400 hover:text-blue-450 hover:text-blue-400 transition-colors text-left cursor-pointer font-sans">
                    Materials Guide
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('products-section')} className="text-slate-400 hover:text-blue-450 hover:text-blue-400 transition-colors text-left cursor-pointer font-sans">
                    Products Gallery
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('industries-section')} className="text-slate-400 hover:text-blue-450 hover:text-blue-400 transition-colors text-left cursor-pointer font-sans">
                    Sectors Served
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('rfq-section')} className="text-slate-400 hover:text-white transition-colors text-left cursor-pointer text-blue-400 font-bold font-sans">
                    Get Estimates (RFQ)
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Custom Materials */}
            <div className="md:col-span-2 space-y-4 font-sans">
              <h4 className="font-condensed font-black text-sm text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                Processed Polymers
              </h4>
              <ul className="space-y-2 text-slate-400 font-medium">
                <li className="hover:text-blue-400 transition-colors cursor-pointer">ABS Thermoplastic</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Polypropylene (PP)</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Polycarbonate (PC)</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Nylon Custom Blends</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">HDPE Industrial Grade</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">POM Polyacetal Gears</li>
              </ul>
            </div>

            {/* Column 4: Detailed Location & Owner Details */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="font-condensed font-black text-sm text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                Bhosari Administration
              </h4>
              <ul className="space-y-2.5 text-slate-400 font-medium font-sans">
                <li className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-white font-bold text-xs uppercase font-condensed tracking-wide">Mr. Sampat S. Kumbhar (Proprietor)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  <a href="tel:+917507126049" className="hover:text-white transition-colors font-bold text-xs">
                    +91 75071 26049
                  </a>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <a href="mailto:sampatskumbhar@gmail.com" className="hover:text-white transition-colors font-semibold">
                    sampatskumbhar@gmail.com
                  </a>
                </li>
                <li className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-xs leading-relaxed text-slate-350">
                    Sr. No. 71/1, Shiv Ganesh Nagar, Sopan Dhawade Marg, Dhawade Wasti, Bhosari, Pune – 411 039
                  </span>
                </li>
              </ul>
            </div>

          </div>

          {/* Legal Bar */}
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 font-medium font-sans">
            <div>
              &copy; 2026 <span className="text-slate-300 font-bold border-r border-slate-800 pr-2.5 mr-2.5">Shree Sai Enterprises</span> Specialisation Injection Moulding &amp; Regrinds. All Rights Reserved.
            </div>
            <div className="flex space-x-4">
              <span className="hover:text-blue-400 cursor-pointer">B2B Manufacturing License No: SSE/MH/PUN411</span>
              <span>&bull;</span>
              <span className="hover:text-blue-400 cursor-pointer text-blue-400 font-bold">Maharashtra Industrial Zone II</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
