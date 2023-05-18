import { useSelector } from 'react-redux'
import '../styles/player-queue.css'
import { Track } from './Cards'

export function PlayQueue() {
  const queue = useSelector(state=> ({list: state.queue, played: state.playedQueue, current: state.currentTrack}))

  return (
  <div className="play-queue">
    <h6 className='_text-center'>Play Queue</h6>
    {queue.current && <>
      <p className='section'>You are listening:</p>
      <Track track={queue.current} minimal={true} className='playing' />
    </>}
    {!!queue.list.length && <>
      <p className='section'>Next to play:</p>
      <div className="vlist">
        {queue.list.map(track=> <Track track={track} minimal={true} key={track.id} /> )}
      </div>
    </>}
    {!!queue.played.length && <>
      <p className='section'>Played previously:</p>
      <div className="vlist">
        {queue.played.toReversed().map(track=> <Track track={track} minimal={true} key={track.id} /> )}
      </div>
    </>}
  </div>
  )
}