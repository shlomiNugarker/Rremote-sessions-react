import { useNavigate } from 'react-router-dom'

import loadingGif from '../assets/imgs/loading.gif'
import { authService } from '../services/authService'
import { IUser } from '../interfaces/IUser'

type Props = {
  codeBlocksIds: { _id: string; title: string }[]
  isLoadingCodeBlocks: boolean
  loggedUser: IUser | null
  loadCodeBlocksIds: () => Promise<void>
  setLoggedUser: React.Dispatch<React.SetStateAction<IUser | null>>
  connectedSockets: string[]
}

export default function Home({
  codeBlocksIds,
  loggedUser,
  loadCodeBlocksIds,
  setLoggedUser,
  connectedSockets,
  isLoadingCodeBlocks,
}: Props) {
  const navigate = useNavigate()

  const logout = async () => {
    try {
      await authService.logout()
      setLoggedUser(null)
      navigate('/sign-in')
    } catch (err) {
      alert("couldn't logout...")
    }
  }

  // Loading:
  if (isLoadingCodeBlocks)
    return (
      <div className="home-page">
        <img className="loading-gif" src={loadingGif} alt="" />
      </div>
    )

  return (
    <section className="home-page">
      <div className="logout-btn">
        <p>Hello, {loggedUser?.fullName}</p>
        <button onClick={logout}>Logout</button>
      </div>

      {/* if mentor, show "add-code" btn: */}
      {loggedUser?.isMentor && (
        <>
          <button
            className="add-btn"
            onClick={() => navigate('/add-code-block')}
          >
            +Add Code block
          </button>
          <p>or</p>
        </>
      )}

      <h1>Choose code block:</h1>

      {/* codeBlocks list */}
      <div className="code-blocks">
        {(codeBlocksIds.length &&
          codeBlocksIds.map((codeBlock) => (
            <button
              className="code-block-btn"
              key={codeBlock._id}
              onClick={() => navigate(`/${codeBlock._id}`)}
            >
              {codeBlock.title}
            </button>
          ))) || <span>No block codes yet... 🙂</span>}
      </div>

      <br />

      {connectedSockets?.length && (
        <p>{connectedSockets.length} people are visiting this page now.</p>
      )}

      <button className="refresh-btn" onClick={loadCodeBlocksIds}>
        Refresh list
      </button>
    </section>
  )
}
