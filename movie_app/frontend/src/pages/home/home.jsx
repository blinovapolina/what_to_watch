import { Header } from "../../components/header/header"
import "./home.css"
import phone from "../../assets/img/phone.png"
import postrer from "../../assets/img/poster.png"
import like from "../../assets/img/like.png"
import dislike from "../../assets/img/dislike.png"
export const Home = () => {
    return (
        <div className="homePage">
            <Header/>
            <div className="titleContainerHomePage">
            <div className="titleHomePage">
            Что посмотреть?
            </div>
            <div className="btnContainerHomePage">
            <div className="buttonLeftHomePage">Комедия <svg width="16" height="19" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.2046 3.76465L3.76465 13.2046" stroke="#69FF76" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M3.76465 3.76465L13.2046 13.2046" stroke="#69FF76" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
</svg></div>
<div className="buttonRightHomePage">Фильтр <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M19.9201 8.9502L13.4001 15.4702C12.6301 16.2402 11.3701 16.2402 10.6001 15.4702L4.08008 8.9502" stroke="#292D32" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
</svg></div></div>
        </div>
       <div className="imgContainerPhoneHomePage"> <img src={phone} className="imgPhoneHomePage" />

       </div>
       <div className="posterContainerPhoneHomePage"><img src={postrer} className="posterPhoneHomePage" /></div>
      <div className="likeBlockHomePage"> <div className="likeContainerHomePage">
       <img src={dislike} className="likePhoneHomePage"/>
       <img src={like} className="likePhoneHomePage"/>
       </div></div>
        </div>
    )
}