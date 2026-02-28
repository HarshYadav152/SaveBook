import React from 'react'

export default function NoteTag(props) {
    return (
        <div>
            <div>
                <span 
                    className="position-absolute translate-middle badge rounded-pill bg-success"
                    aria-label={`Tag: ${props.tag}`}
                >
                    {props.tag}
                </span>
            </div>
        </div>
    )
}