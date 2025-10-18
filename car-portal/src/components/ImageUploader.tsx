'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { deleteImage } from '@/app/actions/imageActions';

interface ImageUploaderProps {
  name: string;
  initialImages?: string[];
}

export default function ImageUploader({ name, initialImages = [] }: ImageUploaderProps) {
  const [files, setFiles] = useState<string[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Almacena la URL del archivo que se está eliminando
  const [hiddenInputValue, setHiddenInputValue] = useState(JSON.stringify(initialImages));

  useEffect(() => {
    setHiddenInputValue(JSON.stringify(files));
  }, [files]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          body: file,
        });

        if (!response.ok) {
          throw new Error('Failed to upload file.');
        }

        const newBlob = await response.json();
        return newBlob.url;
      });

      const newUrls = await Promise.all(uploadPromises);
      setFiles((prevFiles) => [...prevFiles, ...newUrls]);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error al subir las imágenes. Por favor, inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
    disabled: isUploading || !!isDeleting,
  });

  const removeFile = async (url: string) => {
    setIsDeleting(url);
    try {
      const result = await deleteImage(url);
      if (result.error) {
        throw new Error(result.error);
      }
      setFiles((prevFiles) => prevFiles.filter((fileUrl) => fileUrl !== url));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('No se pudo eliminar la imagen. Por favor, inténtalo de nuevo.');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        ${isUploading ? 'cursor-not-allowed bg-gray-200' :
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <p>Subiendo imágenes...</p>
        ) : isDragActive ? (
          <p>Suelta las imágenes aquí...</p>
        ) : (
          <p>Arrastra y suelta algunas imágenes aquí, o haz clic para seleccionarlas.</p>
        )}
      </div>

      <input type="hidden" name={name} value={hiddenInputValue} />

      <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {files.map((url) => (
          <div key={url} className="relative">
            <img src={url} alt={`Preview ${url}`} className="w-full h-24 object-cover rounded-lg" />
            <button
              type="button"
              onClick={() => removeFile(url)}
              disabled={isDeleting === url}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center -mt-2 -mr-2 disabled:bg-gray-400"
            >
              {isDeleting === url ? '...' : '×'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}