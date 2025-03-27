import type { BackgroundRemover } from './background-remover.interface';
import { removeBackground as imglyRemoveBackground } from '@imgly/background-removal';

export function createImglyBackgroundRemover(): BackgroundRemover {
  return {
    async removeBackground(image) {
      return imglyRemoveBackground(image);
    },
  };
}
