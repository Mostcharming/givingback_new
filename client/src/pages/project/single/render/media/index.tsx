import { ArrowLeft, ArrowRight, Play, Trash2, Video, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function MediaGallery({ project }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const isVideoFile = (url) => {
    if (!url) return false;
    const videoExtensions = [
      ".mp4",
      ".avi",
      ".mov",
      ".wmv",
      ".flv",
      ".webm",
      ".mkv",
      ".m4v",
    ];
    const lowerUrl = url.toLowerCase();
    return videoExtensions.some((ext) => lowerUrl.includes(ext));
  };

  const mediaItems =
    project?.projectImages?.map((item, index) => ({
      id: index + 1,
      type: isVideoFile(item.image) ? "video" : "image",
      src: item.image,
      alt: `Project media ${index + 1}`,
    })) || [];

  const handleDelete = (itemId) => {
    console.log(`Delete item with id: ${itemId}`);
  };

  const handleUploadMedia = () => {
    console.log("Upload new media");
  };

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevItem = () =>
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : mediaItems.length - 1));
  const nextItem = () =>
    setLightboxIndex((prev) => (prev + 1) % mediaItems.length);

  // Prevent scroll on modal open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [lightboxIndex]);

  return (
    <>
      <style>{`
        body.modal-open {
          overflow: hidden;
        }
        .media-item {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          aspect-ratio: 3/2;
          background-color: #e9ecef;
          cursor: pointer;
        }
        .media-item img,
        .media-item video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .delete-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.6);
          border: none;
          border-radius: 6px;
          padding: 6px;
          color: white;
          cursor: pointer;
        }
        .play-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          padding: 12px;
          color: white;
        }
        .video-indicator {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 4px;
          padding: 4px;
          color: white;
        }
        .upload-btn {
          background-color: #28a745;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          color: white;
          font-weight: 500;
          font-size: 16px;
          cursor: pointer;
        }
        .no-media {
          text-align: center;
          color: #6c757d;
          padding: 40px;
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 2px dashed #dee2e6;
        }
        .lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: black;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .lightbox-content {
          max-width: 90vw;
          max-height: 80vh;
          position: relative;
        }
        .lightbox-content img,
        .lightbox-content video {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          color: white;
          background: rgba(0, 0, 0, 0.5);
          border: none;
          padding: 10px;
          cursor: pointer;
        }
        .lightbox-close {
          position: absolute;
          top: 20px;
          right: 20px;
          color: white;
          background: rgba(0, 0, 0, 0.5);
          border: none;
          border-radius: 50%;
          padding: 8px;
          cursor: pointer;
        }
        .thumbnail-strip {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 1rem;
          max-width: 90vw;
        }
        .thumbnail-strip img,
        .thumbnail-strip video {
          height: 80px;
          cursor: pointer;
          border: 2px solid transparent;
          border-radius: 8px;
        }
        .thumbnail-strip .active {
          border-color: white;
        }
      `}</style>

      <div style={{ width: "80vw" }}>
        {/* Date Header */}
        <div className="row mb-4">
          <div className="col">
            <h5 className="mb-0 text-black fw-normal">
              {project?.startDate
                ? new Date(project.startDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })
                : "Project Media"}
            </h5>
          </div>
        </div>

        {/* Media Grid */}
        {mediaItems.length > 0 ? (
          <div className="row g-3 mb-4">
            {mediaItems.map((item, index) => (
              <div key={item.id} className="col-12 col-md-6 col-lg-4 p-2">
                <div className="media-item" onClick={() => openLightbox(index)}>
                  {item.type === "video" ? (
                    <video src={item.src} preload="metadata" />
                  ) : (
                    <img src={item.src} alt={item.alt} />
                  )}
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                  {item.type === "video" && (
                    <>
                      <div className="play-overlay">
                        <Play size={20} fill="white" />
                      </div>
                      <div className="video-indicator">
                        <Video size={14} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-media mb-4">
            <p className="mb-0">No media files available for this project.</p>
            <small>Upload images or videos to get started.</small>
          </div>
        )}

        {/* Upload Button */}
        <div className="row">
          <div className="col">
            <button className="upload-btn w-50" onClick={handleUploadMedia}>
              Upload New Media
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="lightbox-overlay">
          <button className="lightbox-close" onClick={closeLightbox}>
            <X />
          </button>
          <button
            className="lightbox-nav"
            style={{ left: 20 }}
            onClick={prevItem}
          >
            <ArrowLeft />
          </button>
          <div className="lightbox-content">
            {mediaItems[lightboxIndex].type === "video" ? (
              <video src={mediaItems[lightboxIndex].src} controls autoPlay />
            ) : (
              <img
                src={mediaItems[lightboxIndex].src}
                alt={mediaItems[lightboxIndex].alt}
              />
            )}
          </div>
          <button
            className="lightbox-nav"
            style={{ right: 20 }}
            onClick={nextItem}
          >
            <ArrowRight />
          </button>

          {/* Thumbnail Strip */}
          <div className="thumbnail-strip">
            {mediaItems.map((item, idx) => (
              <div key={item.id}>
                {item.type === "video" ? (
                  <video
                    className={idx === lightboxIndex ? "active" : ""}
                    src={item.src}
                    onClick={() => setLightboxIndex(idx)}
                  />
                ) : (
                  <img
                    className={idx === lightboxIndex ? "active" : ""}
                    src={item.src}
                    alt={item.alt}
                    onClick={() => setLightboxIndex(idx)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
