import type { PanInfo } from 'motion/react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { useState } from 'react';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';

type AttendanceStatus = 'present' | 'late' | 'absent' | 'holiday' | 'half_day';

interface AttendanceRecord {
  student_id: string;
  status: AttendanceStatus;
  remarks?: string;
}

interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  class_assigned: string;
  class_name: string;
  section: string;
  section_name: string;
  roll_number: string;
  status: string;
  type: string | null;
  profile_image?: string;
}

interface MobileStudentCardProps {
  student: Student;
  attendance: AttendanceRecord;
  onUpdateStatus: (id: string, status: AttendanceStatus) => void;
  onUpdateRemarks: (id: string, remarks: string) => void;
  showUndo: boolean;
  onUndo: () => void;
}

const statusConfig = {
  present: {
    color: 'success',
    bgColor: 'bg-success',
    icon: 'fa-check-circle',
    label: 'Present',
    border: 'border-success',
  },
  absent: {
    color: 'danger',
    bgColor: 'bg-danger',
    icon: 'fa-times-circle',
    label: 'Absent',
    border: 'border-danger',
  },
  half_day: {
    color: 'warning',
    bgColor: 'bg-warning',
    icon: 'fa-clock',
    label: 'Half Day',
    border: 'border-warning',
  },
  late: {
    color: 'info',
    bgColor: 'bg-info',
    icon: 'fa-clock',
    label: 'Late',
    border: 'border-info',
  },
  holiday: {
    color: 'secondary',
    bgColor: 'bg-secondary',
    icon: 'fa-times-circle',
    label: 'Holiday',
    border: 'border-secondary',
  },
};

export function MobileStudentCard({
  student,
  attendance,
  onUpdateStatus,
  onUpdateRemarks,
}: MobileStudentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const x = useMotionValue(0);

  const backgroundColor = useTransform(
    x,
    [-100, 0, 100],
    ['rgba(220, 53, 69, 0.1)', 'rgba(255, 255, 255, 1)', 'rgba(25, 135, 84, 0.1)'],
  );

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 80;
    if (info.offset.x > threshold) {
      onUpdateStatus(student.id, 'present');
    } else if (info.offset.x < -threshold) {
      onUpdateStatus(student.id, 'absent');
    }
    x.set(0);
  };

  const currentStatus = attendance?.status || 'present';
  const currentRemarks = attendance?.remarks || '';
  const statusIcon = statusConfig[currentStatus]?.icon || 'fa-check-circle';
  const statusBorder = statusConfig[currentStatus]?.border || 'border-secondary';

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const initials = getInitials(student.first_name, student.last_name);

  return (
    <div className="position-relative">
      {/* Swipe Background Indicators */}
      <div
        className="position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-between px-4"
        style={{ pointerEvents: 'none' }}
      >
        <div className="d-flex align-items-center gap-2 text-danger">
          <i className="fa fa-times-circle" style={{ fontSize: '20px' }} />
          <span className="small">Absent</span>
        </div>
        <div className="d-flex align-items-center gap-2 text-success">
          <span className="small">Present</span>
          <i className="fa fa-check-circle" style={{ fontSize: '20px' }} />
        </div>
      </div>

      {/* Card */}
      <motion.div
        style={{ x, backgroundColor }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className={`bg-white rounded shadow-sm border-start border-4 ${statusBorder} overflow-hidden position-relative`}
        whileTap={{ cursor: 'grabbing' }}
      >
        {/* Compact View */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-3"
          style={{ cursor: 'pointer', touchAction: 'pan-y' }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3 flex-grow-1">
              {/* Avatar */}
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center text-white ${
                  statusConfig[currentStatus]?.bgColor || 'bg-primary'
                }`}
                style={{
                  width: '48px',
                  height: '48px',
                  minWidth: '48px',
                  flexShrink: 0,
                }}
              >
                {student.profile_image ? (
                  <ImageWithBasePath
                    src={student.profile_image}
                    className="img-fluid rounded-circle"
                    alt={`${student.first_name} ${student.last_name}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <span className="fw-bold small">{initials}</span>
                )}
              </div>

              {/* Student Info */}
              <div className="flex-grow-1 min-w-0">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <div className="bg-light rounded px-2 py-1">
                    <span className="small text-muted">{student.roll_number || 'N/A'}</span>
                  </div>
                </div>
                <h6 className="mb-0 text-truncate">
                  {student.first_name} {student.last_name}
                </h6>
                <div className="d-flex align-items-center gap-1 mt-1">
                  <i
                    className={`fa ${statusIcon} text-${statusConfig[currentStatus]?.color}`}
                    style={{ fontSize: '12px' }}
                  />
                  <span className="small text-muted">
                    {statusConfig[currentStatus]?.label || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Icon */}
            <div className={`rounded-circle p-2 ${statusConfig[currentStatus]?.bgColor}`}>
              <i className={`fa ${statusIcon} text-white`} style={{ fontSize: '20px' }} />
            </div>
          </div>

          {/* Remarks Preview */}
          {currentRemarks && (
            <div className="mt-2 d-flex align-items-start gap-2 bg-light p-2 rounded small">
              <i
                className="fa fa-comment-dots mt-1 flex-shrink-0 text-muted"
                style={{ fontSize: '14px' }}
              />
              <p className="mb-0 text-muted text-truncate">{currentRemarks}</p>
            </div>
          )}
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-top overflow-hidden"
          >
            <div className="p-3">
              {/* Status Buttons */}
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <button
                    className={`btn w-100 btn-sm d-flex align-items-center justify-content-center ${
                      currentStatus === 'present' ? 'btn-success' : 'btn-outline-success'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateStatus(student.id, 'present');
                    }}
                  >
                    <i className="fa fa-check-circle me-1" style={{ fontSize: '16px' }} />
                    <span className="small">Present</span>
                  </button>
                </div>
                <div className="col-6">
                  <button
                    className={`btn w-100 btn-sm d-flex align-items-center justify-content-center ${
                      currentStatus === 'absent' ? 'btn-danger' : 'btn-outline-danger'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateStatus(student.id, 'absent');
                    }}
                  >
                    <i className="fa fa-times-circle me-1" style={{ fontSize: '16px' }} />
                    <span className="small">Absent</span>
                  </button>
                </div>
                <div className="col-6">
                  <button
                    className={`btn w-100 btn-sm d-flex align-items-center justify-content-center ${
                      currentStatus === 'half_day'
                        ? 'btn-warning text-white'
                        : 'btn-outline-warning'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateStatus(student.id, 'half_day');
                    }}
                  >
                    <i className="fa fa-clock me-1" style={{ fontSize: '16px' }} />
                    <span className="small">Half Day</span>
                  </button>
                </div>
                <div className="col-6">
                  <button
                    className={`btn w-100 btn-sm d-flex align-items-center justify-content-center ${
                      currentStatus === 'late' ? 'btn-info text-white' : 'btn-outline-info'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateStatus(student.id, 'late');
                    }}
                  >
                    <i className="fa fa-clock me-1" style={{ fontSize: '16px' }} />
                    <span className="small">Late</span>
                  </button>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="form-label small mb-1">Remarks</label>
                <textarea
                  className="form-control form-control-sm"
                  placeholder="Add any notes..."
                  value={currentRemarks}
                  onChange={(e) => {
                    e.stopPropagation();
                    onUpdateRemarks(student.id, e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  rows={2}
                  style={{ fontSize: '0.875rem' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
