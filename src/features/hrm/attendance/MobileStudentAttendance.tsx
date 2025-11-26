import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import CommonSelect from '../../../core/common/commonSelect';
import { useGetClassesWithoutPaginationQuery } from '../../academic/examinations/exam-results/api/examResultApi';
import { useAttendance } from './hook/useAttendance';
import { useAttendanceMutations } from './hook/useAttendanceMutations';
import { MobileStudentCard } from './MobileStudentCard';

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

const MobileStudentAttendance = () => {
  // State management
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceRecord>>({});
  const [expandedSummary, setExpandedSummary] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [lastAction, setLastAction] = useState<{
    studentId: string;
    previousStatus: AttendanceStatus;
  } | null>(null);
  const [showUndo, setShowUndo] = useState<string | null>(null);

  // API hooks
  const { data: classes } = useGetClassesWithoutPaginationQuery();
  const { bulkMarkAttendance, isMarking, isMarkSuccess } = useAttendanceMutations();

  // Build query params
  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (selectedClass) params.class_assigned = selectedClass;
    if (selectedSection) params.section = selectedSection;
    if (selectedDate) params.date = selectedDate;
    return params;
  }, [selectedClass, selectedSection, selectedDate]);

  // Fetch students based on filters
  const { students, isLoading, isFetching } = useAttendance(
    Object.keys(queryParams).length > 0 ? queryParams : undefined,
  );

  // Get sections for selected class
  const sections = useMemo(() => {
    if (!selectedClass || !classes) return [];
    const selectedClassData = classes.find((c) => c.id === selectedClass);
    return selectedClassData?.sections || [];
  }, [selectedClass, classes]);

  // Class options for dropdown
  const classOptions = useMemo(() => {
    return [
      { value: '', label: 'All Classes' },
      ...(classes?.map((cls) => ({
        value: cls.id,
        label: cls.name,
      })) || []),
    ];
  }, [classes]);

  // Section options for dropdown
  const sectionOptions = useMemo(() => {
    return [
      { value: '', label: 'All Sections' },
      ...sections.map((section) => ({
        value: section.id,
        label: section.name,
      })),
    ];
  }, [sections]);

  // Initialize attendance data when students load
  useEffect(() => {
    if (students && students.length > 0) {
      const initialData: Record<string, AttendanceRecord> = {};
      students.forEach((student: Student) => {
        initialData[student.id] = attendanceData[student.id] || {
          student_id: student.id,
          status: 'present',
          remarks: '',
        };
      });
      setAttendanceData(initialData);
    }
  }, [students]);

  // Reset section when class changes
  useEffect(() => {
    setSelectedSection('');
  }, [selectedClass]);

  // Show success toast when attendance is marked successfully
  useEffect(() => {
    if (isMarkSuccess) {
      toast.success('Attendance saved successfully!');
    }
  }, [isMarkSuccess]);

  // Filter students based on search
  const filteredStudents = useMemo(() => {
    if (!students || students.length === 0) return [];
    if (!searchTerm) return students;

    const lowerSearch = searchTerm.toLowerCase();
    return students.filter((student: Student) => {
      const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
      const rollNo = student.roll_number?.toString().toLowerCase() || '';
      const studentId = student.student_id?.toLowerCase() || '';
      return (
        fullName.includes(lowerSearch) ||
        rollNo.includes(lowerSearch) ||
        studentId.includes(lowerSearch)
      );
    });
  }, [students, searchTerm]);

  // Handle attendance status change
  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
    const student = attendanceData[studentId];
    if (student) {
      setLastAction({ studentId, previousStatus: student.status });
    }

    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        student_id: studentId,
        status,
      },
    }));

    setShowUndo(studentId);
    setTimeout(() => setShowUndo(null), 3000);
  };

  // Handle remarks change
  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  // Handle undo
  const handleUndo = () => {
    if (lastAction) {
      setAttendanceData((prev) => ({
        ...prev,
        [lastAction.studentId]: {
          ...prev[lastAction.studentId],
          status: lastAction.previousStatus,
        },
      }));
      setShowUndo(null);
      setLastAction(null);
    }
  };

  // Handle save attendance
  const handleSaveAttendance = async () => {
    if (!students || students.length === 0) {
      toast.error('No students to save attendance for');
      return;
    }

    const payload = {
      class_id: selectedClass,
      section_id: selectedSection,
      attendance_date: selectedDate,
      students: Object.values(attendanceData).map((record) => ({
        student_id: record.student_id,
        status: record.status,
        ...(record.remarks && { remarks: record.remarks }),
      })),
    };

    try {
      await bulkMarkAttendance(payload).unwrap();
    } catch (error) {
      console.error('Failed to save attendance:', error);
      toast.error('Failed to save attendance. Please try again.');
    }
  };

  // Handle quick mark all
  const handleMarkAll = (status: AttendanceStatus) => {
    if (!students || students.length === 0) return;

    const updatedData: Record<string, AttendanceRecord> = {};
    students.forEach((student: Student) => {
      updatedData[student.id] = {
        student_id: student.id,
        status,
        remarks: attendanceData[student.id]?.remarks || '',
      };
    });
    setAttendanceData(updatedData);

    const statusText = status === 'present' ? 'Present' : 'Absent';
    toast.info(`All students marked as ${statusText}`);
    setShowFilters(false);
  };

  // Count attendance stats
  const attendanceStats = useMemo(() => {
    if (!students || students.length === 0) {
      return { present: 0, absent: 0, halfDay: 0, late: 0, holiday: 0, total: 0 };
    }

    const stats = {
      present: 0,
      absent: 0,
      halfDay: 0,
      late: 0,
      holiday: 0,
      total: students.length,
    };

    students.forEach((student: Student) => {
      const status = attendanceData[student.id]?.status || 'present';
      switch (status) {
        case 'present':
          stats.present++;
          break;
        case 'absent':
          stats.absent++;
          break;
        case 'half_day':
          stats.halfDay++;
          break;
        case 'late':
          stats.late++;
          break;
        case 'holiday':
          stats.holiday++;
          break;
      }
    });

    return stats;
  }, [students, attendanceData]);

  const shouldShowStudents = students && students.length > 0;
  const showLoading = isLoading || isFetching;

  return (
    <div className="page-wrapper">
      <div className="mobile-attendance-view min-vh-100 bg-light pb-5">
        {/* Header */}
        <div className="bg-white border-bottom sticky-top" style={{ top: 0, zIndex: 800 }}>
          <div className="p-3">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h5 className="mb-1">Student Attendance</h5>
                <p className="text-muted small mb-0">
                  {selectedClass && selectedSection
                    ? `Class ${
                        classOptions.find((c) => c.value === selectedClass)?.label
                      } - Section ${sectionOptions.find((s) => s.value === selectedSection)?.label}`
                    : 'Select class and section'}
                </p>
              </div>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <i className="fa fa-filter" style={{ fontSize: '18px' }} />
              </button>
            </div>

            {/* Search */}
            <div className="position-relative">
              <i
                className="fa fa-search position-absolute top-50 translate-middle-y ms-3"
                style={{ fontSize: '16px', left: 0 }}
              />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-top overflow-hidden"
              >
                <div className="p-3 space-y-3" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  <div className="mb-3">
                    <label className="form-label small mb-1">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small mb-1">Class</label>
                    <div style={{ position: 'relative', zIndex: 1000 }}>
                      <CommonSelect
                        className="select"
                        options={classOptions}
                        value={selectedClass}
                        onChange={setSelectedClass}
                        placeholder="Select Class"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small mb-1">Section</label>
                    <div style={{ position: 'relative', zIndex: 1000 }}>
                      <CommonSelect
                        key={selectedClass}
                        className="select"
                        options={sectionOptions}
                        value={selectedSection}
                        onChange={setSelectedSection}
                        disabled={!selectedClass}
                        placeholder="Select Section"
                      />
                    </div>
                  </div>
                  <button className="btn btn-primary w-100" onClick={() => setShowFilters(false)}>
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Summary Stats */}
          {shouldShowStudents && (
            <motion.div
              initial={false}
              animate={{ height: expandedSummary ? 'auto' : 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 pb-2">
                <div className="row g-2">
                  <div className="col">
                    <div className="bg-light rounded p-2 text-center">
                      <div className="fw-bold text-dark">{attendanceStats.total}</div>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                        Total
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="bg-success bg-opacity-10 rounded p-2 text-center">
                      <div className="fw-bold text-success">{attendanceStats.present}</div>
                      <div className="text-success" style={{ fontSize: '0.7rem' }}>
                        Present
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="bg-danger bg-opacity-10 rounded p-2 text-center">
                      <div className="fw-bold text-danger">{attendanceStats.absent}</div>
                      <div className="text-danger" style={{ fontSize: '0.7rem' }}>
                        Absent
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="bg-warning bg-opacity-10 rounded p-2 text-center">
                      <div className="fw-bold text-warning">{attendanceStats.halfDay}</div>
                      <div className="text-warning" style={{ fontSize: '0.7rem' }}>
                        Half
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="bg-info bg-opacity-10 rounded p-2 text-center">
                      <div className="fw-bold text-info">{attendanceStats.late}</div>
                      <div className="text-info" style={{ fontSize: '0.7rem' }}>
                        Late
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Toggle Summary Button */}
          {shouldShowStudents && (
            <button
              onClick={() => setExpandedSummary(!expandedSummary)}
              className="w-100 py-2 bg-transparent border-0 d-flex align-items-center justify-content-center text-muted"
            >
              {expandedSummary ? (
                <i className="fa fa-chevron-up" style={{ fontSize: '16px' }} />
              ) : (
                <i className="fa fa-chevron-down" style={{ fontSize: '16px' }} />
              )}
            </button>
          )}
        </div>

        {/* Swipe Instructions */}
        {shouldShowStudents && (
          <div className="p-3 bg-primary bg-opacity-10 border-bottom">
            <div className="d-flex align-items-center gap-2 small text-primary">
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-3 mb-1">
                  <span>← Absent</span>
                  <span>Present →</span>
                </div>
                <p className="text-muted mb-0" style={{ fontSize: '0.7rem' }}>
                  Swipe cards or tap to expand for more options
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Student Cards */}
        <div className="p-3" style={{ paddingBottom: shouldShowStudents ? '100px' : '16px' }}>
          {showLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-3 mb-0 small">Loading students...</p>
            </div>
          ) : shouldShowStudents ? (
            filteredStudents.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {filteredStudents.map((student: Student) => (
                  <MobileStudentCard
                    key={student.id}
                    student={student}
                    attendance={attendanceData[student.id]}
                    onUpdateStatus={handleAttendanceChange}
                    onUpdateRemarks={handleRemarksChange}
                    showUndo={showUndo === student.id}
                    onUndo={handleUndo}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="ti ti-user-off" style={{ fontSize: '48px', color: '#ddd' }} />
                <p className="text-muted mt-3 mb-0">No students found matching your search.</p>
              </div>
            )
          ) : (
            <div className="text-center py-5">
              <i className="ti ti-users" style={{ fontSize: '48px', color: '#ddd' }} />
              <p className="text-muted mt-3 mb-0">
                Please select a class and section to view students
              </p>
            </div>
          )}
        </div>

        {/* Fixed Bottom Action Bar */}
        {shouldShowStudents && (
          <div
            className="position-fixed bottom-0 start-0 end-0 bg-white border-top shadow-lg"
            style={{ zIndex: 1050, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            <div className="p-3">
              <div className="d-grid gap-2">
                {/* Save Button - Primary Action */}
                <button
                  className="btn btn-primary btn-lg d-flex align-items-center justify-content-center"
                  onClick={handleSaveAttendance}
                  disabled={isMarking}
                >
                  <i className="fa fa-save me-2" style={{ fontSize: '20px' }} />
                  {isMarking ? 'Saving...' : 'Save Attendance'}
                </button>

                {/* Quick Actions Row */}
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-success flex-fill btn-sm d-flex align-items-center justify-content-center"
                    onClick={() => handleMarkAll('present')}
                  >
                    <i className="fa fa-check-double me-1" style={{ fontSize: '14px' }} />
                    <span className="small">All Present</span>
                  </button>
                  <button
                    className="btn btn-outline-danger flex-fill btn-sm d-flex align-items-center justify-content-center"
                    onClick={() => handleMarkAll('absent')}
                  >
                    <i className="fa fa-times me-1" style={{ fontSize: '14px' }} />
                    <span className="small">All Absent</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Undo Notification */}
            <AnimatePresence>
              {showUndo && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="position-absolute bottom-100 start-50 translate-middle-x mb-2"
                >
                  <button onClick={handleUndo} className="btn btn-secondary shadow-lg btn-sm">
                    <i className="fa fa-undo me-1" />
                    Undo
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileStudentAttendance;
