import Blaze from '../Effects/Blaze';
import './background.scss';

const Background = () => {
    return (
        <Blaze className='background' layers={2} sparkSize={2.5} height={2} speed={1.5} smoke={5} style={{width: '100vw', height: '100vh'}}> </Blaze>
    )
}
export default Background;
