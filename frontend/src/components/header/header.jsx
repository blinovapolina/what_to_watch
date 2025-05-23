import icon from "../../assets/img/icon.png"
 import "./header.css"
export const Header = ({setOpenProfileModal}) => {
    const handleProfileModal=()=>{
        setOpenProfileModal(pr=>!pr)
    }
    return (
        <div className="header">
           <div className="iconContHeader"> 
            <img src={icon} className="iconHeader"/></div>
            <div className="profileIcon" style={{cursor:'pointer'}} onClick={handleProfileModal}>
            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M22.9993 43.8337C28.416 43.8337 33.3327 41.7712 37.041 38.3753C36.8327 36.417 35.5827 34.5003 33.3535 33.0003C27.6868 29.2087 18.3535 29.2087 12.6452 33.0003C10.416 34.5003 9.16602 36.417 8.95768 38.3753C12.666 41.7712 17.5827 43.8337 22.9993 43.8337ZM22.9993 43.8337C34.5053 43.8337 43.8327 34.5063 43.8327 23.0003C43.8327 11.4944 34.5053 2.16699 22.9993 2.16699C11.4934 2.16699 2.16602 11.4944 2.16602 23.0003C2.16602 34.5063 11.4934 43.8337 22.9993 43.8337ZM23.2493 24.6253C23.1035 24.6045 22.916 24.6045 22.7493 24.6253C19.0827 24.5003 16.166 21.5003 16.166 17.8128C16.166 14.042 19.2077 10.9795 22.9993 10.9795C26.7702 10.9795 29.8327 14.042 29.8327 17.8128C29.8118 21.5003 26.916 24.5003 23.2493 24.6253Z" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
</svg></div>
        </div>
    )
}