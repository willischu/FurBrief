declare module 'pdf-parse' {
  const pdfParse: (data: Buffer | ArrayBuffer | Uint8Array, options?: object) => Promise<{ text: string; } & Record<string, unknown>>;
  export default pdfParse;
}
