import mammoth from 'mammoth';

export async function parseFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } else if (extension === 'md' || extension === 'markdown' || extension === 'txt') {
    return await file.text();
  } else {
    throw new Error('Unsupported file format. Please upload .docx, .md, or .txt files.');
  }
}
