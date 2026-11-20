import { useState } from 'react';
import { motion } from 'motion/react';
import { SKILLS_DATA, type SkillCategory } from '../data/portfolioData';
import { filterSkills } from '../utils/portfolio';

const CATEGORIES: SkillCategory[] = ['All', 'Languages', 'Web', 'AI / ML'];

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('All');
  const visibleSkills = filterSkills(SKILLS_DATA, activeCategory);

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative z-10 scroll-mt-20 bg-[#FAFBF9] border-t border-[#EAECE9] py-24 sm:py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-sm text-[#738273] mb-2">
              Skills &amp; Tools · Coursework &amp; Hands-On Practice
            </p>
            <h2
              id="skills-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-black leading-[1.12]"
            >
              Languages, web &amp; data tools.
            </h2>
          </div>

          <div
            className="inline-flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-[#EAECE9] rounded-xl self-start md:self-auto"
            role="tablist"
            aria-label="Filter skills by category"
          >
            {CATEGORIES.map((category) => {
              const isSelected = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#1C2E1E] text-white'
                      : 'text-[#5A635A] hover:text-[#1C2E1E] hover:bg-[#F1F3F1]/70'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${
            visibleSkills.length === 3
              ? 'lg:grid-cols-3'
              : visibleSkills.length === 4
              ? 'lg:grid-cols-4'
              : 'lg:grid-cols-5'
          }`}
        >
          {visibleSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white border border-[#EAECE9] rounded-2xl p-5 flex flex-col justify-between min-h-[176px] transition-colors duration-200 hover:border-[#1C2E1E]/30"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#738273] mb-4">
                  <span className="tabular-nums font-medium">{skill.number}</span>
                  <span>{skill.category}</span>
                </div>
                <h3 className="text-lg font-medium tracking-tight text-black mb-2">
                  {skill.name}
                </h3>
                <p className="text-sm text-[#5A635A] leading-relaxed">
                  {skill.focus}
                </p>
              </div>
              <p className="text-xs text-[#4D6D47] font-medium pt-4 mt-4 border-t border-[#F1F3F1]">
                {skill.level}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
