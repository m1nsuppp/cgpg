import { useState, type JSX } from 'react';
import { useBackgroundRemover } from '../contexts/background-remover-context';

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
          if (e.target.files) {
            if (e.target.files.length === 0) {
              return;
            }

            const file = e.target.files[0];

            setIsLoading(true);
            backgroundRemover
              .removeBackground(file)
              .then((result) => {
                setBackgroundRemoved(result);
              })
              .catch((error) => {
                console.error(error);
              })
              .finally(() => {
                setIsLoading(false);
              });
          }
        }}
      />

      {backgroundRemoved && (
        <img
          src={URL.createObjectURL(backgroundRemoved)}
          alt="Background removed"
        />
      )}

      {isLoading && <div>Loading...</div>}
    </div>
  );
}
