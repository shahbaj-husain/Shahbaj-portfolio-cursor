import { motion } from 'motion/react';
import { PROFILE_INFO } from '../data/portfolioData';

export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative z-10 scroll-mt-20 bg-white border-t border-[#EAECE9] py-24 sm:py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5"
          >
            <p className="text-sm text-[#738273] tracking-tight mb-3">
              {PROFILE_INFO.degree} · {PROFILE_INFO.stage}
            </p>
            <h2
              id="about-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-black leading-[1.12] mb-6"
            >
              Building a solid foundation in computer science &amp; AI/ML.
            </h2>
            <p className="text-base sm:text-lg text-[#5A635A] leading-relaxed mb-8">
              {PROFILE_INFO.headlineIntro}
            </p>
            <ul className="space-y-2.5 border-t border-[#EAECE9] pt-5 text-sm text-[#5A635A]">
              {PROFILE_INFO.learningStatements.map((statement, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-xs font-medium text-[#4D6D47] tabular-nums mt-0.5">
                    0{idx + 1}
                  </span>
                  <span>{statement}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="bg-[#FAFBF9] border border-[#EAECE9] rounded-2xl p-6 sm:p-8 space-y-4">
              {PROFILE_INFO.paragraphs.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-base sm:text-lg text-[#1C2E1E]/90 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div id="learning" className="scroll-mt-24 pt-6 border-t border-[#EAECE9]">
              <h3 className="text-xl font-medium tracking-tight text-black mb-6">
                My Learning Approach
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PROFILE_INFO.approach.map((step) => (
                  <div
                    key={step.index}
                    className="border-t border-[#EAECE9] pt-4"
                  >
                    <span className="text-xs font-medium text-[#4D6D47] tabular-nums block mb-2">
                      {step.index}.
                    </span>
                    <h4 className="text-base font-medium text-black mb-1.5">
                      {step.title}
                    </h4>
                    <p className="text-sm text-[#5A635A] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
