import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { all_routes } from "../../../router/all_routes";
import {
  gender,
  status,
} from "../../../../core/common/selectoption/selectoption";

import CommonSelect from "../../../../core/common/commonSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import { useStudentById } from "../hooks/useStudentById";
import { useStudentMutations } from "../hooks/useStudentMutations";
import { studentSchema } from "../models/student.schema";
import type { StudentModel } from "../models/student.model";
import { useGetClassesQuery } from "../../../academic/classes/api/classApi";


const AddStudent = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const location = useLocation();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");
    if (id) {
      setStudentId(id);
    }
  }, [location]);

  const { studentDetails, isLoading: isFetching } = useStudentById(studentId);
  const {
    createStudent,
    updateStudent,
    isCreating,
    isUpdating,
    isCreateSuccess,
    isUpdateSuccess,
    createError,
    updateError,
  } = useStudentMutations();

  // Fetch classes for dropdowns
  const { data: classesData } = useGetClassesQuery();

  // Form setup
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<StudentModel>({
    resolver: yupResolver(studentSchema),
    defaultValues: {
      status: 'active',
      gender: 'male',
    },
  });

  // watch selected class so sections update reactively
  const selectedClassId = useWatch({ control, name: 'class_assigned' });

  // Check if it's edit mode and populate form
  useEffect(() => {
    if (location.pathname === routes.editStudent && studentId) {
      setIsEdit(true);
      if (studentDetails) {
        reset({
          first_name: studentDetails.first_name || '',
          last_name: studentDetails.last_name || '',
          gender: studentDetails.gender || 'male',
          student_id: studentDetails.student_id || '',
          email: studentDetails.email || '',
          admission_number: studentDetails.admission_number || '',
          admission_date: studentDetails.admission_date
            ? dayjs(studentDetails.admission_date).format('YYYY-MM-DD')
            : '',
          roll_number: studentDetails.roll_number || '',
          status: studentDetails.status || 'active',
          class_assigned: studentDetails.class_assigned || '',
          section: studentDetails.section || '',
        });
      }
    } else {
      setIsEdit(false);
      reset({
        status: 'active',
        gender: 'male',
      });
    }
  }, [location.pathname, studentDetails, reset, studentId, routes.editStudent]);

  // Handle form submission
  const onSubmit = async (data: StudentModel) => {
    try {
      // Prepare payload with only required fields as per API specification
      const payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender,
        student_id: data.student_id,
        email: data.email,
        admission_number: data.admission_number,
        admission_date: data.admission_date,
        roll_number: data.roll_number,
        status: data.status,
        class_assigned: data.class_assigned,
        section: data.section,
      };

      if (isEdit && studentId) {
        await updateStudent({
          id: studentId,
          data: payload,
        });
      } else {
        await createStudent(payload);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Navigate back on success
  useEffect(() => {
    if (isCreateSuccess || isUpdateSuccess) {
      navigate(routes.studentList);
    }
  }, [isCreateSuccess, isUpdateSuccess, navigate, routes.studentList]);

  if (isFetching && isEdit) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="mb-1">{isEdit ? "Edit" : "Add"} Student</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={routes.studentList}>Students</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {isEdit ? "Edit" : "Add"} Student
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          {/* /Page Header */}
          {/* Error Display */}
          {(createError || updateError) && (
            <div className="alert alert-danger">
              Error: {'Something went wrong. Please try again.'}
            </div>
          )}

          <div className="row">
            <div className="col-md-12">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Personal Information */}
                <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-info-square-rounded fs-16" />
                      </span>
                      <h4 className="text-dark">Personal Information</h4>
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="d-flex align-items-center flex-wrap row-gap-3 mb-3">
                          <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                            <i className="ti ti-photo-plus fs-16" />
                          </div>
                          <div className="profile-upload">
                            <div className="profile-uploader d-flex align-items-center">
                              <div className="drag-upload-btn mb-3">
                                Upload
                                <input
                                  type="file"
                                  className="form-control image-sign"
                                  multiple
                                  accept="image/*"
                                  title="Upload student photo"
                                  placeholder="Choose file"
                                />
                              </div>
                              <Link to="#" className="btn btn-primary mb-3">
                                Remove
                              </Link>
                            </div>
                            <p className="fs-12">Upload image size 4MB, Format JPG, PNG, SVG</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row row-cols-xxl-5 row-cols-md-6">
                      {/* First Name */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">First Name *</label>
                          <Controller
                            name="first_name"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                              />
                            )}
                          />
                          {errors.first_name && (
                            <div className="invalid-feedback">{errors.first_name.message}</div>
                          )}
                        </div>
                      </div>

                      {/* Last Name */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Last Name *</label>
                          <Controller
                            name="last_name"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                              />
                            )}
                          />
                          {errors.last_name && (
                            <div className="invalid-feedback">{errors.last_name.message}</div>
                          )}
                        </div>
                      </div>

                      {/* Student ID */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Student ID *</label>
                          <Controller
                            name="student_id"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={`form-control ${errors.student_id ? 'is-invalid' : ''}`}
                              />
                            )}
                          />
                          {errors.student_id && (
                            <div className="invalid-feedback">{errors.student_id.message}</div>
                          )}
                        </div>
                      </div>

                      {/* Gender */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Gender *</label>
                          <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                              <CommonSelect
                                {...field}
                                className={`select ${errors.gender ? 'is-invalid' : ''}`}
                                // normalize option values to lowercase to match schema ('male','female','other')
                                options={gender.map((g) => ({ value: String(g.value).toLowerCase(), label: g.label }))}
                              />
                            )}
                          />
                          {errors.gender && (
                            <div className="invalid-feedback d-block">{errors.gender.message}</div>
                          )}
                        </div>
                      </div>

                      {/* Class */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Class *</label>
                          <Controller
                            name="class_assigned"
                            control={control}
                            render={({ field }) => (
                              <CommonSelect
                                value={field.value}
                                // when class changes, reset section selection
                                onChange={(val) => {
                                  field.onChange(val);
                                  setValue('section', '');
                                }}
                                className={`select ${errors.class_assigned ? 'is-invalid' : ''}`}
                                options={
                                  classesData?.results?.map((cls) => ({
                                    value: cls.id!,
                                    label: cls.name,
                                  })) || []
                                }
                              />
                            )}
                          />
                          {errors.class_assigned && (
                            <div className="invalid-feedback d-block">{errors.class_assigned.message}</div>
                          )}
                        </div>
                      </div>

                      {/* Section */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Section *</label>
                          <Controller
                            name="section"
                            control={control}
                            render={({ field: { value, onChange } }) => {
                              const selectedClass = classesData?.results?.find((cls) => cls.id === selectedClassId);
                              const sections = selectedClass?.sections?.map((section) => ({
                                value: section.id!,
                                label: section.name!,
                              })) || [];

                              return (
                                <CommonSelect
                                  value={value}
                                  onChange={onChange}
                                  className={`select ${errors.section ? 'is-invalid' : ''}`}
                                  options={sections}
                                />
                              );
                            }}
                          />
                          {errors.section && (
                            <div className="invalid-feedback d-block">{errors.section.message}</div>
                          )}
                        </div>
                      </div>

                      {/* Roll Number */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Roll Number *</label>
                          <Controller
                            name="roll_number"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={`form-control ${errors.roll_number ? 'is-invalid' : ''}`}
                              />
                            )}
                          />
                          {errors.roll_number && (
                            <div className="invalid-feedback">{errors.roll_number.message}</div>
                          )}
                        </div>
                      </div>

                      {/* Admission Number */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Admission Number *</label>
                          <Controller
                            name="admission_number"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={`form-control ${errors.admission_number ? 'is-invalid' : ''}`}
                              />
                            )}
                          />
                          {errors.admission_number && (
                            <div className="invalid-feedback">{errors.admission_number.message}</div>
                          )}
                        </div>
                      </div>

                      {/* Admission Date */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Admission Date *</label>
                          <div className="input-icon position-relative">
                            <Controller
                              name="admission_date"
                              control={control}
                              render={({ field }) => (
                                <DatePicker
                                  {...field}
                                  value={field.value ? dayjs(field.value) : null}
                                  onChange={(date) =>
                                    field.onChange(date ? date.format('YYYY-MM-DD') : '')
                                  }
                                  className={`form-control datetimepicker ${
                                    errors.admission_date ? 'is-invalid' : ''
                                  }`}
                                  format="DD-MM-YYYY"
                                  placeholder="Select Date"
                                />
                              )}
                            />
                            <span className="input-icon-addon">
                              <i className="ti ti-calendar" />
                            </span>
                          </div>
                          {errors.admission_date && (
                            <div className="invalid-feedback d-block">
                              {errors.admission_date.message}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Status *</label>
                          <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                              <CommonSelect
                                {...field}
                                className="select"
                                options={status}
                                value={field.value === 'active' ? 'Active' : 'Inactive'}
                                onChange={(value) => field.onChange(value === 'Active' ? 'active' : 'inactive')}
                              />
                            )}
                          />
                        </div>
                      </div>

                      {/* Email Address */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Email Address *</label>
                          <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                              />
                            )}
                          />
                          {errors.email && (
                            <div className="invalid-feedback">{errors.email.message}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Personal Information */}

                {/* Guardian Information */}
                {/* <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-user-shield fs-16" />
                      </span>
                      <h4 className="text-dark">Guardian Information</h4>
                    </div>
                  </div>
                  <div className="card-body pb-0">
                    <div>
                      <h5 className="mb-3">Guardian Details</h5>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-2">
                            <div className="d-flex align-items-center flex-wrap">
                              <label className="form-label text-dark fw-normal me-2">
                                If Guardian Is
                              </label>
                              <div className="form-check me-3 mb-2">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="guardian"
                                  id="parents"
                                  defaultChecked
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="parents"
                                >
                                  Parents
                                </label>
                              </div>
                              <div className="form-check me-3 mb-2">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="guardian"
                                  id="guardian"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="guardian"
                                >
                                  Guardian
                                </label>
                              </div>
                              <div className="form-check mb-2">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="guardian"
                                  id="other"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="other"
                                >
                                  Others
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center flex-wrap row-gap-3 mb-3">
                            <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                              <i className="ti ti-photo-plus fs-16" />
                            </div>
                            <div className="profile-upload">
                              <div className="profile-uploader d-flex align-items-center">
                                <div className="drag-upload-btn mb-3">
                                  Upload
                                  <input
                                    type="file"
                                    className="form-control image-sign"
                                    multiple
                                    accept="image/*"
                                    title="Upload guardian photo"
                                    placeholder="Choose file"
                                  />
                                </div>
                                <Link to="#" className="btn btn-primary mb-3">
                                  Remove
                                </Link>
                              </div>
                              <p className="fs-12">
                                Upload image size 4MB, Format JPG, PNG, SVG
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Guardian Name</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={
                                isEdit ? "Jerald Vicinius" : undefined
                              }
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Guardian Relation
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={isEdit ? "Uncle" : undefined}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Phone Number</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={
                                isEdit ? "+1 45545 46464" : undefined
                              }
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              defaultValue={
                                isEdit ? "jera@example.com" : undefined
                              }
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Occupation</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={isEdit ? "Mechanic" : undefined}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Address</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={
                                isEdit
                                  ? "3495 Red Hawk Road, Buffalo Lake, MN 55314"
                                  : undefined
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                {/* /Guardian Information */}

                {/* Action Buttons */}
                <div className="text-end">
                  <button
                    type="button"
                    className="btn btn-light me-3"
                    onClick={() => navigate(routes.studentList)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isCreating || isUpdating}
                  >
                    {isCreating || isUpdating
                      ? 'Saving...'
                      : isEdit
                      ? 'Update Student'
                      : 'Add Student'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default AddStudent;
