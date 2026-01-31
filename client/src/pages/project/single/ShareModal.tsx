/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FaTiktok } from "react-icons/fa";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

interface ShareModalProps {
  isOpen: boolean;
  toggle: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, toggle }) => {
  const shareUrl = "https://givingback.org";
  const title = "Support this project on GiveBack";

  const socialLinks = [
    {
      name: "Facebook",
      Component: FacebookShareButton,
      Icon: FacebookIcon,
      props: { url: shareUrl, quote: title, hashtag: "#GiveBack" },
    },
    {
      name: "Twitter",
      Component: TwitterShareButton,
      Icon: TwitterIcon,
      props: { url: shareUrl, title: title },
    },
    {
      name: "LinkedIn",
      Component: LinkedinShareButton,
      Icon: LinkedinIcon,
      props: { url: shareUrl, title: title },
    },
    {
      name: "WhatsApp",
      Component: WhatsappShareButton,
      Icon: WhatsappIcon,
      props: { url: shareUrl, title: title, separator: " - " },
    },
    {
      name: "Email",
      Component: EmailShareButton,
      Icon: EmailIcon,
      props: {
        url: shareUrl,
        subject: title,
        body: "Help make a lasting impact. Support projects on GiveBack",
      },
    },
    {
      name: "TikTok",
      Component: "a",
      Icon: FaTiktok,
      props: {
        href: `https://www.tiktok.com/`,
        target: "_blank",
        rel: "noopener noreferrer",
      },
      isCustom: true,
    },
  ];

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="md">
      <ModalHeader
        toggle={toggle}
        style={{ borderBottom: "1px solid #e0e0e0" }}
      >
        Share This Project
      </ModalHeader>
      <ModalBody style={{ padding: "30px" }}>
        <div style={{ marginBottom: "20px" }}>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            Share this project with your network to help make a lasting impact.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
            gap: "20px",
            justifyItems: "center",
          }}
        >
          {socialLinks.map((social) => {
            const { Component, Icon, name, props, isCustom } = social;
            const ShareComponent = Component as any;

            if (isCustom) {
              return (
                <div key={name} style={{ textAlign: "center" }}>
                  <a
                    {...props}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                      textDecoration: "none",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "48px",
                        color: "#000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={48} />
                    </div>
                    <span style={{ fontSize: "12px", color: "#666" }}>
                      {name}
                    </span>
                  </a>
                </div>
              );
            }

            return (
              <div key={name} style={{ textAlign: "center" }}>
                <ShareComponent {...props}>
                  <div
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Icon size={48} round />
                    <span style={{ fontSize: "12px", color: "#666" }}>
                      {name}
                    </span>
                  </div>
                </ShareComponent>
              </div>
            );
          })}
        </div>
      </ModalBody>
      <ModalFooter style={{ borderTop: "1px solid #e0e0e0" }}>
        <button
          type="button"
          className="btn btn-light"
          onClick={toggle}
          style={{ borderRadius: "6px" }}
        >
          Close
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ShareModal;
