import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { VideoDropArea } from './VideoDropArea'
import { SyncMode } from './SyncMode'

function App() {
  const [urls, setURLs] = useState<string[]>([])

  return (
    <div className="w-screen h-screen p-0 m-0">
      <VideoDropArea
        onFilesEntry={(newUrls) => {
          setURLs([...urls, ...newUrls].slice(-2))
        }}
      />
      <SyncMode videos={urls.slice(0, 2)} />
    </div>
  )
}

export default App
