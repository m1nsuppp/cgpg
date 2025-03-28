interface BackgroundRemover {
  removeBackground: (image: Blob) => Promise<Blob>;
}

export { type BackgroundRemover };
