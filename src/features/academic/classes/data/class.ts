import type { ClassModel } from "../models/class.model";

export const classDataSample: ClassModel[] = [
  {
    id: 1,
    name: "Grade 1",
    class_teacher: "Mrs. Rahman",
    is_active: true,
    sections: [
      { id: 1, name: "A", teacher: "Mr. Karim", is_active: true },
      { id: 2, name: "B", teacher: "Ms. Fatema", is_active: true },
    ],
  },
  {
    id: 2,
    name: "Grade 2",
    class_teacher: "Mr. Hossain",
    is_active: true,
    sections: [
      { id: 3, name: "A", teacher: "Mrs. Jahan", is_active: true },
      { id: 4, name: "B", teacher: "Mr. Alam", is_active: false },
    ],
  },
  {
    id: 3,
    name: "Grade 3",
    class_teacher: "Ms. Nahar",
    is_active: false, // maybe this class is not active currently
    sections: [
      { id: 5, name: "A", teacher: "Mr. Shuvo", is_active: true },
    ],
  },
];