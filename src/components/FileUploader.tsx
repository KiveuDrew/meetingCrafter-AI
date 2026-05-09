import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  error?: string;
}

export function FileUploader({ onFileSelect, selectedFile, error }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/markdown': ['.md'],
      'text/plain': ['.txt'],
    },
    multiple: false,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300",
          "p-8 text-center",
          isDragActive ? "border-indigo-500 bg-indigo-50/50" : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50",
          selectedFile ? "border-emerald-500 bg-emerald-50/30" : ""
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            "p-4 rounded-full transition-colors duration-300",
            selectedFile ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"
          )}>
            {selectedFile ? <FileText size={32} /> : <Upload size={32} />}
          </div>
          
          <div className="space-y-1">
            <h3 className="font-semibold text-slate-900">
              {selectedFile ? selectedFile.name : "Upload meeting brief"}
            </h3>
            <p className="text-sm text-slate-500">
              {selectedFile 
                ? "Click or drag to replace" 
                : "Drop your .docx or .md file here"}
            </p>
          </div>
        </div>

        {selectedFile && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-emerald-600">
            <CheckCircle2 size={16} />
            File ready for processing
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-rose-600 animate-in fade-in slide-in-from-top-1">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
}
