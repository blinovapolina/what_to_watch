import { useState } from "react"
import { RegistrationModal } from "../../components/registartionModal/registrationModal"
import "./registration.css"
export const Registration = () => {
    const [registartionModal,setRegistrationModal]=useState("login")
    return (
        <div className="regidtartion">
            <RegistrationModal registartionModal={registartionModal} setRegistrationModal={setRegistrationModal}/>
        </div>
    )
}