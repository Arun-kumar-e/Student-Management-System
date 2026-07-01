import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  studentName: string;
  isDeleting: boolean;
}

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  studentName,
  isDeleting,
}: DeleteConfirmationModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal content dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md overflow-hidden rounded-lg border border-surface-border bg-surface-card p-6 z-10"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="absolute right-4 top-4 rounded-full p-1.5 text-text-muted hover:bg-surface-border hover:text-text-title transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center mt-2">
              {/* Warning Icon Badge */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error mb-4">
                <AlertTriangle size={24} />
              </div>

              <h3 className="text-xl font-semibold mb-2">Delete Student</h3>
              
              <p className="text-text-body mb-6">
                Are you sure you want to delete <span className="font-semibold text-text-title">"{studentName}"</span>? 
                This action is permanent and cannot be undone.
              </p>

              {/* Action buttons */}
              <div className="flex w-full space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  disabled={isDeleting}
                  className="flex-1 py-3 px-4 rounded-md border border-surface-border font-medium text-text-title hover:bg-surface-bg transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="flex-1 py-3 px-4 rounded-md bg-error text-white font-medium hover:bg-error/95 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
