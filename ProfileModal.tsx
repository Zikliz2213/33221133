import { useState, useEffect, useRef } from 'react';

interface CallModalProps {
  chat: any;
  type: 'audio' | 'video';
  onClose: () => void;
}

export function CallModal({ chat, type, onClose }: CallModalProps) {
  const [callStatus, setCallStatus] = useState<'calling' | 'connected' | 'ended'>('calling');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize WebRTC here
    initializeCall();

    return () => {
      endCall();
    };
  }, []);

  useEffect(() => {
    if (callStatus === 'connected') {
      timerRef.current = window.setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callStatus]);

  const initializeCall = async () => {
    try {
      // Get user media
      const constraints = {
        audio: true,
        video: type === 'video',
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Simulate call connection (in real app, use WebRTC with signaling server)
      setTimeout(() => {
        setCallStatus('connected');
      }, 2000);

      // Here you would implement actual WebRTC peer connection
      // const peerConnection = new RTCPeerConnection(configuration);
      // Add tracks from stream to peer connection
      // Handle ICE candidates, offer/answer exchange via WebSocket
    } catch (error) {
      console.error('Failed to get user media:', error);
      alert('Не удалось получить доступ к камере/микрофону');
      onClose();
    }
  };

  const endCall = () => {
    // Stop all media tracks
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }

    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      const stream = remoteVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }

    setCallStatus('ended');
  };

  const toggleMute = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    endCall();
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-tg-dark-bg z-50 flex flex-col">
      {/* Video Container */}
      <div className="flex-1 relative bg-black">
        {type === 'video' ? (
          <>
            {/* Remote Video (Full Screen) */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-40 h-56 bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          </>
        ) : (
          /* Audio Call View */
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-40 h-40 bg-tg-primary rounded-full flex items-center justify-center text-white text-6xl font-semibold mb-8 animate-pulse">
              {chat?.avatar ? (
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                chat?.name?.[0]?.toUpperCase() || 'C'
              )}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{chat?.name}</h2>
            <p className="text-xl text-gray-400">
              {callStatus === 'calling'
                ? 'Звонок...'
                : callStatus === 'connected'
                ? formatDuration(callDuration)
                : 'Завершен'}
            </p>
          </div>
        )}

        {/* Call Info Overlay (for video calls) */}
        {type === 'video' && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded-lg px-4 py-2">
            <h3 className="text-white font-semibold">{chat?.name}</h3>
            <p className="text-gray-300 text-sm">
              {callStatus === 'calling'
                ? 'Звонок...'
                : callStatus === 'connected'
                ? formatDuration(callDuration)
                : 'Завершен'}
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-tg-dark-secondary p-6">
        <div className="flex items-center justify-center space-x-6">
          {type === 'video' && (
            <button
              onClick={toggleVideo}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                isVideoOff
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title={isVideoOff ? 'Включить камеру' : 'Выключить камеру'}
            >
              <i className={`fas fa-video${isVideoOff ? '-slash' : ''} text-white text-xl`}></i>
            </button>
          )}

          <button
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
              isMuted
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isMuted ? 'Включить микрофон' : 'Выключить микрофон'}
          >
            <i className={`fas fa-microphone${isMuted ? '-slash' : ''} text-white text-xl`}></i>
          </button>

          <button
            onClick={handleEndCall}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition transform hover:scale-105"
            title="Завершить звонок"
          >
            <i className="fas fa-phone-slash text-white text-2xl"></i>
          </button>

          <button
            className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition"
            title="Настройки"
          >
            <i className="fas fa-cog text-white text-xl"></i>
          </button>

          <button
            className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition"
            title="Полноэкранный режим"
          >
            <i className="fas fa-expand text-white text-xl"></i>
          </button>
        </div>
      </div>

      {/* Audio Element for remote audio in video calls */}
      <audio ref={remoteVideoRef as any} autoPlay hidden={type === 'video'} />
    </div>
  );
}
