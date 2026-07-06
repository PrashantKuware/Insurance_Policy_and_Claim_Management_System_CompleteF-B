import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import DangerButton from "./DangerButton";
import IconButton from "./IconButton";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDanger = false,
  loading = false,
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const ConfirmBtn = isDanger ? DangerButton : PrimaryButton;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
            />

            {/* Modal box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 text-left align-middle shadow-2xl backdrop-blur-xl transition-all"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-slate-800/85">
                <div className="flex items-center gap-2.5">
                  {isDanger && <FaExclamationTriangle className="w-5 h-5 text-red-500" />}
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    {title}
                  </h3>
                </div>
                <IconButton icon={FaTimes} onClick={onClose} size="sm" title="Close dialog" />
              </div>

              <div className="mt-4">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {message}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3.5">
                <SecondaryButton onClick={onClose} disabled={loading}>
                  {cancelLabel}
                </SecondaryButton>
                <ConfirmBtn onClick={onConfirm} loading={loading}>
                  {confirmLabel}
                </ConfirmBtn>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
