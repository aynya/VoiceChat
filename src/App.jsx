// 
import Right from './components/rightMenu/Right';
import ChannelsPanel from './components/channels/ChannelsPanel'
import { Layout } from 'antd';
import './CSS/main.css'

const App = () => {
  return (
    <div>
      <Layout hasSider style={{ height: '100vh' }}>
        <ChannelsPanel

        ></ChannelsPanel>
        {/* <Right></Right> */}
      </Layout>
    </div>
  )
}
export default App
