import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./index.css"

// Vite injects BASE_URL based on your Vite `base` (or --base)
const baseUrl = import.meta.env.BASE_URL // "/" locally, "/Portfolio/" on GH Pages
const basename = baseUrl === "/" ? "/" : baseUrl.replace(/\/$/, "") // "/Portfolio"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
