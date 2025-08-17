import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

type MusicCtx = {
    playing: boolean;
    currentSrc: string | null;
    muted: boolean;
    setTrack: (url: string, autoplay?: boolean) => Promise<void>;
    play: () => Promise<void>;
    pause: () => void;
    toggle: () => Promise<void>;
    setMuted: (v: boolean) => void;
};

const Ctx = createContext<MusicCtx | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [playing, setPlaying] = useState(false);
    const [currentSrc, setCurrentSrc] = useState<string | null>(null);
    const [muted, setMutedState] = useState(false);

    useEffect(() => {
        const a = new Audio();
        a.preload = "metadata";
        a.loop = true;
        a.onplay = () => setPlaying(true);
        a.onpause = () => setPlaying(false);
        audioRef.current = a;
        return () => {
            a.pause();
            a.src = "";
            audioRef.current = null;
        };
    }, []);

    const setMuted = (v: boolean) => {
        if (audioRef.current) audioRef.current.muted = v;
        setMutedState(v);
    };

    const setTrack = async (url: string, autoplay = false) => {
        if (!audioRef.current) return;
        if (currentSrc !== url) {
            audioRef.current.src = url;
            setCurrentSrc(url);
        }
        if (autoplay) {
            try {
                await audioRef.current.play();
            } catch (e) {
                // bloqueado por autoplay -> precisa de gesto
            }
        }
    };

    const play = async () => {
        if (!audioRef.current) return;
        try {
            await audioRef.current.play();
        } catch (e) {
            // precisa de gesto do usuário
            throw e;
        }
    };

    const pause = () => {
        if (audioRef.current) audioRef.current.pause();
    };

    const toggle = async () => {
        if (!audioRef.current) return;
        if (audioRef.current.paused) return play();
        pause();
    };

    const value = useMemo(
        () => ({ playing, currentSrc, muted, setTrack, play, pause, toggle, setMuted }),
        [playing, currentSrc, muted]
    );

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useMusic = () => {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useMusic must be used within <MusicProvider>");
    return ctx;
};
