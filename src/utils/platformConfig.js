import { FiLinkedin, FiTwitter, FiInstagram, FiGrid, FiBook, FiLayout } from 'react-icons/fi';

export const PLATFORM_CONFIG = {
  'LinkedIn': {
    icon: FiLinkedin,
    color: '#00A0DC',
    bgColor: 'bg-[#00A0DC]',
    bgColorLight: 'bg-[#00A0DC]/10',
    textColor: 'text-[#00A0DC]'
  },
  'Twitter Post': {
    icon: FiTwitter,
    color: '#4B5563',
    bgColor: 'bg-[#4B5563]',
    bgColorLight: 'bg-[#4B5563]/10',
    textColor: 'text-[#4B5563]'
  },
  'Twitter Thread': {
    icon: FiTwitter,
    color: '#4B5563',
    bgColor: 'bg-[#4B5563]',
    bgColorLight: 'bg-[#4B5563]/10',
    textColor: 'text-[#4B5563]'
  },
  'Instagram': {
    icon: FiInstagram,
    color: '#E4405F',
    bgColor: 'bg-[#E4405F]',
    bgColorLight: 'bg-[#E4405F]/10',
    textColor: 'text-[#E4405F]'
  },
  'Carousel': {
    icon: FiGrid,
    color: '#00D1B2',
    bgColor: 'bg-[#00D1B2]',
    bgColorLight: 'bg-[#00D1B2]/10',
    textColor: 'text-[#00D1B2]'
  },
  'Story Breakdown': {
    icon: FiBook,
    color: '#8B50EF',
    bgColor: 'bg-[#8B50EF]',
    bgColorLight: 'bg-[#8B50EF]/10',
    textColor: 'text-[#8B50EF]'
  },
  'Mini-Guide': {
    icon: FiLayout,
    color: '#65D2AE',
    bgColor: 'bg-[#65D2AE]',
    bgColorLight: 'bg-[#65D2AE]/10',
    textColor: 'text-[#65D2AE]'
  }
};

export function getPlatformConfig(platformName) {
  return PLATFORM_CONFIG[platformName] || PLATFORM_CONFIG['LinkedIn'];
}