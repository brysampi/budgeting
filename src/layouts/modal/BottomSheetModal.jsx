import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { LuX } from "react-icons/lu";

const BottomSheet = ({
    isVisible,
    onClose,
    title,
    children,
    isDraggable = true,
    showCloseButton = true,
    closeOnOverlay = true
}) => {
    const [dragY, setDragY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [shouldRender, setShouldRender] = useState(isVisible);
    const [animateIn, setAnimateIn] = useState(false);
    const sheetRef = useRef(null);
    const startY = useRef(0);

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
            setDragY(0);
            document.body.style.overflow = 'hidden';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setAnimateIn(true);
                });
            });
        } else {
            setAnimateIn(false);
            document.body.style.overflow = '';
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    useEffect(() => {
        if (!isDraggable) return;

        const handleMove = (e) => {
            if (!isDragging) return;
            const deltaY = e.clientY - startY.current;
            if (deltaY >= 0) {
                setDragY(deltaY);
            }
        };

        const handleUp = () => {
            if (!isDragging) return;
            setIsDragging(false);
            if (dragY > 150) {
                onClose();
            } else {
                setDragY(0);
            }
        };

        if (isDragging) {
            window.addEventListener('pointermove', handleMove);
            window.addEventListener('pointerup', handleUp);
        }

        return () => {
            window.removeEventListener('pointermove', handleMove);
            window.removeEventListener('pointerup', handleUp);
        };
    }, [isDragging, dragY, onClose, isDraggable]);

    const handlePointerDown = (e) => {
        if (!isDraggable) return;
        if (e.target.closest('.drag-handle')) {
            setIsDragging(true);
            startY.current = e.clientY - dragY;
        }
    };

    if (!shouldRender) return null;

    const overlayContent = (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col justify-end transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            onClick={() => closeOnOverlay && onClose()}
        >
            <div
                ref={sheetRef}
                className={`bg-[var(--color-theme-secondary)] w-full rounded-t-[32px] shadow-2xl overflow-hidden relative ${isDraggable ? 'touch-none' : ''}`}
                style={{
                    maxHeight: '90vh',
                    transform: `translateY(${!animateIn ? '100%' : dragY + 'px'})`,
                    transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={handlePointerDown}
            >
                {/* Drag Handle Container */}
                {isDraggable && (
                    <div className="w-full flex justify-center p-4 cursor-grab active:cursor-grabbing drag-handle touch-none">
                        <div className={`w-12 h-1.5 rounded-full transition-colors duration-200 ${isDragging ? 'bg-[var(--color-theme-important)]' : 'bg-white/10'}`} />
                    </div>
                )}

                {/* Close Button - Absolute if no title or if dragging is disabled */}
                {showCloseButton && !title && (
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[var(--color-theme-secondary-text)] hover:text-[var(--color-light)] transition-colors z-10"
                    >
                        <LuX size={20} />
                    </button>
                )}

                {/* Header Container */}
                {title && (
                    <div className={`px-6 pb-4 flex justify-between items-center border-b border-white/5 ${isDraggable ? 'drag-handle touch-none' : ''} ${!isDraggable ? 'pt-6' : ''}`}>
                        <h2 className="text-xl font-extrabold text-[var(--color-light)] tracking-tight">{title}</h2>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[var(--color-theme-secondary-text)] hover:text-[var(--color-light)] transition-colors"
                            >
                                <LuX size={20} />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-6 overflow-y-auto pointer-events-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(overlayContent, document.body);
};

export default BottomSheet;
