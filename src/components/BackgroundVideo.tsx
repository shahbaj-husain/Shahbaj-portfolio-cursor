import { useCallback, useEffect, useRef, useState } from 'react';
import {
  clampScrubTime,
  computeCoverDrawRect,
  timeToFrameIndex,
} from '../utils/portfolio';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4';


export function BackgroundVideo() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const displayTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);

  const framesRef = useRef<ImageBitmap[]>([]);
  const framesReadyRef = useRef<boolean>(false);
  const extractionStartedRef = useRef<boolean>(false);
  const lastDrawnFrameRef = useRef<number>(-1);
  const [framesReady, setFramesReady] = useState(false);

  const drawFrameAtTime = useCallback((time: number, forceRedraw = false) => {
    const canvas = canvasRef.current;
    const frames = framesRef.current;
    const video = videoRef.current;
    const duration = durationRef.current || (video ? video.duration : 0);
    if (!canvas || frames.length === 0 || !Number.isFinite(duration) || duration <= 0) {
      return;
    }

    const frameIdx = timeToFrameIndex(time, duration, frames.length);
    if (!forceRedraw && frameIdx === lastDrawnFrameRef.current) return;

    const bitmap = frames[frameIdx];
    const ctx = canvas.getContext('2d');
    if (!bitmap || !ctx) return;

    const isDesktopLg = window.innerWidth >= 1024;
    const rect = computeCoverDrawRect(
      bitmap.width,
      bitmap.height,
      canvas.width,
      canvas.height,
      1,
      isDesktopLg ? 1 : 0.5
    );

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, rect.x, rect.y, rect.width, rect.height);
    lastDrawnFrameRef.current = frameIdx;
  }, []);

  // Sync canvas bitmap dimensions to container with DPR awareness and immediate redraw
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nextW = Math.max(1, Math.round(rect.width * dpr));
      const nextH = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== nextW || canvas.height !== nextH) {
        canvas.width = nextW;
        canvas.height = nextH;
        lastDrawnFrameRef.current = -1;
        if (framesReadyRef.current) {
          drawFrameAtTime(displayTimeRef.current, true);
        }
      }
    };

    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(container);
    window.addEventListener('resize', resizeCanvas);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [drawFrameAtTime]);

  // Preload MP4 into RAM Blob & extract ImageBitmap frames for zero-lag desktop scrubbing
  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;
    let offscreenVideo: HTMLVideoElement | null = null;

    const preloadAndExtractFrames = async () => {
      if (
        extractionStartedRef.current ||
        window.innerWidth < 1024 ||
        typeof createImageBitmap !== 'function'
      ) {
        return;
      }
      extractionStartedRef.current = true;

      try {
        const response = await fetch(VIDEO_URL, { mode: 'cors' });
        if (!response.ok || cancelled) {
          extractionStartedRef.current = false;
          return;
        }
        const blob = await response.blob();
        if (cancelled) return;

        objectUrl = URL.createObjectURL(blob);

        offscreenVideo = document.createElement('video');
        offscreenVideo.muted = true;
        offscreenVideo.playsInline = true;
        offscreenVideo.preload = 'auto';
        offscreenVideo.crossOrigin = 'anonymous';

        await new Promise<void>((resolve, reject) => {
          if (!offscreenVideo || !objectUrl) return reject(new Error('No video'));
          const videoEl = offscreenVideo;
          const timer = window.setTimeout(() => reject(new Error('Video load timeout')), 12000);
          const cleanup = () => {
            window.clearTimeout(timer);
            videoEl.removeEventListener('loadeddata', onLoaded);
            videoEl.removeEventListener('error', onError);
          };
          const onLoaded = () => {
            cleanup();
            resolve();
          };
          const onError = () => {
            cleanup();
            reject(new Error('Video load error'));
          };
          videoEl.addEventListener('loadeddata', onLoaded, { once: true });
          videoEl.addEventListener('error', onError, { once: true });
          videoEl.src = objectUrl;
          videoEl.load();
          if (videoEl.readyState >= 2) {
            onLoaded();
          }
        });

        if (cancelled || !offscreenVideo) return;
        const duration = offscreenVideo.duration;
        if (!Number.isFinite(duration) || duration <= 0) return;
        durationRef.current = duration;

        const maxDim = 1280;
        const srcW = offscreenVideo.videoWidth || 1280;
        const srcH = offscreenVideo.videoHeight || 720;
        const scale = Math.min(1, maxDim / Math.max(srcW, srcH));
        const capW = Math.max(1, Math.round(srcW * scale));
        const capH = Math.max(1, Math.round(srcH * scale));

        const capturedEntries: Promise<{ t: number; bitmap: ImageBitmap } | null>[] = [];
        const captureFrame = (timestamp: number) => {
          if (cancelled || !offscreenVideo) return;
          capturedEntries.push(
            createImageBitmap(offscreenVideo, {
              resizeWidth: capW,
              resizeHeight: capH,
              resizeQuality: 'medium',
            })
              .then((bitmap) => ({ t: timestamp, bitmap }))
              .catch(() => null)
          );
        };

        // Capture frame 0 immediately at loadeddata
        captureFrame(0);

        const videoEl = offscreenVideo;
        videoEl.playbackRate = 2.5;

        await new Promise<void>((resolve) => {
          let settled = false;
          const finish = () => {
            if (settled) return;
            settled = true;
            window.clearTimeout(safetyTimer);
            videoEl.removeEventListener('ended', onEnded);
            videoEl.pause();
            resolve();
          };
          const safetyTimer = window.setTimeout(finish, 9000);
          const onEnded = () => {
            captureFrame(duration);
            finish();
          };
          videoEl.addEventListener('ended', onEnded, { once: true });

          const useRVFC =
            typeof (
              videoEl as HTMLVideoElement & {
                requestVideoFrameCallback?: (
                  cb: (now: number, meta: { mediaTime: number }) => void
                ) => number;
              }
            ).requestVideoFrameCallback === 'function';

          if (useRVFC) {
            const rvfcVideo = videoEl as HTMLVideoElement & {
              requestVideoFrameCallback: (
                cb: (now: number, meta: { mediaTime: number }) => void
              ) => number;
            };
            const step = (_now: number, meta: { mediaTime: number }) => {
              if (cancelled || settled) return;
              captureFrame(meta?.mediaTime ?? videoEl.currentTime);
              if (!videoEl.ended && videoEl.currentTime < duration - 0.03) {
                rvfcVideo.requestVideoFrameCallback(step);
              } else {
                finish();
              }
            };
            rvfcVideo.requestVideoFrameCallback(step);
          } else {
            let lastCapturedTime = 0;
            const stepRaf = () => {
              if (cancelled || settled) return;
              if (videoEl.currentTime - lastCapturedTime >= 0.04) {
                lastCapturedTime = videoEl.currentTime;
                captureFrame(videoEl.currentTime);
              }
              if (!videoEl.ended && videoEl.currentTime < duration - 0.03) {
                window.requestAnimationFrame(stepRaf);
              } else {
                finish();
              }
            };
            window.requestAnimationFrame(stepRaf);
          }

          videoEl.play().catch(finish);
        });

        const resolved = await Promise.all(capturedEntries);
        const valid = resolved
          .filter((entry): entry is { t: number; bitmap: ImageBitmap } => entry !== null)
          .sort((a, b) => a.t - b.t);
        const extracted = valid.map((entry) => entry.bitmap);

        if (!cancelled && extracted.length >= 16) {
          framesRef.current = extracted;
          framesReadyRef.current = true;
          lastDrawnFrameRef.current = -1;
          drawFrameAtTime(displayTimeRef.current, true);
          setFramesReady(true);
        } else {
          extracted.forEach((bmp) => bmp.close());
          extractionStartedRef.current = false;
        }
      } catch {
        extractionStartedRef.current = false;
      }
    };

    preloadAndExtractFrames();

    const onResize = () => {
      if (!extractionStartedRef.current && window.innerWidth >= 1024) {
        preloadAndExtractFrames();
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
      framesReadyRef.current = false;
      extractionStartedRef.current = false;
      framesRef.current.forEach((bmp) => bmp.close());
      framesRef.current = [];
      if (offscreenVideo) {
        offscreenVideo.removeAttribute('src');
        offscreenVideo.load();
      }
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [drawFrameAtTime]);

  // Desktop Mouse Scrubbing Hook (60/120fps rAF interpolation + seeked fallback)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId = 0;

    const handleLoadedMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
      }
    };

    const applyVideoSeek = (time: number) => {
      const duration = durationRef.current || video.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;
      isSeekingRef.current = true;
      video.currentTime = Math.max(0, Math.min(duration, time));
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
    };

    const renderLoop = () => {
      if (window.innerWidth >= 1024) {
        const duration = durationRef.current || video.duration;
        if (Number.isFinite(duration) && duration > 0) {
          const diff = targetTimeRef.current - displayTimeRef.current;
          if (Math.abs(diff) > 0.001) {
            // Responsive damping for smooth, zero-lag cursor tracking
            displayTimeRef.current += diff * 0.38;
          } else {
            displayTimeRef.current = targetTimeRef.current;
          }

          if (framesReadyRef.current) {
            drawFrameAtTime(displayTimeRef.current);
          } else if (
            !isSeekingRef.current &&
            Math.abs(video.currentTime - displayTimeRef.current) > 0.025
          ) {
            applyVideoSeek(displayTimeRef.current);
          }
        }
      }
      rafId = window.requestAnimationFrame(renderLoop);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (window.innerWidth < 1024) {
        return;
      }
      const currentX = event.clientX;
      if (prevXRef.current === null) {
        prevXRef.current = currentX;
        return;
      }

      const delta = currentX - prevXRef.current;
      prevXRef.current = currentX;

      const duration = durationRef.current || video.duration;
      if (!Number.isFinite(duration) || duration <= 0) {
        return;
      }

      if (!video.paused) {
        video.pause();
      }

      targetTimeRef.current = clampScrubTime(
        targetTimeRef.current,
        delta,
        window.innerWidth,
        duration
      );

      if (containerRef.current) {
        containerRef.current.dataset.scrubTime = targetTimeRef.current.toFixed(3);
      }
    };

    const handleMouseLeave = () => {
      prevXRef.current = null;
    };

    if (Number.isFinite(video.duration) && video.duration > 0) {
      durationRef.current = video.duration;
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('seeked', handleSeeked);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    rafId = window.requestAnimationFrame(renderLoop);

    return () => {
      window.cancelAnimationFrame(rafId);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('seeked', handleSeeked);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [drawFrameAtTime]);

  // Mobile Autoplay Hook
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncPlaybackMode = () => {
      if (window.innerWidth < 1024) {
        video.autoplay = true;
        video.loop = true;
        video.play().catch(() => {
          // Ignore autoplay restrictions in headless or restricted contexts
        });
      } else {
        video.autoplay = false;
        video.pause();
      }
    };

    syncPlaybackMode();
    window.addEventListener('resize', syncPlaybackMode);
    return () => {
      window.removeEventListener('resize', syncPlaybackMode);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-frames-ready={framesReady ? 'true' : 'false'}
      className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none select-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-neutral-50 lg:bg-transparent"
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        src={VIDEO_URL}
        crossOrigin="anonymous"
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover object-right lg:object-right-bottom"
      />
      <canvas
        ref={canvasRef}
        className={`hidden lg:block absolute inset-0 w-full h-full pointer-events-none ${
          framesReady ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
