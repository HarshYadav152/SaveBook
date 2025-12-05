import React from 'react'

export default function NoteTag(props) {
    // const {tag} = props
    return (
        <div>
            <div>
            <span class="position-absolute translate-middle badge rounded-pill bg-success">
                        {props.tag}
            </span>
            </div>
        </div>
    )
}
