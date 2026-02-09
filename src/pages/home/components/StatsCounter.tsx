import { useState, useEffect, useRef, useCallback } from 'react';

interface StatItem {
  icon: string;
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
}

const stats = [
  {
    icon: 'ri-time-line',
    value: 20,
    suffix: '+',
    label: 'YEARS OF OPERATION',
    sublabel: 'In the DRC'
  },
  {
    icon: 'ri-building-2-line',
    value: 100,
    suffix: 'ha+',
    label: 'FOOTPRINT',
    sublabel: 'Infrastructure'
  },
  {
    icon: 'ri-team-line',
    value: 300,
    suffix: '+',
    label: 'EMPLOYEES',
    sublabel: 'Across Operations'
  },
  {
    icon: 'ri-copper-coin-line',
    value: 35,
    suffix: 'K+',
    label: 'TONS CU BLISTER',
    sublabel: 'Produced Annually'
  }
];

const useCountUp = (target: number, duration: number, start: boolean) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, start]);

  return count;
};

const StatCard = ({
  stat,
  index,
  isVisible,
}: {
  stat: StatItem;
  index: number;
  isVisible: boolean;
}) => {
  const [started, setStarted] = useState(false);
  const count = useCountUp(stat.value, 2200, started);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setStarted(true), index * 150);
      return () => clearTimeout(timer);
    }
  }, [isVisible, index]);

  return (
    <div
      className={`relative flex flex-col items-center text-center px-6 py-8 transition-all duration-700 ${
        started ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-full bg-[#DC2626]/10 flex items-center justify-center mb-5">
        <i className={`${stat.icon} text-2xl text-[#DC2626]`}></i>
      </div>

      {/* Number */}
      <div className="flex items-baseline mb-3">
        <span
          className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#2C3E50] leading-none"
          style={{ fontFamily: 'Inter, sans-serif', fontVariantNumeric: 'tabular-nums' }}
        >
          {started ? count.toLocaleString() : '0'}
        </span>
        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#DC2626] ml-1">
          {stat.suffix}
        </span>
      </div>

      {/* Label */}
      <p className="text-sm font-semibold text-[#2C3E50] uppercase tracking-[1.5px] mb-1">
        {stat.label}
      </p>
      <p className="text-xs text-[#6C757D] tracking-wide">{stat.sublabel}</p>
    </div>
  );
};

const StatsCounter = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.25,
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [handleIntersection]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-16 sm:py-20 lg:py-24 overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #2C3E50 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      ></div>

      <div className="relative max-w-[1320px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div
          className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-xs sm:text-sm uppercase tracking-[2px] text-[#DC2626] font-semibold mb-3 sm:mb-4">
            Our Achievements
          </p>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3E50]"
            style={{ fontFamily: 'Merriweather, serif' }}
          >
            Numbers That Define Us
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="relative">
              <StatCard stat={stat} index={index} isVisible={isVisible} />
              {/* Vertical divider (hidden on last item and mobile) */}
              {index < stats.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-[60%] bg-gradient-to-b from-transparent via-[#E5E7EB] to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
