import thumbnail1 from '@/assets/thumbnail-1.jpg';
import thumbnail2 from '@/assets/thumbnail-2.jpg';
import thumbnail3 from '@/assets/thumbnail-3.jpg';
import thumbnail4 from '@/assets/thumbnail-4.jpg';
import thumbnail5 from '@/assets/thumbnail-5.jpg';
import thumbnail6 from '@/assets/thumbnail-6.jpg';

export interface Video {
  id: string;
  title: string;
  creator: string;
  views: number;
  uploadedAt: Date;
  thumbnail: string;
  duration: string;
  category: string;
}

export const mockVideos: Video[] = [
  {
    id: '1',
    title: 'I Secretly Hid In MrBeast\'s YouTube Videos',
    creator: 'Airrack',
    views: 3509292,
    uploadedAt: new Date(Date.now() - 22 * 60 * 60 * 1000), // 22 hours ago
    thumbnail: thumbnail1,
    duration: '12:34',
    category: 'Entertainment'
  },
  {
    id: '2', 
    title: 'Epic Gaming Moments That Will Blow Your Mind',
    creator: 'GameMaster Pro',
    views: 1631844,
    uploadedAt: new Date(Date.now() - 17 * 60 * 60 * 1000), // 17 hours ago
    thumbnail: thumbnail2,
    duration: '15:22',
    category: 'Gaming'
  },
  {
    id: '3',
    title: 'Perfect Homemade Pizza Recipe in 30 Minutes',
    creator: 'Chef\'s Kitchen',
    views: 1390256,
    uploadedAt: new Date(Date.now() - 21 * 60 * 60 * 1000), // 21 hours ago
    thumbnail: thumbnail3,
    duration: '8:45',
    category: 'Howto & Style'
  },
  {
    id: '4',
    title: 'Most Beautiful Places You Must Visit This Year',
    creator: 'Travel Wanderer',
    views: 1595357,
    uploadedAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    thumbnail: thumbnail4,
    duration: '18:12',
    category: 'Travel & Events'
  },
  {
    id: '5',
    title: 'Behind The Scenes: Recording My New Album',
    creator: 'Music Artist',
    views: 457018,
    uploadedAt: new Date(Date.now() - 21 * 60 * 60 * 1000), // 21 hours ago
    thumbnail: thumbnail5,
    duration: '22:33',
    category: 'Music'
  },
  {
    id: '6',
    title: '30-Day Fitness Transformation Challenge Results',
    creator: 'FitLife Journey',
    views: 1975673,
    uploadedAt: new Date(Date.now() - 22 * 60 * 60 * 1000), // 22 hours ago
    thumbnail: thumbnail6,
    duration: '14:56',
    category: 'Sports'
  },
  {
    id: '7',
    title: 'React Tutorial: Build a Complete Web App From Scratch',
    creator: 'CodeWith Sarah',
    views: 892340,
    uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    thumbnail: thumbnail1,
    duration: '45:12',
    category: 'Education'
  },
  {
    id: '8',
    title: 'Incredible Wildlife Documentary: Lions of Africa',
    creator: 'Nature Explorer',
    views: 2108745,
    uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    thumbnail: thumbnail4,
    duration: '52:18',
    category: 'Pets & Animals'
  },
  {
    id: '9',
    title: 'Stand-Up Comedy Special: Hilarious Life Stories',
    creator: 'Comedy Central',
    views: 756234,
    uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    thumbnail: thumbnail5,
    duration: '28:44',
    category: 'Comedy'
  },
  {
    id: '10',
    title: 'Revolutionary AI Technology That Changes Everything',
    creator: 'Tech Insider',
    views: 1445289,
    uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    thumbnail: thumbnail2,
    duration: '16:38',
    category: 'Science & Technology'
  },
  {
    id: '11',
    title: 'Breaking: Major Political Event Shakes The Nation',
    creator: 'News Network',
    views: 3247891,
    uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    thumbnail: thumbnail3,
    duration: '12:22',
    category: 'News & Politics'
  },
  {
    id: '12',
    title: 'Cinematic Short Film: The Last Journey',
    creator: 'Indie Filmmaker',
    views: 412567,
    uploadedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    thumbnail: thumbnail6,
    duration: '9:33',
    category: 'Short Movies'
  }
];