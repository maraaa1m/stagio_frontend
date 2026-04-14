import { motion, useScroll, useTransform } from "motion/react";
import { 
  Search, 
  ChevronDown, 
  GraduationCap, 
  Target, 
  FileCheck,
  Briefcase,
  Users,
  Globe
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  
  // Floating effect values
  const width = useTransform(scrollY, [0, 100], ["100%", "90%"]);
  const top = useTransform(scrollY, [0, 100], ["0px", "20px"]);
  const borderRadius = useTransform(scrollY, [0, 100], ["0px", "100px"]);
  const boxShadow = useTransform(scrollY, [0, 100], ["none", "0 20px 50px -12px rgba(0, 0, 0, 0.08)"]);
  const backgroundColor = useTransform(scrollY, [0, 100], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.9)"]);
  const border = useTransform(scrollY, [0, 100], ["1px solid rgba(255,255,255,0)", "1px solid rgba(255,255,255,0.2)"]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <motion.nav 
        style={{ 
          width, 
          top, 
          borderRadius, 
          boxShadow, 
          backgroundColor,
          border,
          backdropFilter: "blur(12px)" 
        }}
        className="h-16 md:h-20 flex items-center transition-all duration-300 pointer-events-auto relative"
      >
        <div className="container mx-auto px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
            <span className="font-bold text-xl text-navy-900">Stag<span className="text-blue-600">.io</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {["Find Internships", "Add Internship Offer", "About Us"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                className="text-[13px] font-bold uppercase tracking-widest text-navy-900/60 hover:text-blue-600 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => navigate('/login')}
              className="text-[13px] font-bold uppercase tracking-widest text-navy-900 hover:text-blue-600 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="px-7 py-3 text-[13px] font-bold uppercase tracking-widest text-white bg-navy-900 rounded-full hover:bg-blue-600 transition-all shadow-xl shadow-navy-900/10 hover:shadow-blue-600/20 active:scale-95"
            >
              Get Started
            </button>
          </div>

          <button className="md:hidden p-2 text-navy-900" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <div className="w-6 h-6 flex items-center justify-center">✕</div> : <div className="w-6 h-6 flex items-center justify-center">☰</div>}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-full mt-4 left-0 right-0 bg-white rounded-3xl p-6 md:hidden flex flex-col gap-6 shadow-2xl border border-gray-100"
          >
            {["Find Internships", "Add Internship Offer", "About Us"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                className="text-lg font-bold text-navy-900"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-50">
              <button 
                onClick={() => { navigate('/login'); setIsOpen(false); }}
                className="w-full py-4 text-sm font-bold uppercase tracking-widest text-navy-900 border border-navy-900/10 rounded-2xl"
              >
                Sign In
              </button>
              <button 
                onClick={() => { navigate('/register'); setIsOpen(false); }}
                className="w-full py-4 text-sm font-bold uppercase tracking-widest text-white bg-navy-900 rounded-2xl"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>
    </div>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative pt-32 pb-20 md:pt-56 md:pb-40 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50/40 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
           
            <h1 className="text-6xl md:text-8xl font-display font-extrabold leading-[0.95] mb-8 text-navy-900 tracking-tighter text-balance">
              Find The  Perfect <br />
              <span className="text-blue-600 italic"> Internship </span> <br /> In Minute
            </h1>
            
            <p className="text-xl text-navy-900/50 mb-12 max-w-xl leading-relaxed font-medium">
              We connect the brightest Algerian minds with industry leaders through an intelligent, data-driven matching ecosystem.
            </p>

            <div className="relative max-w-2xl group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
              <div className="relative bg-white p-2.5 rounded-[1.8rem] shadow-2xl flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center px-5 gap-4">
                  <Search className="w-5 h-5 text-blue-600" />
                  <input 
                    type="text" 
                    placeholder="Skill, Wilaya, or Company..." 
                    className="w-full outline-none text-[15px] font-semibold text-navy-900 placeholder:text-navy-900/30 py-4"
                  />
                </div>
                <div className="hidden md:flex items-center px-6 gap-3 border-l border-gray-100 cursor-pointer hover:bg-gray-50 rounded-2xl transition-colors">
                  <span className="text-[13px] font-bold text-navy-900/60 uppercase tracking-widest">Wilaya</span>
                  <ChevronDown className="w-4 h-4 text-navy-900/30" />
                </div>
                <button className="bg-navy-900 text-white px-10 py-4 rounded-2xl font-bold text-[13px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-navy-900/10 active:scale-95">
                  Search
                </button>
              </div>
            </div>

          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Hero Image with Premium Styling */}
            <div className="relative z-10 group">
              <div className="absolute -inset-4 bg-blue-600/10 rounded-[3rem] blur-2xl group-hover:bg-blue-600/20 transition-all duration-700" />
              <div className="relative aspect-[4/5] md:aspect-square rounded-[2.5rem] overflow-hidden shadow-premium border border-white">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
                  alt="Algerian students collaborating" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent opacity-60" />
              </div>
            </div>

            
 
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const BentoStats = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-2 bg-paper p-10 rounded-[2.5rem] border border-gray-100 flex flex-col justify-between group hover:border-blue-600/20 transition-colors">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-8">
                <Users size={28} />
              </div>
              <h3 className="text-4xl font-display font-bold text-navy-900 mb-2">12,400+</h3>
              <p className="text-navy-900/40 font-bold uppercase tracking-widest text-[11px]">Registered Students</p>
            </div>
            <p className="mt-8 text-navy-900/60 font-medium leading-relaxed">
              The largest network of academic talent in Algeria, spanning across all 58 Wilayas.
            </p>
          </div>
          
          <div className="bg-navy-900 p-10 rounded-[2.5rem] flex flex-col justify-between text-white">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8">
              <Briefcase size={28} />
            </div>
            <div>
              <h3 className="text-4xl font-display font-bold mb-2">840+</h3>
              <p className="text-white/40 font-bold uppercase tracking-widest text-[11px]">Partner Companies</p>
            </div>
          </div>

          <div className="bg-blue-600 p-10 rounded-[2.5rem] flex flex-col justify-between text-white">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8">
              <Globe size={28} />
            </div>
            <div>
              <h3 className="text-4xl font-display font-bold mb-2">58</h3>
              <p className="text-white/40 font-bold uppercase tracking-widest text-[11px]">Wilaya Coverage</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Process = () => {
  const steps = [
    {
      title: "Digital Identity",
      desc: "Create a professional profile that highlights your academic excellence and technical projects.",
      icon: <GraduationCap size={32} />
    },
    {
      title: "Smart Matching",
      desc: "Our neural engine analyzes thousands of data points to find your optimal career trajectory.",
      icon: <Target size={32} />
    },
    {
      title: "Seamless Integration",
      desc: "Automated internship agreements and digital onboarding for a frictionless experience.",
      icon: <FileCheck size={32} />
    }
  ];

  return (
    <section id="university-network" className="py-32 bg-paper">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-navy-900 mb-6 tracking-tighter">Engineered for Excellence</h2>
          <p className="text-navy-900/40 font-medium max-w-2xl mx-auto text-lg">We've redesigned the internship lifecycle from the ground up.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <div key={step.title} className="relative group">
              <div className="mb-10 relative">
                <div className="w-20 h-20 rounded-3xl bg-white shadow-premium flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-500">
                  {step.icon}
                </div>
                <div className="absolute -top-4 -right-4 text-7xl font-display font-black text-navy-900/[0.03] select-none">0{i + 1}</div>
              </div>
              <h3 className="text-2xl font-display font-bold text-navy-900 mb-4">{step.title}</h3>
              <p className="text-navy-900/50 leading-relaxed font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="relative bg-navy-900 rounded-[4rem] p-16 md:p-32 overflow-hidden text-center">
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#2563EB,transparent_70%)]" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          </div>

          <div className="relative z-10">
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-7xl font-display font-bold text-white mb-10 tracking-tighter leading-none"
            >
            Find The Perfect Internship Now.
            </motion.h2>
            <p className="text-white/40 text-xl mb-16 max-w-2xl mx-auto font-medium">
              Join the ecosystem that's powering the next generation of Algerian innovators.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-12 py-6 bg-white/5 text-white border border-white/10 rounded-2xl font-bold text-[13px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-3 group"
              >
                Join as a Student
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-12 py-6 bg-white/5 text-white border border-white/10 rounded-2xl font-bold text-[13px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-3 group"
              >
                Join as a Company
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-paper pt-32 pb-12 border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                <span className="font-bold text-xl text-navy-900">Stag<span className="text-blue-600">.io</span></span>
              </div>
            </div>
            <p className="text-navy-900/40 font-medium max-w-sm leading-relaxed">
              Empowering the Algerian academic community by bridging the gap between education and industry.
            </p>
          </div>
          
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-navy-900 mb-8">Platform</h4>
            <ul className="space-y-4">
              {["Find Internships", "For Companies", "University Portal", "Success Stories"].map(item => (
                <li key={item}><a href="#" className="text-sm font-bold text-navy-900/40 hover:text-blue-600 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-navy-900 mb-8">Company</h4>
            <ul className="space-y-4">
              {["About Us", "Careers", "Privacy Policy", "Contact"].map(item => (
                <li key={item}><a href="#" className="text-sm font-bold text-navy-900/40 hover:text-blue-600 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-gray-100 gap-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-navy-900/20">© 2026 Stag.io — Algiers, Algeria</p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-navy-900/20">Crafted for Algerian Excellence</span>
            <div className="w-4 h-4 rounded-full bg-blue-600/10 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <BentoStats />
        <Process />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
