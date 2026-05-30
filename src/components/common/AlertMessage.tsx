import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertMessageProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
  className?: string;
}

const config: Record<AlertType, { icon: React.ReactNode; classes: string }> = {
  success: {
    icon: <CheckCircle className="w-4 h-4 flex-shrink-0" />,
    classes: 'bg-green-50 border-green-200 text-green-800',
  },
  error: {
    icon: <XCircle className="w-4 h-4 flex-shrink-0" />,
    classes: 'bg-red-50 border-red-200 text-red-700',
  },
  warning: {
    icon: <AlertCircle className="w-4 h-4 flex-shrink-0" />,
    classes: 'bg-amber-50 border-amber-200 text-amber-800',
  },
  info: {
    icon: <AlertCircle className="w-4 h-4 flex-shrink-0" />,
    classes: 'bg-blue-50 border-blue-200 text-blue-800',
  },
};

export default function AlertMessage({ type, message, onClose, className = '' }: AlertMessageProps) {
  const { icon, classes } = config[type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className={`flex items-start gap-2.5 p-3.5 rounded-xl border text-sm font-medium ${classes} ${className}`}
      >
        {icon}
        <span className="flex-1 leading-relaxed">{message}</span>
        {onClose && (
          <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100 transition-opacity flex-shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
