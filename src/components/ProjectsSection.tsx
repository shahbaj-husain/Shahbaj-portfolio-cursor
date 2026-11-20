import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PROJECTS_DATA, type ProjectItem } from '../data/portfolioData';

export function ProjectsSection() {
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const closeModal = () => {
    setActiveProject(null);
    const trigger = lastTriggerRef.current;
    if (trigger) {
      requestAnimationFrame(() => trigger.focus());
    }
  };

  useEffect(() => {
    if (!activeProject) return;
    requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeProject]);

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative z-10 scroll-mt-20 bg-white border-t border-[#EAECE9] py-24 sm:py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-14">
          <p className="text-sm text-[#738273] mb-2">
            Selected Projects · Learning Through Building
          </p>
          <h2
            id="projects-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-black leading-[1.12]"
          >
            Practical projects &amp; prototypes.
          </h2>
        </div>

        <div className="divide-y divide-[#EAECE9] border-t border-b border-[#EAECE9]">
          {PROJECTS_DATA.map((project) => (
            <article
              key={project.id}
              className="py-10 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start"
            >
              <div className="lg:col-span-4">
                <div className="text-xs text-[#738273] mb-2 flex items-center gap-2">
                  <span className="tabular-nums font-medium text-[#1C2E1E]">
                    {project.index}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{project.status}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.category}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-black">
                  {project.name}
                </h3>
              </div>

              <div className="lg:col-span-5">
                <p className="text-base sm:text-lg text-[#5A635A] leading-relaxed mb-3">
                  {project.summary}
                </p>
                <p className="text-xs text-[#738273]">
                  {project.stack.join(' · ')}
                </p>
              </div>

              <div className="lg:col-span-3 lg:flex lg:justify-end">
                <button
                  type="button"
                  onClick={(e) => {
                    lastTriggerRef.current = e.currentTarget;
                    setActiveProject(project);
                  }}
                  aria-label={`Explore project notes for ${project.name}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#EAECE9] bg-[#FAFBF9] text-sm font-medium text-[#1C2E1E] hover:bg-[#1C2E1E] hover:text-white transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Explore project notes</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px] flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeModal();
              }
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl bg-white border border-[#EAECE9] rounded-2xl p-6 sm:p-8 shadow-xl"
            >
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#EAECE9]">
                <div>
                  <p className="text-xs text-[#738273] mb-1">
                    {activeProject.index} · {activeProject.status} · {activeProject.category}
                  </p>
                  <h3
                    id="project-modal-title"
                    className="text-2xl font-medium tracking-tight text-black"
                  >
                    {activeProject.name}
                  </h3>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeModal}
                  aria-label="Close project notes"
                  className="w-10 h-10 rounded-full border border-[#EAECE9] inline-flex items-center justify-center text-neutral-700 hover:bg-[#FAFBF9] transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="py-6 space-y-4">
                <p className="text-base text-[#1C2E1E] leading-relaxed">
                  {activeProject.summary}
                </p>
                <ul className="space-y-2.5 text-sm text-[#5A635A] leading-relaxed">
                  {activeProject.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#4D6D47] mt-2 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#EAECE9] flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-[#738273]">
                  Focus: {activeProject.stack.join(' · ')}
                </p>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-full bg-[#1C2E1E] text-white text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
