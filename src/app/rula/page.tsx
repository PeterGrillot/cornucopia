"use client";
import { useState } from "react";
import "./module.css";

const size = ["small", "medium", "large"] as const;
type Size = (typeof size)[number];

type ModalProps = React.PropsWithChildren<{
  title?: string;
  size: Size;
  hasClose?: boolean;
  isOpen: boolean;
  onClose: () => void;
}>;

const Modal = ({ title, size, hasClose = false, isOpen, children, onClose }: ModalProps) => {
  if (isOpen) {
    return (
      <div className="modal__wrapper">
        <div className={`modal modal--${size}`}>
          <div className="modal__heading">
            {title ? <h2>{title}</h2> : null}
            {hasClose ? (
              <button className="modal__close" onClick={onClose}>
                x
              </button>
            ) : null}
          </div>
          <div className="modal__content">{children}</div>
        </div>
      </div>
    );
  }
  return null;
};

export function Page() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div className="page">Hello World!</div>
      <button onClick={handleToggle}>Open</button>
      <Modal title="My Modal" size="medium" isOpen={isOpen} hasClose={true} onClose={handleClose}>
        <p>
          It is a long established fact that a reader will be distracted by the readable content of
          a page when looking at its layout. The point of using Lorem Ipsum is that it has a
          more-or-less normal distribution of letters, as opposed to using 'Content here, content
          here', making it look like readable English. Many desktop publishing packages and web page
          editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum'
          will uncover many web sites still in their infancy. Various versions have evolved over the
          years, sometimes by accident, some
        </p>
        <p>
          It is a long established fact that a reader will be distracted by the readable content of
          a page when looking at its layout. The point of using Lorem Ipsum is that it has a
          more-or-less normal distribution of letters, as opposed to using 'Content here, content
          here', making it look like readable English. Many desktop publishing packages and web page
          editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum'
          will uncover many web sites still in their infancy. Various versions have evolved over the
          years, sometimes by accident, some
        </p>
        <p>
          It is a long established fact that a reader will be distracted by the readable content of
          a page when looking at its layout. The point of using Lorem Ipsum is that it has a
          more-or-less normal distribution of letters, as opposed to using 'Content here, content
          here', making it look like readable English. Many desktop publishing packages and web page
          editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum'
          will uncover many web sites still in their infancy. Various versions have evolved over the
          years, sometimes by accident, some
        </p>
        <p>
          It is a long established fact that a reader will be distracted by the readable content of
          a page when looking at its layout. The point of using Lorem Ipsum is that it has a
          more-or-less normal distribution of letters, as opposed to using 'Content here, content
          here', making it look like readable English. Many desktop publishing packages and web page
          editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum'
          will uncover many web sites still in their infancy. Various versions have evolved over the
          years, sometimes by accident, some
        </p>
        <button onClick={handleToggle}>Close</button>
      </Modal>
    </>
  );
}

export default Page;
