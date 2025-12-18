// src/pages/Aboutme.jsx
import React from "react"
import AboutConstellation from "@/components/sections/AboutConstellation"
import Certificate from "@/components/sections/Certificate"

export default function Aboutme() {
    return (
        <div className="w-full">
            <div className="h-20" />

            <AboutConstellation />

            {/* ✅ spacing between sections */}
            <div className="h-2" />

            <Certificate />
        </div>
    )
}
