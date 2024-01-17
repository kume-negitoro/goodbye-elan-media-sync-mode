import { ChangeEvent, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { useWindowSize } from './hooks/useWindowSize'

export interface SyncModeProps {
  videos: string[]
}

interface SyncModeState {
  video1Playing: boolean
  video2Playing: boolean
  video1Active: boolean
  video2Active: boolean
}

export const SyncMode = (props: SyncModeProps) => {
  const [width] = useWindowSize()
  const [state, setState] = useState<SyncModeState>({
    video1Playing: false,
    video2Playing: false,
    video1Active: true,
    video2Active: true,
  })
  const [video1CurrentTime, setVideo1CurrentTime] = useState(0)
  const [video2CurrentTime, setVideo2CurrentTime] = useState(0)
  const [[video1LastOffset, video2LastOffset], setLastOffset] = useState<
    [number, number]
  >([0, 0])
  const video1Ref = useRef<ReactPlayer>(null)
  const video2Ref = useRef<ReactPlayer>(null)

  const video1 = video1Ref.current
  const video2 = video2Ref.current

  const handleSeekHead = () => {
    if (video1 && video2) {
      if (state.video1Active) {
        video1.seekTo(0, 'seconds')
        setVideo1CurrentTime(0)
      }
      if (state.video2Active) {
        video2.seekTo(0, 'seconds')
        setVideo2CurrentTime(0)
      }
    }
  }

  const handleSeekTail = () => {
    const newVideo1CurrentTime = video1?.getDuration() || Infinity
    const newVideo2CurrentTime = video2?.getDuration() || Infinity
    if (video1 && video2) {
      if (state.video1Active) {
        video1.seekTo(newVideo1CurrentTime, 'seconds')
        setVideo1CurrentTime(newVideo1CurrentTime)
      }
      if (state.video2Active) {
        video2.seekTo(newVideo2CurrentTime, 'seconds')
        setVideo2CurrentTime(newVideo2CurrentTime)
      }
    }
  }

  const handlePlay = () => {
    if (video1 && video2) {
      if (state.video1Playing || state.video2Playing) {
        setState(
          Object.assign({}, state, {
            video1Playing: false,
            video2Playing: false,
          })
        )
      } else {
        setState(
          Object.assign({}, state, {
            video1Playing: state.video1Active,
            video2Playing: state.video2Active,
          })
        )
      }
    }
  }

  const handleSeekForward = (sec = 1) => {
    const newVideo1CurrentTime = video1CurrentTime + sec
    const newVideo2CurrentTime = video2CurrentTime + sec
    if (video1 && video2) {
      setState(
        Object.assign({}, state, {
          video1Playing: false,
          video2Playing: false,
        })
      )
      if (state.video1Active) {
        video1.seekTo(newVideo1CurrentTime, 'seconds')
        setVideo1CurrentTime(newVideo1CurrentTime)
      }
      if (state.video2Active) {
        video2.seekTo(newVideo2CurrentTime, 'seconds')
        setVideo2CurrentTime(newVideo2CurrentTime)
      }
    }
  }

  const handleRadioButtonChange = (event: ChangeEvent<HTMLInputElement>) => {
    switch (event.target.id) {
      case 'active-video-1':
        return setState(
          Object.assign({}, state, {
            video1Active: true,
            video2Active: false,
          })
        )
      case 'active-video-2':
        return setState(
          Object.assign({}, state, {
            video1Active: false,
            video2Active: true,
          })
        )
      case 'active-video-all':
        return setState(
          Object.assign({}, state, {
            video1Active: true,
            video2Active: true,
          })
        )
    }
  }

  const handleSetThisTimeToOffset = () => {
    setLastOffset([video1CurrentTime, video2CurrentTime])
  }

  const handleResetTimeToOffset = () => {
    if (video1 && video2) {
      video1.seekTo(video1LastOffset, 'seconds')
      video2.seekTo(video2LastOffset, 'seconds')
      setVideo1CurrentTime(video1LastOffset)
      setVideo2CurrentTime(video2LastOffset)
    }
  }

  return (
    <div>
      <div className="flex">
        <div id="video1" className="flex-1">
          <ReactPlayer
            progressInterval={1 / 30}
            ref={video1Ref}
            playing={state.video1Playing}
            url={props.videos[0]}
            width={width / 2}
            onProgress={(v) => setVideo1CurrentTime(v.playedSeconds)}
          />
          <div>{video1CurrentTime}</div>
          <div>offset: {video1LastOffset}</div>
        </div>
        <div id="video2" className="flex-1">
          <ReactPlayer
            progressInterval={1 / 30}
            ref={video2Ref}
            playing={state.video2Playing}
            url={props.videos[1]}
            width={width / 2}
            onProgress={(v) => setVideo2CurrentTime(v.playedSeconds)}
          />
          <div>{video2CurrentTime}</div>
          <div>offset: {video2LastOffset}</div>
        </div>
      </div>

      <div>
        <div>
          <div>
            <input
              type="radio"
              id="active-video-1"
              name="active-video"
              onChange={(event) => handleRadioButtonChange(event)}
              checked={state.video1Active && !state.video2Active}
            />
            <label htmlFor="active-video-1">Video1</label>
          </div>
          <div>
            <input
              type="radio"
              id="active-video-all"
              name="active-video"
              onChange={(event) => handleRadioButtonChange(event)}
              checked={state.video1Active && state.video2Active}
            />
            <label htmlFor="active-video-all">All</label>
          </div>
          <div>
            <input
              type="radio"
              id="active-video-2"
              name="active-video"
              onChange={(event) => handleRadioButtonChange(event)}
              checked={!state.video1Active && state.video2Active}
            />
            <label htmlFor="active-video-2">Video2</label>
          </div>
        </div>
        <button onClick={handleResetTimeToOffset}>Reset time to offset</button>
        <div>
          <button onClick={() => handleSeekHead()}>||&lt;&lt;</button>
          <button onClick={() => handleSeekForward(-1)}>&lt;&lt;</button>
          <button onClick={() => handleSeekForward(-1 / 30)}>&lt;</button>
          <button onClick={handlePlay}>
            {state.video1Playing || state.video2Playing ? '||' : '/>'}
          </button>
          <button onClick={() => handleSeekForward(1 / 30)}>&gt;</button>
          <button onClick={() => handleSeekForward(1)}>&gt;&gt;</button>
          <button onClick={() => handleSeekTail()}>&gt;&gt;||</button>
        </div>
        <button onClick={handleSetThisTimeToOffset}>
          Set this time to offset
        </button>
      </div>
    </div>
  )
}
