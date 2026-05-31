import { Plus, Search, Send } from "lucide-react";
import { useRef, useState } from "react";
import { Image, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import useBackendService from "../../../../../services/backend_service";

interface MileStoneUpdatesProps {
  logo: any;
  project: any;
  role: any;
  activeMilestoneIndex?: number | null;
}

const MileStoneUpdates = ({
  logo,
  project,
  role,
  activeMilestoneIndex = null,
}: MileStoneUpdatesProps) => {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [narration, setNarration] = useState("");
  const [targetAchieved, setTargetAchieved] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: submitUpdate } = useBackendService("/ngo/milestone", "POST", {
    onSuccess: (res: any) => {
      toast.success("Update added successfully!");
      setNarration("");
      setTargetAchieved("");
      setUploadedImage(null);
      setPreviewUrl(null);
      window.location.reload();
    },
    onError: () => {
      toast.error("Failed to add update");
      setIsSubmitting(false);
    },
  });

  const activeMilestone =
    activeMilestoneIndex !== null && project?.milestones
      ? project.milestones[activeMilestoneIndex]
      : null;

  const hasUpdates =
    activeMilestone?.updates && activeMilestone.updates.length > 0;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitUpdate = async () => {
    if (!narration.trim()) {
      toast.error("Please enter a narrative");
      return;
    }

    if (!targetAchieved.trim()) {
      toast.error("Please enter target achieved amount");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("narration", narration);
    formData.append("achievement", targetAchieved);
    formData.append("position", String(activeMilestoneIndex));
    formData.append("milestone_id", activeMilestone.id);
    formData.append("status", "pending");

    if (uploadedImage) {
      formData.append("image", uploadedImage);
    }

    submitUpdate(formData);
  };

  const getStatusBadgeStyle = (status: string) => {
    const statusLower = status?.toLowerCase() || "pending";
    if (statusLower === "approved") {
      return {
        backgroundColor: "#d1e7dd",
        color: "#0f5132",
        fontSize: "12px",
        padding: "4px 8px",
        borderRadius: "4px",
        fontWeight: "500",
      };
    }
    return {
      backgroundColor: "#fff3cd",
      color: "#664d03",
      fontSize: "12px",
      padding: "4px 8px",
      borderRadius: "4px",
      fontWeight: "500",
    };
  };

  return (
    <div style={{ width: "80vw" }} className="row">
      <div className="col-12">
        {activeMilestone && (
          <>
            {/* Milestone Details */}
            <div
              className="bg-light p-4 rounded mb-4"
              style={{ border: "1px solid #e0e0e0" }}
            >
              <h5 className="fw-bold text-dark mb-3">
                Milestone {activeMilestoneIndex + 1}
              </h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <p className="text-muted mb-1" style={{ fontSize: "12px" }}>
                    Milestone Name
                  </p>
                  <p className="text-dark fw-medium">
                    {activeMilestone.milestone}
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <p className="text-muted mb-1" style={{ fontSize: "12px" }}>
                    Target Amount
                  </p>
                  <p className="text-dark fw-medium">
                    {activeMilestone.target
                      ? `${activeMilestone.target.toLocaleString()}`
                      : "N/A"}
                  </p>
                </div>
                {activeMilestone.description && (
                  <div className="col-12 mb-3">
                    <p className="text-muted mb-1" style={{ fontSize: "12px" }}>
                      Description
                    </p>
                    <p className="text-dark">{activeMilestone.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Updates Section */}
            <div className="pt-4 pb-3">
              <h5
                className="fw-medium text-dark mb-0"
                style={{ fontSize: "18px" }}
              >
                Updates
              </h5>
            </div>

            {!hasUpdates ? (
              <div className="d-flex flex-column align-items-center justify-content-center">
                <div className="mb-4">
                  <Search
                    size={48}
                    className="text-muted"
                    style={{ opacity: 0.4 }}
                  />
                </div>
                <div className="text-center mb-5">
                  <h4
                    className="fw-medium text-dark mb-3"
                    style={{ fontSize: "20px" }}
                  >
                    No updates yet
                  </h4>
                  <p
                    className="text-muted mb-0"
                    style={{ fontSize: "14px", maxWidth: "300px" }}
                  >
                    There are currently no updates for this milestone. New
                    updates will appear here as they are uploaded.
                  </p>
                </div>
              </div>
            ) : (
              activeMilestone.updates.map((update, updateIdx) => (
                <div
                  className="d-flex mb-4"
                  key={`${activeMilestone.id}-${updateIdx}`}
                >
                  <div className="flex-shrink-0 me-3">
                    <Image
                      src={logo}
                      alt="Update logo"
                      width={25}
                      height={25}
                      className="bg-white rounded-circle m-2"
                    />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-2 gap-2">
                      <h6 className="mb-0 fw-semibold text-dark">
                        {project?.donor?.name || "Project Donor"}
                      </h6>
                      <span style={getStatusBadgeStyle(update.status)}>
                        {update.status?.charAt(0).toUpperCase() +
                          update.status?.slice(1).toLowerCase() || "Pending"}
                      </span>
                      <small className="text-muted">
                        {new Date(update.createdAt).toLocaleString()}
                      </small>
                    </div>
                    <p className="mb-3 text-dark lh-base">{update.narration}</p>

                    {update.image && (
                      <div className="mb-2">
                        <Image
                          src={update.image}
                          alt="Update visual"
                          onClick={() => setExpandedImage(update.image)}
                          className="rounded"
                          style={{
                            maxWidth: "80px",
                            maxHeight: "80px",
                            cursor: "pointer",
                            border: "1px solid #e0e0e0",
                            transition: "transform 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Add new update */}
            {role === "NGO" && (
              <div className="bg-white border mt-4">
                <div className="container-fluid h-100">
                  <div className="p-4">
                    <div className="mb-3">
                      <label
                        className="form-label text-muted"
                        style={{ fontSize: "12px" }}
                      >
                        Target Achieved (Amount)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter target achieved amount"
                        value={targetAchieved}
                        onChange={(e) => setTargetAchieved(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        className="form-label text-muted"
                        style={{ fontSize: "12px" }}
                      >
                        Update Narrative
                      </label>
                      <textarea
                        className="form-control"
                        placeholder="Write your update narrative here..."
                        rows={3}
                        value={narration}
                        onChange={(e) => setNarration(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>

                    {previewUrl && (
                      <div className="mb-3">
                        <div className="position-relative d-inline-block">
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            className="rounded"
                            style={{
                              maxWidth: "120px",
                              maxHeight: "120px",
                              border: "1px solid #e0e0e0",
                            }}
                          />
                          <button
                            onClick={() => {
                              setUploadedImage(null);
                              setPreviewUrl(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                            className="btn btn-sm btn-danger position-absolute"
                            style={{
                              top: "-8px",
                              right: "-8px",
                              borderRadius: "50%",
                              width: "24px",
                              height: "24px",
                              padding: "0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="d-flex gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-link p-0 text-muted"
                        style={{ border: "none", background: "none" }}
                        disabled={isSubmitting}
                        title="Upload image"
                      >
                        <Plus size={20} />
                      </button>
                      <button
                        onClick={handleSubmitUpdate}
                        className="btn btn-link p-0 text-success"
                        style={{ border: "none", background: "none" }}
                        disabled={
                          isSubmitting ||
                          !narration.trim() ||
                          !targetAchieved.trim()
                        }
                        title="Submit update"
                      >
                        <Send size={20} />
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {!activeMilestone && (
          <div className="d-flex flex-column align-items-center justify-content-center">
            <div className="mb-4">
              <Search
                size={48}
                className="text-muted"
                style={{ opacity: 0.4 }}
              />
            </div>
            <div className="text-center mb-5">
              <h4
                className="fw-medium text-dark mb-3"
                style={{ fontSize: "20px" }}
              >
                No milestones yet
              </h4>
              <p
                className="text-muted mb-0"
                style={{ fontSize: "14px", maxWidth: "300px" }}
              >
                There are currently no milestones for this project.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Image Expansion Modal */}
      <Modal
        show={!!expandedImage}
        onHide={() => setExpandedImage(null)}
        centered
        size="lg"
      >
        <Modal.Header className="border-0 bg-dark">
          <button
            className="btn-close btn-close-white"
            onClick={() => setExpandedImage(null)}
          />
        </Modal.Header>
        <Modal.Body
          className="bg-dark p-0 d-flex align-items-center justify-content-center"
          style={{ minHeight: "500px" }}
        >
          {expandedImage && (
            <Image
              src={expandedImage}
              alt="Expanded"
              style={{
                maxWidth: "100%",
                maxHeight: "600px",
                objectFit: "contain",
              }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MileStoneUpdates;
