import { cn } from '@/lib/utils/cn';
import { type PropsWithChildren, type JSX, useCallback, useRef, useState, useEffect } from 'react';
import { useDPR } from '../dpr-context';
import { Dropzone } from './dropzone';
import { useBackgroundRemover } from '../background-remover-context';
import { useMutation, useQueries } from '@tanstack/react-query';
import { loadHTMLImageElement } from '@/lib/utils/image';
import { Upload as UploadIcon, Loader } from 'lucide-react';

export function Stage(): JSX.Element {
  const dpr = useDPR();
  const backgroundRemover = useBackgroundRemover();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { mutate: removeBackground, isPending: isRemoveBackgroundPending } = useMutation({
    mutationFn: backgroundRemover.removeBackground,
  });

  const [imageURLs, setImageURLs] = useState<string[]>([]);

  const { htmlImageElements, isLoadHTMLImageElementPending } = useQueries({
    queries: imageURLs.map((imageURL) => ({
      queryKey: ['imageElement', imageURL],
      queryFn: async () => await loadHTMLImageElement(imageURL),
      staleTime: Infinity,
    })),
    combine: (queryResults) => ({
      htmlImageElements: queryResults.map((queryResult) => queryResult.data),
      isLoadHTMLImageElementPending: queryResults.some((queryResult) => queryResult.isPending),
    }),
  });

  const drawImages = (context: CanvasRenderingContext2D, images: HTMLImageElement[]): void => {
    images.forEach((htmlImageElement) => {
      const halfFactor = 2;
      const dx = context.canvas.width / halfFactor - htmlImageElement.width / halfFactor;
      const dy = context.canvas.height / halfFactor - htmlImageElement.height / halfFactor;
      context.drawImage(htmlImageElement, dx, dy);
    });
  };

  useEffect(() => {
    const { current: canvas } = canvasRef;
    if (canvas === null) {
      return;
    }

    const context = canvas.getContext('2d');
    if (context === null) {
      return;
    }

    drawImages(
      context,
      htmlImageElements.filter((htmlImageElement) => htmlImageElement !== undefined),
    );
  }, [htmlImageElements, imageURLs]);

  return (
    <Dropzone
      onDrop={(imageFile) => {
        removeBackground(imageFile, {
          onSuccess: (backgroundRemoved) => {
            const { current: canvas } = canvasRef;
            if (canvas === null) {
              return;
            }

            const ctx = canvas.getContext('2d');
            if (ctx === null) {
              return;
            }

            const url = URL.createObjectURL(backgroundRemoved);
            setImageURLs((prev) => [url, ...prev]);
          },
        });
      }}
      disabled={isRemoveBackgroundPending}
    >
      {({ isDragActive }) => (
        <StageWrapper
          onResize={(width, height) => {
            if (canvasRef.current === null) {
              return;
            }

            canvasRef.current.width = width * dpr;
            canvasRef.current.height = height * dpr;
            canvasRef.current.style.maxWidth = `${width}px`;
            canvasRef.current.style.maxHeight = `${height}px`;

            const context = canvasRef.current.getContext('2d');
            if (context === null) {
              return;
            }

            drawImages(
              context,
              htmlImageElements.filter((htmlImageElement) => htmlImageElement !== undefined),
            );
          }}
        >
          {(() => {
            if (isDragActive) {
              return (
                <div
                  className={cn(
                    'absolute left-0 top-0',
                    'flex justify-center items-center',
                    'w-full h-full',
                    'bg-green-400 rounded',
                  )}
                >
                  <UploadIcon color="white" />
                </div>
              );
            }

            if (isRemoveBackgroundPending || isLoadHTMLImageElementPending) {
              return (
                <div
                  className={cn(
                    'absolute left-0 top-0',
                    'flex justify-center items-center',
                    'w-full h-full',
                  )}
                >
                  <Loader />
                </div>
              );
            }

            return null;
          })()}
          <canvas
            ref={canvasRef}
            className="w-full h-full"
          />
        </StageWrapper>
      )}
    </Dropzone>
  );
}

function StageWrapper({
  children,
  onResize,
}: PropsWithChildren<{
  onResize: (width: number, height: number) => void;
}>): JSX.Element {
  const parentRef = useCallback((node: HTMLDivElement | null) => {
    if (node === null) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (targetRef.current === null) {
          return;
        }

        const {
          contentRect: { width: parentNaturalWidth, height: parentNaturalHeight },
        } = entry;
        const minDimension = Math.min(parentNaturalWidth, parentNaturalHeight);
        targetRef.current.style.maxWidth = `${minDimension}px`;
        targetRef.current.style.maxHeight = `${minDimension}px`;
        onResize(minDimension, minDimension);
      }
    });
    resizeObserver.observe(node);

    return () => {
      resizeObserver.unobserve(node);
      resizeObserver.disconnect();
    };
  }, []);

  const targetRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={parentRef}
      className={cn('flex justify-center items-center', 'w-full h-full', 'p-12')}
    >
      <div
        ref={targetRef}
        className={cn('relative', 'w-full h-full', 'rounded border border-gray-300')}
      >
        {children}
      </div>
    </div>
  );
}
