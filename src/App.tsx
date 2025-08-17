// src/App.tsx
import Header from './components/Header';
import OpeningMessage from './components/OpeningMessage';
import CeremonyInfo from './components/CeremonyInfo';
import ReceptionInfo from './components/ReceptionInfo';
import Gallery from './components/Gallery';
import Playlist from './components/Playlist';
import RSVP from './components/RSVP';
import GiftList from './components/GiftList';
import Messages from './components/Messages';
import Footer from './components/Footer';
import DressCode from './components/DressCode';

// ⬇️ importe o provider
import { MusicProvider } from './hooks/MusicProvider';

function App() {
  return (
    <MusicProvider>
      <div className="min-h-screen bg-gradient-to-b from-white via-[#FDF6EE] to-white">
        <Header />
        <OpeningMessage />
        <CeremonyInfo />
        <ReceptionInfo />
        <DressCode />
        <Gallery />
        <Playlist />
        <RSVP />
        <GiftList />
        <Messages />
        <Footer />
      </div>
    </MusicProvider>
  );
}

export default App;
