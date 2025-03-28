import clsx from 'clsx';

type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | bigint
  | null
  | boolean
  | undefined;
type ClassDictionary = Record<string, unknown>;
type ClassArray = ClassValue[];

export function cn(...args: ClassValue[]): string {
  return clsx(args);
}
