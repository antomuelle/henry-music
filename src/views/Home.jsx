import { useDispatch, useSelector } from "react-redux"
import { Circle, Card } from "../components/Cards"
import { useOnMounted } from "../lib/utils"
import { fetchFrontPage } from "../slice"

export default function Home() {
  const dispatch = useDispatch()
  const frontPage = useSelector((state)=> state.frontPage)

  useOnMounted(()=> {
    !frontPage && dispatch(fetchFrontPage())
  })

  return (
  <div className='_text-left _p-1 home'>
    <h3 className="_pb-1">Top Artist</h3>
    <div className="_columns _have-2-onmobile flow">
      {frontPage && frontPage.artists.map((artist)=> <Circle key={artist.id} artist={artist} />)}
    </div>

    <h3 className="_py-1.5">Top Tracks</h3>
    <div className="_columns _have-2-onmobile flow">
      {frontPage && frontPage.tracks.map((track)=> <Card key={track.id} track={track} />)}
    </div>
  </div>
  )
}