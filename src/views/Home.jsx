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

export default function Home() {
  const dispatch = useDispatch()
  const frontPage = useSelector((state)=> state.frontPage)

  useOnMounted(()=> {
    !frontPage && dispatch(fetchFrontPage())
  })

  if (!frontPage) return <Loading show={true} />
  return (
  <div className='_text-left _p-1 home'>
    <h5 className="_pb-1">Random Artist</h5>
    <Swiper {...swiperOpts} >
      {frontPage.artists.map(artist=> <SwiperSlide key={artist.id}><Artist artist={artist} /></SwiperSlide>)}
    </Swiper>

    <h5 className="_py-1.5">Random Tracks</h5>
    <div className="_columns _have-2-onmobile flow">
      {frontPage && frontPage.tracks.map((track)=> <Card key={track.id} track={track} source='frontPage.tracks' />)}
    </div>
  </div>
  )
}