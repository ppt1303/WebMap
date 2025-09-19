import React from "react";
import { useDispatch } from "react-redux";
import { markerTamThoi } from "../store/markerslice";
import "./Sidebar.css";


export default function Sidebar() {
    const dispatch = useDispatch();

    const icons = [
        {
        src: "/img/nhà.jpg",
        alt: "nhà",
        popup: "Nhà ở Hà Nội",
    },
    {
        src: "/img/cờ.png",
        alt: "cờ",
        popup: "Cờ ở Hà Nội"
    }
    ];
        const Keotha = (a, icon) => {
            a.dataTransfer.setData("icon",JSON.stringify(icon))
    };
    return (
        <div className="sidebar">
            <h4>Icon</h4>
            {icons.map((icon,i) => (
                <div 
                key={i}
                draggable
                onDragStart= {(a) => Keotha(a, icon)}
                className="icon-item"
                style={{
                    margin: "8px 0",
                    fontSize: "24px",
                    padding: "8px",
                    background: "white",
                    borderRadius: "6px",
                    cursor: "grab",
                }}
                >
                     <img src={icon.src} alt={icon.alt} width={30}/>
                </div>
            ))}
        </div>

    );
}