import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Video,
  Image,
  Film,
  Search,
  Sparkles,
  Zap,
  Globe,
  Layers,
  Aperture,
  Palette,
  Monitor,
  Clapperboard,
  Box,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import type { Engine } from '../../types';

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Video,
  Image,
  Film,
  Sparkles,
  Zap,
  Globe,
  Layers,
  Aperture,
  Palette,
  Monitor,
  Clapperboard,
  Box,
};

const engines: Engine[] = [
  // VIDEO AI
  {
    id: 'runway-gen3',
    name: 'Runway Gen-3 Alpha',
    category: 'video',
    description: 'High-fidelity video generation with precise motion control',
    icon: 'Video',
    tip: 'Use specific motion descriptors like "slow pan left" or "zoom in gradually" for best results.',
    promptTemplate: 'A cinematic shot of {subject}, {style} style, {motion} camera movement, highly detailed, atmospheric lighting, 4K quality, {duration} seconds',
    fields: [
      { id: 'subject', label: 'Subject', type: 'textarea', placeholder: 'Describe the scene, characters, setting...', required: true },
      { id: 'style', label: 'Visual Style', type: 'select', options: ['cinematic', 'neon-noir', 'anime', 'documentary', 'fantasy', 'sci-fi', 'vintage'], defaultValue: 'cinematic' },
      { id: 'motion', label: 'Camera Motion', type: 'select', options: ['static', 'slow pan', 'tracking shot', 'drone aerial', 'dolly zoom', 'handheld', 'orbit'], defaultValue: 'slow pan' },
      { id: 'duration', label: 'Duration', type: 'slider', min: 1, max: 10, step: 1, defaultValue: 5 },
      { id: 'lighting', label: 'Atmospheric Lighting', type: 'toggle', defaultValue: true },
    ],
  },
  {
    id: 'pika-labs',
    name: 'Pika Labs 2.0',
    category: 'video',
    description: 'Creative video generation with style transfer and lip sync',
    icon: 'Sparkles',
    tip: 'Pika excels at stylized and animated content. Try combining unexpected styles.',
    promptTemplate: '{subject} in {style} style, {motion} motion, vibrant colors, creative composition, high quality render',
    fields: [
      { id: 'subject', label: 'Subject', type: 'textarea', placeholder: 'What do you want to animate?', required: true },
      { id: 'style', label: 'Art Style', type: 'select', options: ['3D render', 'watercolor', 'pixel art', 'oil painting', 'sketch', 'anime', 'low-poly'], defaultValue: '3D render' },
      { id: 'motion', label: 'Motion Type', type: 'select', options: ['gentle', 'energetic', 'smooth', 'chaotic', 'flowing'], defaultValue: 'smooth' },
      { id: 'negativePrompt', label: 'Negative Prompt', type: 'text', placeholder: 'Things to avoid...' },
    ],
  },
  {
    id: 'stable-video',
    name: 'Stable Video Diffusion',
    category: 'video',
    description: 'Open-source video generation with fine-tuning support',
    icon: 'Layers',
    tip: 'SVD works best with well-composed still images as starting frames.',
    promptTemplate: 'Transform into video: {subject}, motion style: {motion}, quality: {quality}, frames: {fps}fps',
    fields: [
      { id: 'subject', label: 'Scene Description', type: 'textarea', placeholder: 'Describe your scene in detail...', required: true },
      { id: 'motion', label: 'Motion Amount', type: 'slider', min: 1, max: 10, step: 1, defaultValue: 5 },
      { id: 'fps', label: 'Frame Rate', type: 'select', options: ['24', '30', '60'], defaultValue: '24' },
      { id: 'quality', label: 'Quality Preset', type: 'select', options: ['draft', 'standard', 'high', 'ultra'], defaultValue: 'high' },
    ],
  },
  {
    id: 'luma-dream',
    name: 'Luma Dream Machine',
    category: 'video',
    description: 'Photorealistic video with natural physics and motion',
    icon: 'Zap',
    tip: 'Describe physical interactions for realistic motion - objects colliding, fluids, etc.',
    promptTemplate: 'Photorealistic video: {subject}, camera: {camera}, environment: {environment}, natural lighting, physics-accurate motion',
    fields: [
      { id: 'subject', label: 'Main Subject', type: 'textarea', placeholder: 'Describe the main action or subject...', required: true },
      { id: 'camera', label: 'Camera Angle', type: 'select', options: ['eye level', 'low angle', 'high angle', 'birds eye', 'worms eye', 'dutch angle'], defaultValue: 'eye level' },
      { id: 'environment', label: 'Environment', type: 'text', placeholder: 'e.g. rainy street, sunny beach, studio' },
      { id: 'seed', label: 'Random Seed', type: 'number', placeholder: 'Leave empty for random' },
    ],
  },
  {
    id: 'sora',
    name: 'Sora by OpenAI',
    category: 'video',
    description: 'Long-form video generation up to 60 seconds',
    icon: 'Globe',
    tip: 'Sora excels at complex scenes with multiple characters. Be descriptive.',
    promptTemplate: '{subject}, shot on {camera}, in the style of {style}, {duration}s duration, complex scene with rich detail',
    fields: [
      { id: 'subject', label: 'Scene Description', type: 'textarea', placeholder: 'Detailed description of the scene, characters, actions...', required: true },
      { id: 'camera', label: 'Camera Type', type: 'select', options: ['ARRI Alexa', 'RED V-Raptor', 'Sony Venice', 'DSLR', 'iPhone', 'Vintage 16mm'], defaultValue: 'ARRI Alexa' },
      { id: 'style', label: 'Cinematic Style', type: 'select', options: ['Hollywood blockbuster', 'Indie film', 'Documentary', 'Music video', 'Commercial'], defaultValue: 'Hollywood blockbuster' },
      { id: 'duration', label: 'Duration (seconds)', type: 'slider', min: 5, max: 60, step: 5, defaultValue: 10 },
    ],
  },
  {
    id: 'haiper',
    name: 'Haiper Video',
    category: 'video',
    description: 'Efficient video generation with style presets',
    icon: 'Monitor',
    tip: 'Use Haiper\'s style presets to quickly achieve professional looks.',
    promptTemplate: '{subject}, visual style: {style}, mood: {mood}, camera: {camera}, high production value',
    fields: [
      { id: 'subject', label: 'Prompt', type: 'textarea', placeholder: 'Describe your video...', required: true },
      { id: 'style', label: 'Style Preset', type: 'select', options: ['Cinematic', 'Anime', 'Realistic', 'Fantasy', 'Cyberpunk', 'Vintage'], defaultValue: 'Cinematic' },
      { id: 'mood', label: 'Mood', type: 'select', options: ['Epic', 'Calm', 'Tense', 'Joyful', 'Mysterious', 'Romantic'], defaultValue: 'Epic' },
      { id: 'camera', label: 'Camera Work', type: 'select', options: ['Static', 'Slow push', 'Orbit', 'Tracking', 'Aerial'], defaultValue: 'Slow push' },
    ],
  },
  // IMAGE AI
  {
    id: 'midjourney-v6',
    name: 'Midjourney V6',
    category: 'image',
    description: 'Industry-leading artistic image generation',
    icon: 'Palette',
    tip: 'Use --stylize values between 100-500 for a balance of coherence and artistry.',
    promptTemplate: '{subject}, style: {style}, aspect ratio: {aspectRatio}, quality: {quality}, highly detailed',
    fields: [
      { id: 'subject', label: 'Image Prompt', type: 'textarea', placeholder: 'Describe the image you want to create...', required: true },
      { id: 'style', label: 'Art Style', type: 'select', options: ['photorealistic', 'anime', 'oil painting', 'digital art', 'concept art', 'minimalist', 'surrealism'], defaultValue: 'digital art' },
      { id: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['1:1', '16:9', '9:16', '4:3', '3:2', '2:3'], defaultValue: '16:9' },
      { id: 'quality', label: 'Quality', type: 'select', options: ['.25', '.5', '1'], defaultValue: '1' },
      { id: 'stylize', label: 'Stylization', type: 'slider', min: 0, max: 1000, step: 50, defaultValue: 250 },
    ],
  },
  {
    id: 'dalle-3',
    name: 'DALL-E 3',
    category: 'image',
    description: 'Precise image generation with text understanding',
    icon: 'Aperture',
    tip: 'DALL-E 3 understands complex prompts with multiple objects and relationships.',
    promptTemplate: 'Create an image of {subject}, art style: {style}, mood: {mood}, lighting: {lighting}, high detail',
    fields: [
      { id: 'subject', label: 'Description', type: 'textarea', placeholder: 'Detailed description of the image...', required: true },
      { id: 'style', label: 'Style', type: 'select', options: ['Natural', 'Vivid', 'Oil painting', 'Watercolor', 'Digital', 'Line art'], defaultValue: 'Vivid' },
      { id: 'mood', label: 'Mood', type: 'select', options: ['Cheerful', 'Dark', 'Ethereal', 'Dramatic', 'Peaceful', 'Energetic'], defaultValue: 'Cheerful' },
      { id: 'lighting', label: 'Lighting', type: 'select', options: ['Natural daylight', 'Golden hour', 'Neon', 'Studio', 'Candlelight', 'Moonlight'], defaultValue: 'Natural daylight' },
    ],
  },
  {
    id: 'stable-diffusion-xl',
    name: 'Stable Diffusion XL',
    category: 'image',
    description: 'Open-source image generation with extensive customization',
    icon: 'Box',
    tip: 'Use negative prompts to exclude unwanted elements. Lower CFG for more creativity.',
    promptTemplate: 'masterpiece, best quality, {subject}, style: {style}, resolution: {resolution}, detailed',
    fields: [
      { id: 'subject', label: 'Prompt', type: 'textarea', placeholder: 'Describe your image...', required: true },
      { id: 'style', label: 'Model Style', type: 'select', options: ['Photorealistic', 'Anime', 'Fantasy', 'Cinematic', '3D Render', 'Comic'], defaultValue: 'Photorealistic' },
      { id: 'resolution', label: 'Resolution', type: 'select', options: ['512x512', '768x768', '1024x1024', '1024x1536', '1536x1024'], defaultValue: '1024x1024' },
      { id: 'cfg', label: 'CFG Scale', type: 'slider', min: 1, max: 20, step: 0.5, defaultValue: 7 },
      { id: 'steps', label: 'Inference Steps', type: 'slider', min: 10, max: 50, step: 5, defaultValue: 25 },
    ],
  },
  {
    id: 'flux-pro',
    name: 'FLUX Pro',
    category: 'image',
    description: 'State-of-the-art image quality with prompt precision',
    icon: 'Sparkles',
    tip: 'FLUX Pro handles complex compositions and text in images exceptionally well.',
    promptTemplate: '{subject}, rendered in {style} style, {lighting} lighting, ultra high quality, photorealistic details',
    fields: [
      { id: 'subject', label: 'Prompt', type: 'textarea', placeholder: 'Describe the image in detail...', required: true },
      { id: 'style', label: 'Rendering Style', type: 'select', options: ['Photorealistic', 'Illustration', 'Architectural', 'Fashion', 'Product', 'Portrait'], defaultValue: 'Photorealistic' },
      { id: 'lighting', label: 'Lighting Setup', type: 'select', options: ['Natural', 'Studio', 'Dramatic', 'Softbox', 'Ambient', 'Spotlight'], defaultValue: 'Natural' },
    ],
  },
  {
    id: 'ideogram',
    name: 'Ideogram 2.0',
    category: 'image',
    description: 'Superior text rendering within images',
    icon: 'Image',
    tip: 'Place text in quotes for best rendering. Ideogram excels at posters and logos.',
    promptTemplate: '{subject} with text "{text}", design style: {style}, layout: {layout}, professional quality',
    fields: [
      { id: 'subject', label: 'Visual Description', type: 'textarea', placeholder: 'Describe the visual elements...', required: true },
      { id: 'text', label: 'Text to Render', type: 'text', placeholder: 'Enter text to include in the image...' },
      { id: 'style', label: 'Design Style', type: 'select', options: ['Poster', 'Logo', 'Social media', 'Typography art', 'Book cover', 'Flyer'], defaultValue: 'Poster' },
      { id: 'layout', label: 'Layout', type: 'select', options: ['Centered', 'Asymmetrical', 'Grid', 'Minimal', 'Full bleed'], defaultValue: 'Centered' },
    ],
  },
  // STORYBOARD
  {
    id: 'storyboard-ai',
    name: 'Storyboard AI',
    category: 'storyboard',
    description: 'AI-powered storyboard generation from scripts',
    icon: 'Clapperboard',
    tip: 'Break your scene into individual shots. Describe each shot\'s composition and action.',
    promptTemplate: 'Storyboard scene: {scene}, genre: {genre}, visual style: {style}, number of frames: {frames}',
    fields: [
      { id: 'scene', label: 'Scene Description', type: 'textarea', placeholder: 'Describe the scene beat by beat...', required: true },
      { id: 'genre', label: 'Genre', type: 'select', options: ['Action', 'Drama', 'Comedy', 'Horror', 'Sci-Fi', 'Romance', 'Documentary'], defaultValue: 'Drama' },
      { id: 'style', label: 'Storyboard Style', type: 'select', options: ['Sketch', 'Detailed', 'Color', 'Minimalist', 'Cinematic'], defaultValue: 'Sketch' },
      { id: 'frames', label: 'Number of Frames', type: 'slider', min: 3, max: 20, step: 1, defaultValue: 6 },
    ],
  },
];

export function getEngineById(id: string): Engine | undefined {
  return engines.find((e) => e.id === id);
}

export function getEnginesByCategory(category: string): Engine[] {
  return engines.filter((e) => e.category === category);
}

export default function EnginePicker() {
  const { selectedEngineId, setSelectedEngine } = useStore();
  const [search, setSearch] = useState('');

  const videoEngines = engines.filter(
    (e) => e.category === 'video' && (!search || e.name.toLowerCase().includes(search.toLowerCase()))
  );
  const imageEngines = engines.filter(
    (e) => e.category === 'image' && (!search || e.name.toLowerCase().includes(search.toLowerCase()))
  );
  const storyboardEngines = engines.filter(
    (e) => e.category === 'storyboard' && (!search || e.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-[280px] flex-shrink-0 h-full overflow-y-auto border-r border-border bg-bg-card/40 backdrop-blur-sm"
    >
      <div className="p-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search engines..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-bg-elevated border border-border text-sm text-text-primary placeholder-text-muted focus:border-cyan transition-colors"
          />
        </div>

        {/* VIDEO AI */}
        {videoEngines.length > 0 && (
          <EngineGroup
            label="VIDEO AI"
            count={videoEngines.length}
            engines={videoEngines}
            selectedId={selectedEngineId}
            onSelect={setSelectedEngine}
            delay={0}
          />
        )}

        {/* IMAGE AI */}
        {imageEngines.length > 0 && (
          <EngineGroup
            label="IMAGE AI"
            count={imageEngines.length}
            engines={imageEngines}
            selectedId={selectedEngineId}
            onSelect={setSelectedEngine}
            delay={0.1}
          />
        )}

        {/* STORYBOARD */}
        {storyboardEngines.length > 0 && (
          <EngineGroup
            label="STORYBOARD"
            count={storyboardEngines.length}
            engines={storyboardEngines}
            selectedId={selectedEngineId}
            onSelect={setSelectedEngine}
            delay={0.2}
          />
        )}
      </div>
    </motion.div>
  );
}

function EngineGroup({
  label,
  count,
  engines,
  selectedId,
  onSelect,
  delay,
}: {
  label: string;
  count: number;
  engines: Engine[];
  selectedId: string;
  onSelect: (id: string) => void;
  delay: number;
}) {
  return (
    <div className="mb-5">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay }}
        className="flex items-center gap-2 mb-2 px-1"
      >
        <span className="text-[10px] font-bold tracking-wider text-text-muted">{label}</span>
        <span className="text-[10px] text-text-muted bg-bg-elevated px-1.5 py-0.5 rounded-full">{count}</span>
      </motion.div>

      <div className="space-y-1.5">
        {engines.map((engine, i) => {
          const Icon = iconMap[engine.icon] || Box;
          const isActive = selectedId === engine.id;
          return (
            <motion.button
              key={engine.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + i * 0.03 }}
              onClick={() => onSelect(engine.id)}
              className={`w-full text-left p-2.5 rounded-lg transition-all duration-200 border ${
                isActive
                  ? 'bg-cyan/10 border-cyan/40 shadow-[0_0_12px_rgba(0,212,255,0.1)]'
                  : 'bg-transparent border-transparent hover:bg-bg-elevated/60 hover:border-border-hover'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${
                    isActive
                      ? 'bg-cyan/20 text-cyan'
                      : 'bg-bg-elevated text-text-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      isActive ? 'text-cyan' : 'text-text-primary'
                    }`}
                  >
                    {engine.name}
                  </p>
                  <p className="text-[11px] text-text-muted truncate leading-tight mt-0.5">
                    {engine.description}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
