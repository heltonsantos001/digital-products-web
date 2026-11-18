import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { getProductImageUrl } from '../../services/api';

interface StoreProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
}

export const StoreProductImage: React.FC<StoreProductImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  aspectRatio = 'aspect-[3/4]',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const resolvedUrl = getProductImageUrl(src);

  return (
    <div
      className={`relative overflow-hidden ${aspectRatio} ${containerClassName} bg-[#f5effa] flex items-center justify-center`}
    >
      {/* Loading Skeleton: discreto e elegante, sem usar imagens fictícias de prévia */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#f5effa] via-[#fcf8ff] to-[#f5effa] animate-pulse flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-[#cebddf] opacity-60" />
        </div>
      )}

      {/* Imagem original do produto */}
      {resolvedUrl && !hasError ? (
        <img
          src={resolvedUrl}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`${className} transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : hasError || !resolvedUrl ? (
        <div className="flex flex-col items-center justify-center p-4 text-center text-[#9585ad] select-none">
          <BookOpen className="w-8 h-8 text-[#bda9d6] mb-1.5" />
          <span className="text-[11px] font-bold">PDF Digital</span>
        </div>
      ) : null}
    </div>
  );
};
