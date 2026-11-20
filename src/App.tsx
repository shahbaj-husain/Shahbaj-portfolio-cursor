import { useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import type { TopicOption } from './data/portfolioData';
import { toggleSelection } from './utils/portfolio';

export default function App() {
  const [selectedTopics, setSelectedTopics] = useState<TopicOption[]>([]);

  const handleToggleTopic = (topic: TopicOption) => {
    setSelectedTopics((prev) => toggleSelection(prev, topic));
  };

  const handleExploreSelected = () => {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-white text-neutral-900 font-sans selection:bg-[#EAECE9] selection:text-[#1C2E1E] antialiased overflow-x-hidden">
      <Navbar />
      <HeroSection
        selectedTopics={selectedTopics}
        onToggleTopic={handleToggleTopic}
        onExploreSelected={handleExploreSelected}
      />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection selectedTopics={selectedTopics} />
    </div>
  );
}
