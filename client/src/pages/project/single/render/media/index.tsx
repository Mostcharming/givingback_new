import { Play, Trash2, Video } from "lucide-react";

export default function MediaGallery({ project }) {
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

  const handlePlayVideo = (videoSrc) => {
    console.log(`Play video: ${videoSrc}`);
  };

  const handleUploadMedia = () => {
    console.log("Upload new media");
  };

  return (
    <>
      <style>{`
        .media-item {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          aspect-ratio: 3/2;
          background-color: #e9ecef;
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
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }
        .delete-btn:hover {
          background: rgba(0, 0, 0, 0.8);
        }
        .play-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.6);
          border: none;
          border-radius: 50%;
          padding: 12px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }
        .play-overlay:hover {
          background: rgba(0, 0, 0, 0.8);
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
          transition: background-color 0.2s;
        }
        .upload-btn:hover {
          background-color: #218838;
        }
        .no-media {
          text-align: center;
          color: #6c757d;
          padding: 40px;
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 2px dashed #dee2e6;
        }
        .media-error {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8d7da;
          color: #721c24;
          font-size: 14px;
          padding: 10px;
        }
      `}</style>

      <div style={{ width: "80vw" }}>
        {/* Date Header */}
        <div className="row mb-4">
          <div className="col">
            <h5 className="mb-0 text-dark fw-normal">
              {project?.startDate
                ? new Date(project.startDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })
                : "Project Media"}
            </h5>
          </div>
        </div>

        {/* Media Grid or No Media Message */}
        {mediaItems.length > 0 ? (
          <div className="row g-3 mb-4">
            {mediaItems.map((item) => (
              <div key={item.id} className="col-12 col-md-6 col-lg-4 p-2">
                <div className="media-item">
                  {item.type === "video" ? (
                    <video
                      src={item.src}
                      preload="metadata"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        if ((e.target as HTMLImageElement).nextSibling) {
                          (
                            (e.target as HTMLImageElement)
                              .nextSibling as HTMLElement
                          ).style.display = "flex";
                        }
                      }}
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt={item.alt}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        if ((e.target as HTMLImageElement).nextSibling) {
                          (
                            (e.target as HTMLImageElement)
                              .nextSibling as HTMLElement
                          ).style.display = "flex";
                        }
                      }}
                    />
                  )}

                  {/* Error fallback */}
                  <div className="media-error" style={{ display: "none" }}>
                    Failed to load media
                  </div>

                  {/* Delete Button */}
                  <button
                    className="delete-btn"
                    aria-label="Delete media"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* Video Indicators */}
                  {item.type === "video" && (
                    <>
                      <button
                        className="play-overlay"
                        aria-label="Play video"
                        onClick={() => handlePlayVideo(item.src)}
                      >
                        <Play size={20} fill="white" />
                      </button>
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
    </>
  );
}
