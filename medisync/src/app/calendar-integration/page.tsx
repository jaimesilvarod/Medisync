'use client';
import { useRef, useState, useEffect } from 'react';

export default function GoogleCalendar() {
    const [showModal, setShowModal] = useState(false);
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        if (showModal) {
            ref.current.showModal();
        } else {
            ref.current.close();
        }
    }, [showModal]);

    return (
        <div>
            <button onClick={() => setShowModal(true)}>Ver Calendario</button>
            <dialog
                ref={ref}
                onClick={(e) => {
                    if (!ref.current) return;
                    const dims = ref.current.getBoundingClientRect();
                    if (
                        e.clientX < dims.left ||
                        e.clientX > dims.right ||
                        e.clientY < dims.top ||
                        e.clientY > dims.bottom
                    ) {
                        ref.current.close();
                        setShowModal(false);
                    }
                }}
            >
                <iframe src="YOUR_GOOGLE_CALENDAR_IFRAME_URL" width="100%" height="100%"></iframe>
            </dialog>
        </div>
    );
}