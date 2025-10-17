'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
  name: string;
  initialImages?: string[];
}

// Helper function to convert a file to a Base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function ImageUploader({ name, initialImages = [] }: ImageUploaderProps) {
  const [files, setFiles] = useState<string[]>(initialImages);
  const [hiddenInputValue, setHiddenInputValue] = useState(JSON.stringify(initialImages));

  // Update the hidden input whenever the files change
  useEffect(() => {
    setHiddenInputValue(JSON.stringify(files));
  }, [files]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const base64Promises = acceptedFiles.map(fileToBase64);
    try {
      const newBase64Files = await Promise.all(base64Promises);
      setFiles((prevFiles) => [...prevFiles, ...newBase64Files]);
    } catch (error) {
      console.error('Error converting files to Base64:', error);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
  });

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Suelta las imágenes aquí...</p>
        ) : (
          <p>Arrastra y suelta algunas imágenes aquí, o haz clic para seleccionarlas.</p>
        )}
      </div>

      {/* Hidden input to hold the Base64 strings for form submission */}
      <input type="hidden" name={name} value={hiddenInputValue} />

      {/* Previews */}
      <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {files.map((base64, index) => (
          <div key={index} className="relative">
            <img src={base64} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-lg" />
            <button
              type="button"
              onClick={() => removeFile(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center -mt-2 -mr-2"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}