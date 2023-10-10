import {  Link } from "react-router-dom";

function NavOption(){
    return(
        <div>
            <button><Link to="/Dash">  Dash  </Link></button>
            <button><Link to="/AddTask">  ADDTask  </Link></button>
            {/* <button><Link to="/dash">Dash</Link></button> */}
        </div>
    )
}

export default NavOption;