import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CommonSelect from '../../../../core/common/commonSelect';
import {
  ContractTeacher,
  Tgender,
  status,
} 
from '../../../../core/common/selectoption/selectoption';
import TagInput from '../../../../core/common/Taginput';
import { all_routes } from '../../../router/all_routes';
import { useTeacherById } from '../hooks/useTeacherById';
import { useTeacherMutations } from '../hooks/useTeacherMutations';
import type { TeacherModel } from '../models/teacher.model';
import { teacherSchema } from '../models/teacher.schema';

const TeacherForm = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const location = useLocation();
  const [teacherId, setTeacherId] = useState<string | null>(null);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [languagesKnown, setLanguagesKnown] = useState<string[]>([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    if (id) {
      setTeacherId(id);
    }
  }, [location]);

  const { teacherDetails, isLoading: isFetching } = useTeacherById(teacherId);
  const {
    createTeacher,
    updateTeacher,
    isCreating,
    isUpdating,
    isCreateSuccess,
    isUpdateSuccess,
    createError,
    updateError,
  } = useTeacherMutations();

  // Form setup
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TeacherModel>({
    resolver: yupResolver(teacherSchema),
    defaultValues: {
      is_active: true,
      experience_years: 0,
    },
  });

  const handleLanguagesChange = (newTags: string[]) => {
    setLanguagesKnown(newTags);
  };

  // Check if it's edit mode and populate form
  useEffect(() => {
    if (location.pathname === routes.editTeacher && teacherId) {
      setIsEdit(true);
      if (teacherDetails && teacherDetails.user) {
        // Flatten the nested user data with teacher data
        const flattenedData = {
          // User fields
          first_name: teacherDetails.user.first_name || '',
          last_name: teacherDetails.user.last_name || '',
          username: teacherDetails.user.username || '',
          email: teacherDetails.user.email || '',
          phone: teacherDetails.user.phone || '',
          date_of_birth: teacherDetails.user.date_of_birth
            ? dayjs(teacherDetails.user.date_of_birth).format('YYYY-MM-DD')
            : '',
          gender: teacherDetails.user.gender || '',
          address: teacherDetails.user.address || '',

          // Teacher fields
          department: teacherDetails.department || '',
          designation: teacherDetails.designation || '',
          hire_date: teacherDetails.hire_date
            ? dayjs(teacherDetails.hire_date).format('YYYY-MM-DD')
            : '',
          employment_type: teacherDetails.employment_type || '',
          emergency_contact_name: teacherDetails.emergency_contact_name || '',
          emergency_contact_phone: teacherDetails.emergency_contact_phone || '',
          qualifications: teacherDetails.qualifications || '',
          experience_years: teacherDetails.experience_years || 0,
          is_active: teacherDetails.is_active !== undefined ? teacherDetails.is_active : true,
          termination_date: teacherDetails.termination_date
            ? dayjs(teacherDetails.termination_date).format('YYYY-MM-DD')
            : '',
          termination_reason: teacherDetails.termination_reason || '',
        };

        // Populate form with flattened data
        reset(flattenedData);

        // Set languages known - you might need to parse this from qualifications
        // or add a separate field for languages in your API
        const defaultLanguages = ['English']; // Default or parse from qualifications
        setLanguagesKnown(defaultLanguages);
      }
    } else {
      setIsEdit(false);
      reset({
        is_active: true,
        experience_years: 0,
      });
      setLanguagesKnown([]);
    }
  }, [location.pathname, teacherDetails, reset, teacherId, routes.editTeacher]);

  // Handle form submission
  const onSubmit = async (data: TeacherModel) => {
    try {
      if (isEdit && teacherId) {
        await updateTeacher({
          id: teacherId,
          data: {
            ...data,
            date_of_birth: data.date_of_birth,
            hire_date: data.hire_date,
            termination_date: data.termination_date || undefined,
            // Add languages to the data if needed
            languages_known: languagesKnown,
          },
        });
      } else {
        await createTeacher({
          ...data,
          date_of_birth: data.date_of_birth,
          hire_date: data.hire_date,
          languages_known: languagesKnown,
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Navigate back on success
  useEffect(() => {
    if (isCreateSuccess || isUpdateSuccess) {
      navigate(routes.teacherList);
    }
  }, [isCreateSuccess, isUpdateSuccess, navigate, routes.teacherList]);

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
              <h3 className="mb-1">{isEdit ? 'Edit' : 'Add'} Teacher</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={routes.teacherList}>Teacher</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {isEdit ? 'Edit' : 'Add'} Teacher
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          {/* /Page Header */}

          {/* Error Display */}
          {(createError || updateError) && (
            <div className="alert alert-danger">
              Error: {createError?.message || updateError?.message || 'Something went wrong'}
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

                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">User Name *</label>
                          <Controller
                            name="username"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                              />
                            )}
                          />
                          {errors.username && (
                            <div className="invalid-feedback">{errors.username.message}</div>
                          )}
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Phone Number *</label>
                          <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                              />
                            )}
                          />
                          {errors.phone && (
                            <div className="invalid-feedback">{errors.phone.message}</div>
                          )}
                        </div>
                      </div>

                      {/* Email */}
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

                      {/* Date of Birth */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Date of Birth *</label>
                          <div className="input-icon position-relative">
                            <Controller
                              name="date_of_birth"
                              control={control}
                              render={({ field }) => (
                                <DatePicker
                                  {...field}
                                  value={field.value ? dayjs(field.value) : null}
                                  onChange={(date) =>
                                    field.onChange(date ? date.format('YYYY-MM-DD') : '')
                                  }
                                  className={`form-control datetimepicker ${
                                    errors.date_of_birth ? 'is-invalid' : ''
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
                          {errors.date_of_birth && (
                            <div className="invalid-feedback d-block">
                              {errors.date_of_birth.message}
                            </div>
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
                                options={Tgender}
                              />
                            )}
                          />
                          {errors.gender && (
                            <div className="invalid-feedback d-block">{errors.gender.message}</div>
                          )}
                        </div>
                      </div>

                      {/* Department */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Department *</label>
                          <Controller
                            name="department"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={`form-control ${errors.department ? 'is-invalid' : ''}`}
                              />
                            )}
                          />
                          {errors.department && (
                            <div className="invalid-feedback">{errors.department.message}</div>
                          )}
                        </div>
                      </div>

                      {/* Designation */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Designation *</label>
                          <Controller
                            name="designation"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={`form-control ${errors.designation ? 'is-invalid' : ''}`}
                              />
                            )}
                          />
                          {errors.designation && (
                            <div className="invalid-feedback">{errors.designation.message}</div>
                          )}
                        </div>
                      </div>

                      {/* Hire Date */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Date of Joining *</label>
                          <div className="input-icon position-relative">
                            <Controller
                              name="hire_date"
                              control={control}
                              render={({ field }) => (
                                <DatePicker
                                  {...field}
                                  value={field.value ? dayjs(field.value) : null}
                                  onChange={(date) =>
                                    field.onChange(date ? date.format('YYYY-MM-DD') : '')
                                  }
                                  className={`form-control datetimepicker ${
                                    errors.hire_date ? 'is-invalid' : ''
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
                          {errors.hire_date && (
                            <div className="invalid-feedback d-block">
                              {errors.hire_date.message}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Employment Type */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Employment Type *</label>
                          <Controller
                            name="employment_type"
                            control={control}
                            render={({ field }) => (
                              <CommonSelect
                                {...field}
                                className={`select ${errors.employment_type ? 'is-invalid' : ''}`}
                                options={ContractTeacher}
                              />
                            )}
                          />
                          {errors.employment_type && (
                            <div className="invalid-feedback d-block">
                              {errors.employment_type.message}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Emergency Contact Name */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Emergency Contact Name *</label>
                          <Controller
                            name="emergency_contact_name"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={`form-control ${
                                  errors.emergency_contact_name ? 'is-invalid' : ''
                                }`}
                              />
                            )}
                          />
                          {errors.emergency_contact_name && (
                            <div className="invalid-feedback">
                              {errors.emergency_contact_name.message}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Emergency Contact Phone */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Emergency Contact Phone *</label>
                          <Controller
                            name="emergency_contact_phone"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={`form-control ${
                                  errors.emergency_contact_phone ? 'is-invalid' : ''
                                }`}
                              />
                            )}
                          />
                          {errors.emergency_contact_phone && (
                            <div className="invalid-feedback">
                              {errors.emergency_contact_phone.message}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Qualifications */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Qualification *</label>
                          <Controller
                            name="qualifications"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={`form-control ${
                                  errors.qualifications ? 'is-invalid' : ''
                                }`}
                              />
                            )}
                          />
                          {errors.qualifications && (
                            <div className="invalid-feedback">{errors.qualifications.message}</div>
                          )}
                        </div>
                      </div>

                      {/* Experience Years */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Work Experience (Years) *</label>
                          <Controller
                            name="experience_years"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="number"
                                min="0"
                                className={`form-control ${
                                  errors.experience_years ? 'is-invalid' : ''
                                }`}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            )}
                          />
                          {errors.experience_years && (
                            <div className="invalid-feedback">
                              {errors.experience_years.message}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Address */}
                      <div className="col-xxl-3 col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Address *</label>
                          <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                              />
                            )}
                          />
                          {errors.address && (
                            <div className="invalid-feedback">{errors.address.message}</div>
                          )}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-xxl-3 col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Status *</label>
                          <Controller
                            name="is_active"
                            control={control}
                            render={({ field }) => (
                              <CommonSelect
                                {...field}
                                className="select"
                                options={status}
                                value={field.value ? 'Active' : 'Inactive'}
                                onChange={(value) => field.onChange(value === 'Active')}
                              />
                            )}
                          />
                        </div>
                      </div>

                      {/* Language Known */}
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Language Known</label>
                          <TagInput
                            initialTags={languagesKnown}
                            onTagsChange={handleLanguagesChange}
                          />
                        </div>
                      </div>

                      {/* Termination Date (if inactive) */}
                      {!watch('is_active') && (
                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Termination Date</label>
                            <div className="input-icon position-relative">
                              <Controller
                                name="termination_date"
                                control={control}
                                render={({ field }) => (
                                  <DatePicker
                                    {...field}
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(date) =>
                                      field.onChange(date ? date.format('YYYY-MM-DD') : '')
                                    }
                                    className="form-control datetimepicker"
                                    format="DD-MM-YYYY"
                                    placeholder="Select Date"
                                  />
                                )}
                              />
                              <span className="input-icon-addon">
                                <i className="ti ti-calendar" />
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Termination Reason (if inactive) */}
                      {!watch('is_active') && (
                        <div className="col-xxl col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Termination Reason</label>
                            <Controller
                              name="termination_reason"
                              control={control}
                              render={({ field }) => (
                                <input {...field} type="text" className="form-control" />
                              )}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* /Personal Information */}

                {/* Action Buttons */}
                <div className="text-end">
                  <button
                    type="button"
                    className="btn btn-light me-3"
                    onClick={() => navigate(routes.teacherList)}
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
                      ? 'Update Teacher'
                      : 'Add Teacher'}
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

export default TeacherForm;
