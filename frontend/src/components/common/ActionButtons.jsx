import React from "react";
import { FaEye, FaEdit, FaTrash, FaCheck, FaBan } from "react-icons/fa";
import IconButton from "./IconButton";

const ActionButtons = ({
  onDetails,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  detailsTitle = "View details",
  editTitle = "Edit record",
  deleteTitle = "Delete record",
  activateTitle = "Activate status",
  deactivateTitle = "Deactivate status",
}) => {
  return (
    <div className="flex items-center gap-1">
      {onDetails && (
        <IconButton
          icon={FaEye}
          onClick={onDetails}
          title={detailsTitle}
          className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          size="sm"
        />
      )}
      {onEdit && (
        <IconButton
          icon={FaEdit}
          onClick={onEdit}
          title={editTitle}
          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          size="sm"
        />
      )}
      {onActivate && (
        <IconButton
          icon={FaCheck}
          onClick={onActivate}
          title={activateTitle}
          className="text-emerald-500 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          size="sm"
        />
      )}
      {onDeactivate && (
        <IconButton
          icon={FaBan}
          onClick={onDeactivate}
          title={deactivateTitle}
          className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
          size="sm"
        />
      )}
      {onDelete && (
        <IconButton
          icon={FaTrash}
          onClick={onDelete}
          title={deleteTitle}
          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          size="sm"
        />
      )}
    </div>
  );
};

export default ActionButtons;
