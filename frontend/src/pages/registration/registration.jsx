import { useState } from "react"
import { RegistrationModal } from "../../components/registrationModal/registrationModal"
import "./registration.css"
export const Registration = () => {
    const [registrationModal,setRegistrationModal]=useState("login")
    return (
        <div className="registration">
            <RegistrationModal registrationModal={registrationModal} setRegistrationModal={setRegistrationModal}/>
        </div>
    )
}