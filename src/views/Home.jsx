import { useDispatch, useSelector } from "react-redux"
import { Artist, Card } from "../components/Cards"
import { useOnMounted } from "../lib/utils"
import { fetchFrontPage } from "../slice"
import { swiperOpts } from "../lib/constants"
import { Loading } from "../components/Shorts"
import { Swiper, SwiperSlide } from "swiper/react"
import 'swiper/css'
import "swiper/css/pagination"
import "swiper/css/navigation"
import { useState } from "react"

export default function Home() {
  const dispatch = useDispatch()
  const frontPage = useSelector((state)=> state.frontPage)
  const [width, setWidth] = useState(50)

  useOnMounted(()=> {
    !frontPage && dispatch(fetchFrontPage())
    const obs = new ResizeObserver(entries=> {
      if (!entries.length) return
      const width = entries[0].contentRect.width
      if (width < 420) { setWidth(50) }
      else if (width > 420 && width < 640) { setWidth(33.33) }
      else if (width > 640 && width < 1024) { setWidth(25) }
      else if (width > 1024 && width < 1400) { setWidth(20) }
      else if (width > 1400) { setWidth(10) }
    })
    obs.observe(document.querySelector('.floor'))

    return ()=> { obs.disconnect() }
  })

  if (!frontPage) return <Loading show={true} className='home' />
  return (
  <div className='_text-left _p-1 home'>
    <h5 className="_pb-1">Random Artist</h5>
    <Swiper {...swiperOpts} >
      {frontPage.artists.map(artist=> <SwiperSlide key={artist.id}><Artist artist={artist} /></SwiperSlide>)}
    </Swiper>

    <h5 className="_py-1.5">Random Tracks</h5>
    <div className="_columns _have-2-onmobile flow">
      {frontPage && frontPage.tracks.map((track)=> <Card width={`calc(${width}% - ${1 - (width/100)}rem)`} track={track} source='frontPage.tracks' key={track.id} />)}
    </div>
  </div>
  )
}