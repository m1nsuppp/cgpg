import { cn } from '@/lib/utils/cn';
import { type PropsWithChildren, useCallback, useRef, type JSX } from 'react';
import { useDPR } from '../dpr-context';
import { Dropzone } from './dropzone';
import { useBackgroundRemover } from '../background-remover-context';
import { useMutation } from '@tanstack/react-query';

export function Stage(): JSX.Element {
  const dpr = useDPR();
  const backgroundRemover = useBackgroundRemover();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { mutate: removeBackground, isPending: isRemoveBackgroundPending } = useMutation({
    mutationFn: backgroundRemover.removeBackground,
  });

  return (
    <Dropzone
      onDrop={(imageFile) => {
        removeBackground(imageFile, {
          onSuccess: (backgroundRemoved) => {
            const { current: canvas } = canvasRef;
            if (canvas === null) {
              return;
            }

            const image = new Image();
            image.src = URL.createObjectURL(backgroundRemoved);
            image.onload = () => {
              const ctx = canvas.getContext('2d');
              if (ctx === null) {
                return;
              }

              const dx = 0;
              const dy = 0;

              ctx.drawImage(image, dx, dy, image.width, image.height);
            };
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
          }}
        >
          {(() => {
            if (isDragActive) {
              return <p>drop here!</p>;
            }

            if (isRemoveBackgroundPending) {
              return <p>loading...</p>;
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
        className="w-full h-full"
      >
        {children}
      </div>
    </div>
  );
}
