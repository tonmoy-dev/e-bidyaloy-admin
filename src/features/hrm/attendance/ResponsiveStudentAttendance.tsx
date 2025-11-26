import { useEffect, useState } from 'react';
import MobileStudentAttendance from './MobileStudentAttendance';
import StudentAttendance from './student-attendance';

const ResponsiveStudentAttendance = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile ? <MobileStudentAttendance /> : <StudentAttendance />;
};

export default ResponsiveStudentAttendance;
