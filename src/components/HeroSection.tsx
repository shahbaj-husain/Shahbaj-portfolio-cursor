import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { HERO_COPY, SERVICE_OPTIONS, type TopicOption } from '../data/portfolioData';
import { useTypewriter } from '../hooks/useTypewriter';
import { BackgroundVideo } from './BackgroundVideo';

interface HeroSectionProps {
  selectedTopics: TopicOption[];
  onToggleTopic: (topic: TopicOption) => void;
  onExploreSelected: () => void;
}

export function HeroSection({
  selectedTopics,
  onToggleTopic,
  onExploreSelected,
}: HeroSectionProps) {
  const { displayed, done } = useTypewriter(HERO_COPY.headline, 38, 600);

  return (
    <section
      aria-label="Hero introduction"
      className="relative bg-white text-neutral-900 font-sans selection:bg-[#EAECE9] selection:text-[#1C2E1E] antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen"
    >
      <BackgroundVideo />

      <div className="relative z-10 flex flex-col order-first lg:order-none w-full bg-white lg:bg-transparent pb-8 lg:pb-0 lg:min-h-screen">
        <main
          id="spade-hero"
          className="w-full max-w-7xl mx-auto px-6 pt-20 pb-8 lg:py-8 lg:pt-20 flex-1 flex flex-col justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[54px] xl:text-[64px] 2xl:text-[74px] font-normal tracking-tight text-black leading-[1.08] mb-5 xl:mb-7 select-none w-full whitespace-pre-wrap">
              {displayed}
              {!done && (
                <span
                  className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink"
                  aria-hidden="true"
                />
              )}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-base sm:text-lg xl:text-xl text-[#5A635A] leading-relaxed font-normal mb-8 xl:mb-12 max-w-xl">
              {HERO_COPY.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-xl"
          >
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight mb-1.5 text-black">
              {HERO_COPY.promptTitle}
            </h2>
            <p className="opacity-85 text-[#738273] mb-5 xl:mb-6">
              {HERO_COPY.promptSubtitle}
            </p>

            <div className="flex flex-wrap gap-3 mb-4 xl:mb-5" role="group" aria-label="Topics to explore">
              {SERVICE_OPTIONS.map((option) => {
                const isSelected = selectedTopics.includes(option);
                return (
                  <motion.button
                    key={option}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => onToggleTopic(option)}
                    whileTap={{ scale: 0.97 }}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 xl:py-3 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-[#1C2E1E] text-white shadow-md shadow-emerald-950/5 transform'
                        : 'bg-white text-[#1C2E1E] border border-[#F1F3F1] hover:bg-[#F1F3F1]/55'
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="inline-flex items-center"
                      >
                        <Check className="w-4 h-4" aria-hidden="true" />
                      </motion.span>
                    )}
                    <span>{option}</span>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {selectedTopics.length === 0 ? (
                <motion.p
                  key="empty-banner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="opacity-50 italic text-xs text-neutral-700"
                >
                  Please click to select topics above.
                </motion.p>
              ) : (
                <motion.div
                  key="active-banner"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                  className="overflow-hidden"
                >
                  <div className="bg-[#FAFBF9] border border-[#EAECE9] rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-[#1C2E1E]">
                      Ready to inquire about:{' '}
                      <span className="font-medium">{selectedTopics.join(', ')}</span>
                    </p>
                    <button
                      type="button"
                      onClick={onExploreSelected}
                      className="inline-flex items-center gap-1.5 text-[#4D6D47] uppercase text-xs font-semibold tracking-wider hover:opacity-75 transition-opacity cursor-pointer whitespace-nowrap shrink-0 py-1"
                    >
                      <span>Let&apos;s Go</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
    </section>
  );
}
