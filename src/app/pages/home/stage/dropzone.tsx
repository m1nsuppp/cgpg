import type { JSX, ReactNode } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneProps {
  onDrop: (file: File) => void;
  children: (state: { isDragActive: boolean }) => ReactNode;
  disabled?: boolean;
}

export function Dropzone({
  onDrop: handleDrop,
  children,
  disabled = false,
}: DropzoneProps): JSX.Element {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      const [file] = files;
      handleDrop(file);
    },
    noClick: true,
    noKeyboard: true,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className="w-full h-full"
    >
      <input
        {...getInputProps()}
        type="file"
        accept="image/*"
        multiple={false}
        className="hidden"
      />
      {children({ isDragActive })}
    </div>
  );
}
