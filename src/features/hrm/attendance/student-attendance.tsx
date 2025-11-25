import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import CommonSelect from '../../../core/common/commonSelect';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import TooltipOption from '../../../core/common/tooltipOption';
import { useGetClassesWithoutPaginationQuery } from '../../academic/examinations/exam-results/api/examResultApi';
import { all_routes } from '../../router/all_routes';
import { useAttendance } from './hook/useAttendance';
import { useAttendanceMutations } from './hook/useAttendanceMutations';

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

const StudentAttendance = () => {
  const routes = all_routes;

  // State management
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceRecord>>({});

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
  const { students, isLoading, isFetching, refetch } = useAttendance(
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
      toast.success('Attendance saved successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  }, [isMarkSuccess]);

  // Handle class change
  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setSelectedSection(''); // Clear section when class changes
  };

  // Handle attendance status change
  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        student_id: studentId,
        status,
      },
    }));
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

  // Handle save attendance
  const handleSaveAttendance = async () => {
    if (!students || students.length === 0) {
      toast.error('No students to save attendance for', {
        position: 'top-right',
      });
      return;
    }

    const payload = {
      class_id: selectedClass,
      section_id: selectedSection,
      subject_id: selectedSubject,
      attendance_date: selectedDate,
      students: Object.values(attendanceData).map((record) => ({
        student_id: record.student_id,
        status: record.status,
        ...(record.remarks && { remarks: record.remarks }),
      })),
    };

    try {
      await bulkMarkAttendance(payload).unwrap();
      // Success handled by isMarkSuccess effect above
    } catch (error) {
      console.error('Failed to save attendance:', error);
      toast.error('Failed to save attendance. Please try again.', {
        position: 'top-right',
      });
    }
  };

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

    // Show toast notification
    const statusText = status === 'present' ? 'Present' : 'Absent';
    toast.info(`All students marked as ${statusText}`, {
      position: 'top-right',
      autoClose: 2000,
    });
  };

  // Get initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Get color for avatar based on status
  const getAvatarColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return 'bg-success';
      case 'absent':
        return 'bg-danger';
      case 'half_day':
        return 'bg-warning';
      case 'late':
        return 'bg-info';
      case 'holiday':
        return 'bg-secondary';
      default:
        return 'bg-primary';
    }
  };

  // Check if save button should be enabled
  const isSaveEnabled = useMemo(() => {
    return students && students.length > 0 && !isMarking;
  }, [students, isMarking]);

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

  // Determine if we should show students
  const shouldShowStudents = students && students.length > 0;
  const showLoading = isLoading || isFetching;

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Student Attendance</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Report</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Student Attendance
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
            </div>
          </div>
          {/* /Page Header */}

          {/* Filter Card */}
          <div className="card">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                {/* Date */}
                <div className="col-lg-2 col-md-6">
                  <label className="form-label mb-2">
                    <i className="ti ti-calendar me-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    onClick={(e) => {
                      const input = e.currentTarget;
                      if (input.showPicker) {
                        input.showPicker();
                      }
                    }}
                  />
                </div>

                {/* Class */}
                <div className="col-lg-2 col-md-6">
                  <label className="form-label mb-2">Class</label>
                  <CommonSelect
                    className="select"
                    options={classOptions}
                    value={selectedClass}
                    onChange={handleClassChange}
                    placeholder="All Classes"
                  />
                </div>

                {/* Section */}
                {/* Section */}
                <div className="col-lg-2 col-md-6">
                  <label className="form-label mb-2">Section</label>
                  <CommonSelect
                    key={selectedClass} // Add this key prop to force re-render when class changes
                    className="select"
                    options={sectionOptions}
                    value={selectedSection}
                    onChange={(value) => setSelectedSection(value)}
                    disabled={!selectedClass}
                    placeholder="All Sections"
                  />
                </div>

                {/* Subject */}
                <div className="col-lg-3 col-md-6">
                  <label className="form-label mb-2">Subject</label>
                  <CommonSelect
                    className="select"
                    options={[
                      { value: '', label: 'Select Subject' },
                      // Add your subject options here
                    ]}
                    value={selectedSubject}
                    onChange={(value) => setSelectedSubject(value)}
                    placeholder="Select Subject"
                  />
                </div>

                {/* Search */}
                <div className="col-lg-3 col-md-6">
                  <label className="form-label mb-2">Search</label>
                  <div className="input-icon-start position-relative">
                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y ms-3" />
                    <input
                      type="text"
                      className="form-control ps-5"
                      placeholder="Name or Roll No..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Filter Card */}

          {/* Stats Card - Show when students are loaded */}
          {shouldShowStudents && (
            <div className="card">
              <div className="card-body py-3">
                <div className="d-flex align-items-center gap-4 flex-wrap">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-medium">Total:</span>
                    <span className="badge bg-primary">{attendanceStats.total}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-medium">Present:</span>
                    <span className="badge bg-success">{attendanceStats.present}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-medium">Absent:</span>
                    <span className="badge bg-danger">{attendanceStats.absent}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-medium">Half Day:</span>
                    <span className="badge bg-warning">{attendanceStats.halfDay}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-medium">Late:</span>
                    <span className="badge bg-info">{attendanceStats.late}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* /Stats Card */}

          {/* Quick Actions Bar - Only show if there are students */}
          {shouldShowStudents && (
            <div className="card">
              <div className="card-body py-3">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="fw-medium">Quick Mark All:</span>
                    <button
                      className="btn btn-sm btn-outline-success d-flex align-items-center"
                      onClick={() => handleMarkAll('present')}
                    >
                      <i className="ti ti-check me-1" />
                      All Present
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger d-flex align-items-center"
                      onClick={() => handleMarkAll('absent')}
                    >
                      <i className="ti ti-x me-1" />
                      All Absent
                    </button>
                  </div>

                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <button className="btn btn-sm btn-outline-light bg-white">
                      <i className="ti ti-grid-dots" />
                    </button>
                    <button className="btn btn-sm btn-dark">
                      <i className="ti ti-list" />
                    </button>
                    <button className="btn btn-sm btn-outline-light bg-white">
                      <i className="ti ti-download me-1" />
                      Export
                    </button>
                    <button
                      className={`btn btn-sm ${isSaveEnabled ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={handleSaveAttendance}
                      disabled={!isSaveEnabled}
                      title={
                        !isSaveEnabled
                          ? 'Please select class, section, subject, and date to save'
                          : 'Save attendance'
                      }
                    >
                      <i className="ti ti-device-floppy me-1" />
                      {isMarking ? 'Saving...' : 'Save Attendance'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* /Quick Actions Bar */}

          {/* Student Cards */}
          {showLoading ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-3 mb-0">Loading students...</p>
              </div>
            </div>
          ) : shouldShowStudents ? (
            filteredStudents.length > 0 ? (
              <div className="row">
                {filteredStudents.map((student: Student) => {
                  const currentStatus = attendanceData[student.id]?.status || 'present';
                  const currentRemarks = attendanceData[student.id]?.remarks || '';
                  const initials = getInitials(student.first_name, student.last_name);
                  const avatarColor = getAvatarColor(currentStatus);

                  return (
                    <div key={student.id} className="col-12 mb-3">
                      <div className="card shadow-sm">
                        <div className="card-body">
                          <div className="row g-3">
                            {/* Student Info & Attendance Buttons */}
                            <div className="col-12">
                              <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                {/* Student Info */}
                                <div className="d-flex align-items-center gap-3">
                                  <div
                                    className={`avatar avatar-lg rounded-circle d-flex align-items-center justify-content-center text-white ${avatarColor}`}
                                    style={{
                                      width: '50px',
                                      height: '50px',
                                      minWidth: '50px',
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
                                      <span className="fw-bold">{initials}</span>
                                    )}
                                  </div>
                                  <div>
                                    <h6 className="mb-1 fw-semibold">
                                      {student.first_name} {student.last_name}
                                    </h6>
                                    <p className="text-muted mb-0 small">
                                      Roll: {student.roll_number || 'N/A'} • Class{' '}
                                      {student.class_name} {student.section_name}
                                    </p>
                                  </div>
                                </div>

                                {/* Attendance Buttons */}
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                  <button
                                    className={`btn btn-sm d-flex align-items-center ${
                                      currentStatus === 'present'
                                        ? 'btn-success'
                                        : 'btn-outline-success'
                                    }`}
                                    onClick={() => handleAttendanceChange(student.id, 'present')}
                                  >
                                    <i className="ti ti-check me-1" />
                                    Present
                                  </button>
                                  <button
                                    className={`btn btn-sm d-flex align-items-center ${
                                      currentStatus === 'absent'
                                        ? 'btn-danger'
                                        : 'btn-outline-danger'
                                    }`}
                                    onClick={() => handleAttendanceChange(student.id, 'absent')}
                                  >
                                    <i className="ti ti-circle-x me-1" />
                                    Absent
                                  </button>
                                  <button
                                    className={`btn btn-sm d-flex align-items-center ${
                                      currentStatus === 'half_day'
                                        ? 'btn-warning text-white'
                                        : 'btn-outline-warning'
                                    }`}
                                    onClick={() => handleAttendanceChange(student.id, 'half_day')}
                                  >
                                    <i className="ti ti-clock me-1" />
                                    Half Day
                                  </button>
                                  <button
                                    className={`btn btn-sm d-flex align-items-center ${
                                      currentStatus === 'late'
                                        ? 'btn-info text-white'
                                        : 'btn-outline-info'
                                    }`}
                                    onClick={() => handleAttendanceChange(student.id, 'late')}
                                  >
                                    <i className="ti ti-clock-pause me-1" />
                                    Late
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Remarks Field */}
                            <div className="col-12">
                              <label className="form-label small mb-1">
                                <i className="ti ti-note me-1" />
                                Remarks (Optional)
                              </label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Add remarks (e.g., Sick, Family emergency, etc.)"
                                value={currentRemarks}
                                onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="card">
                <div className="card-body text-center py-5">
                  <i className="ti ti-user-off" style={{ fontSize: '48px', color: '#ddd' }} />
                  <p className="text-muted mt-3 mb-0">No students found matching your search.</p>
                </div>
              </div>
            )
          ) : (
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="ti ti-users" style={{ fontSize: '48px', color: '#ddd' }} />
                <p className="text-muted mt-3 mb-0">
                  Please select a class and section to view students
                </p>
              </div>
            </div>
          )}
          {/* /Student Cards */}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
