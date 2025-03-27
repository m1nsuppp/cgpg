export interface BackgroundRemover {
  removeBackground(image: Blob): Promise<Blob>;
}
