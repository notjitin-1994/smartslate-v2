export type PartnerType = 'institutions' | 'businesses';

interface Benefit {
  icon: string;
  text: string;
}

interface Content {
  title: string;
  subtitle: string;
  pitch: string;
  benefits: Benefit[];
}

export const content: Record<PartnerType, Content> = {
  institutions: {
    title: 'Educational Institutions',
    subtitle: 'Shaping the future of education',
    pitch: 'Stand out by embedding real-world, in-demand skills directly into your curriculum.',
    benefits: [
      { icon: 'School', text: 'Industry-Informed Curriculum' },
      { icon: 'OfflineBolt', text: 'AI-Powered Learning' },
      { icon: 'People', text: 'Enhanced Graduate Employability' },
    ],
  },
  businesses: {
    title: 'Business Leaders',
    subtitle: 'Building future-ready teams',
    pitch: 'Stop the endless search for the perfect hire and start cultivating the skills you need.',
    benefits: [
      { icon: 'Lightbulb', text: 'Targeted Upskilling at Scale' },
      { icon: 'BarChart', text: 'AI-Driven Performance Insights' },
      { icon: 'People', text: 'Boost Retention & Innovation' },
    ],
  },
};