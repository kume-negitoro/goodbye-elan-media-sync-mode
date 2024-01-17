import { useCallback, useState } from 'react'
import DropZone, { useDropzone } from 'react-dropzone'
import { readAsDataURL } from './utils/fileReadAsync'

export interface VideoDropAreaProps {
  onFilesEntry: (urls: string[]) => void
}

export const VideoDropArea = (props: VideoDropAreaProps) => {
  return (
    <div className="flex">
      <div className="flex-1"></div>
      <DropZone
        accept={{
          'video/mp4': ['.mp4', '.mp4v', '.MP4'],
          'video/webm': ['.webm'],
          'video/x-msvideo': ['.avi', '.AVI'],
          'video/quicktime': ['.mov', '.MOV'],
          'video/x-matroska': ['.mkv'],
          'video/x-ms-wmv': ['.wmv'],
        }}
        onDrop={async (accepted: File[]) => {
          const dataURLs = await Promise.all(
            accepted.map((file) => URL.createObjectURL(file))
          )
          console.log(dataURLs)
          props.onFilesEntry(dataURLs)
        }}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <section>
            <div
              {...getRootProps()}
              className={`
              ${isDragActive ? 'border-2' : 'border border-dotted'}
              border-indigo-600 rounded-md w-128 h-32 p-8 grid place-content-center
            `}
            >
              <input {...getInputProps()} />
              <p>ビデオファイルをドラッグアンドドロップ</p>
            </div>
          </section>
        )}
      </DropZone>

      <div className="flex-1"></div>
    </div>
  )
}
