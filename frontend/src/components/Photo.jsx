import { useEffect, useState } from 'react';

// Lazy-loaded HD photo layered over a fallback. The parent must be `relative` with a fixed aspect ratio.
// If the image is missing or fails, the fallback stays visible (and onFail fires).
export default function Photo({ src, alt, fallback = null, priority = false, className = '', onFail }) {
  const [status, setStatus] = useState('loading'); // loading | ok | failed

  useEffect(() => {
    setStatus('loading');
  }, [src]);

  return (
    <>
      {fallback}
      {src && status !== 'failed' && (
        <img
          key={src}
          src={src}
          alt={alt}
          decoding="async"
          loading={priority ? 'eager' : 'lazy'}
          fetchpriority={priority ? 'high' : undefined}
          onLoad={() => setStatus('ok')}
          onError={() => {
            setStatus('failed');
            if (onFail) onFail();
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ${
            status === 'ok' ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        />
      )}
    </>
  );
}
