import React from 'react';
import { useContextFlow } from '../../context/ContextFlowContext';

import anthropicSvg from '../../assets/logos/anthropic.svg?raw';
import geminiSvg from '../../assets/logos/googlegemini.svg?raw';
import metaSvg from '../../assets/logos/meta.svg?raw';
import mistralSvg from '../../assets/logos/mistralai.svg?raw';
import deepseekSvg from '../../assets/logos/deepseek.svg?raw';
import huggingfaceSvg from '../../assets/logos/huggingface.svg?raw';
import perplexitySvg from '../../assets/logos/perplexity.svg?raw';
import ollamaSvg from '../../assets/logos/ollama.svg?raw';
import langchainSvg from '../../assets/logos/langchain.svg?raw';
import neo4jSvg from '../../assets/logos/neo4j.svg?raw';
import qdrantSvg from '../../assets/logos/qdrant.svg?raw';
import databricksSvg from '../../assets/logos/databricks.svg?raw';
import nvidiaSvg from '../../assets/logos/nvidia.svg?raw';
import pytorchSvg from '../../assets/logos/pytorch.svg?raw';

interface Brand {
  id: string;
  name: string;
  brand: string;
  svg: string;
}

const ROW_ONE: Brand[] = [
  { id: 'anthropic', name: 'Anthropic', brand: '#D97757', svg: anthropicSvg },
  { id: 'gemini', name: 'Google Gemini', brand: '#8E75B2', svg: geminiSvg },
  { id: 'meta', name: 'Meta', brand: '#0467DF', svg: metaSvg },
  { id: 'mistral', name: 'Mistral AI', brand: '#FA520F', svg: mistralSvg },
  { id: 'deepseek', name: 'DeepSeek', brand: '#5786FE', svg: deepseekSvg },
  { id: 'huggingface', name: 'Hugging Face', brand: '#FFD21E', svg: huggingfaceSvg },
  { id: 'perplexity', name: 'Perplexity', brand: '#1FB8CD', svg: perplexitySvg },
];

const ROW_TWO: Brand[] = [
  { id: 'ollama', name: 'Ollama', brand: '#9CA3AF', svg: ollamaSvg },
  { id: 'langchain', name: 'LangChain', brand: '#7FC8FF', svg: langchainSvg },
  { id: 'neo4j', name: 'Neo4j', brand: '#4581C3', svg: neo4jSvg },
  { id: 'qdrant', name: 'Qdrant', brand: '#DC244C', svg: qdrantSvg },
  { id: 'databricks', name: 'Databricks', brand: '#FF3621', svg: databricksSvg },
  { id: 'nvidia', name: 'NVIDIA', brand: '#76B900', svg: nvidiaSvg },
  { id: 'pytorch', name: 'PyTorch', brand: '#EE4C2C', svg: pytorchSvg },
];

const BrandCard: React.FC<{ brand: Brand }> = ({ brand }) => (
  <div
    className="brand-card shrink-0 w-[136px] sm:w-[152px]"
    style={{ '--brand': brand.brand } as React.CSSProperties}
  >
    <span className="brand-logo" aria-hidden="true" dangerouslySetInnerHTML={{ __html: brand.svg }} />
    <span className="brand-name">{brand.name}</span>
  </div>
);

const BrandTrack: React.FC<{
  brands: Brand[];
  trackClass: string;
  rowId: string;
}> = ({ brands, trackClass, rowId }) => (
  <div className={`flex ${trackClass} pause-on-hover gap-4 py-2`}>
    {[...brands, ...brands, ...brands, ...brands].map((brand, idx) => (
      <BrandCard key={`${rowId}-${brand.id}-${idx}`} brand={brand} />
    ))}
  </div>
);

export const TrustedEcosystemMarquee: React.FC = () => {
  const { state } = useContextFlow();
  const isLight = state.settings.colorMode === 'light';

  return (
    <section
      id="trusted-ecosystem"
      aria-label="Supported AI Ecosystem Logos"
      className={`relative w-full border-b overflow-hidden transition-colors duration-200 ${
        isLight ? 'border-zinc-200 bg-zinc-50' : 'border-zinc-800 bg-zinc-950'
      }`}
    >
      <div className="py-12 sm:py-14">
        {/* Marquee Container with Gradient Hiding Masks on Both Sides */}
        <div className="relative w-full overflow-hidden space-y-4">
          <div
            className={`pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 z-20 ${
              isLight
                ? 'bg-gradient-to-r from-zinc-50 via-zinc-50/85 to-transparent'
                : 'bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-transparent'
            }`}
          />
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 z-20 ${
              isLight
                ? 'bg-gradient-to-l from-zinc-50 via-zinc-50/85 to-transparent'
                : 'bg-gradient-to-l from-zinc-950 via-zinc-950/85 to-transparent'
            }`}
          />

          {/* Track 1: moving left */}
          <BrandTrack brands={ROW_ONE} trackClass="animate-marquee-left" rowId="row1" />

          {/* Track 2: moving right */}
          <BrandTrack brands={ROW_TWO} trackClass="animate-marquee-right" rowId="row2" />
        </div>
      </div>
    </section>
  );
};
