import { useState, type JSX } from 'react';
import { useBackgroundRemover } from '../contexts/background-remover-context';

const NO_FILES_SELECTED = 0;

export function Home(): JSX.Element {
  const backgroundRemover = useBackgroundRemover();

  const [backgroundRemoved, setBackgroundRemoved] = useState<Blob | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div className="w-screen h-screen bg-amber-300 flex justify-center items-center">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files !== null) {
            if (e.target.files.length === NO_FILES_SELECTED) {
              return;
            }

            const firstIndex = 0;
            const {
              target: {
                files: { [firstIndex]: file },
              },
            } = e;

            setIsLoading(true);
            backgroundRemover
              .removeBackground(file)
              .then((result) => {
                setBackgroundRemoved(result);
              })
              .catch((error: unknown) => {
                if (error instanceof Error) {
                  throw new Error(error.message);
                }
              })
              .finally(() => {
                setIsLoading(false);
              });
          }
        }}
      />

      {backgroundRemoved !== null && (
        <img
          src={URL.createObjectURL(backgroundRemoved)}
          alt="Background removed"
        />
      )}

      {isLoading && <div>Loading...</div>}
    </div>
  );
}
