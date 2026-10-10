import { useNavigate, useLocation } from 'react-router-dom'
import Button from '../Button/Button'
import './bottom-bar.scss'
import type { ReactNode } from 'react'
import { User, ListBulleted, UsersGroup } from 'griddy-icons'

const bottomBarButtons:{icon: ReactNode, label: string, to: string}[] = [
    {
        icon: <ListBulleted/>,
        label: 'Feed',
        to:  'feed',
    },
    {
        icon: <UsersGroup/>,
        label: 'Map',
        to:  'map',
    },
    {
        icon: <User/>,
        label: 'Profile',
        to:  'profile',
    }
]

const BottomBar = () => {
    const navigate = useNavigate();
    const location = useLocation().pathname;

    const navigateTo = (to: string) => {
        if(!location.includes(to)){
            navigate(to);
        }
    }

    return (
        <div className="bottom-bar">
            {bottomBarButtons.map(btn => (
                <Button className={`button-none white-ripple ${location.includes(btn.to) && 'active'}`} onClick={() => {navigateTo(btn.to)}}>{btn.icon}{btn.label}</Button>
            ))}
        </div>
    )
}
export default BottomBar