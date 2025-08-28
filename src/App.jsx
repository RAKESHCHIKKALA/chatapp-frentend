import Routecomp from "./config/Route";
import {Toaster} from "react-hot-toast";
function App(){
  return(
  <div>
    <Toaster 
    position="top-center" 
    reverseOrder={false}
    toastOptions={{
      duration:2000,
    }}
    
    
    
    />
    <Routecomp />
    
  </div>
  )
}
export default App;