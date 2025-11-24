import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useStudentTypeMutations } from './hooks/useStudentTypeMutations';
import { useStudentTypes } from './hooks/useStudentTypes';
import type { StudentType, StudentTypeFormData } from './models/studentType.model';
import { studentTypeSchema } from './models/studentType.schema';

const StudentTypeModal = () => {
  const [editingType, setEditingType] = useState<StudentType | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { studentTypes, isLoading, refetch } = useStudentTypes();
  const { handleCreate, handleUpdate, handleDelete, isMutating } = useStudentTypeMutations();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentTypeFormData>({
    resolver: yupResolver(studentTypeSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
    },
  });

  useEffect(() => {
    if (editingType) {
      reset({
        name: editingType.name,
        description: editingType.description || '',
        status: editingType.status || 'active',
      });
      setShowForm(true);
    }
  }, [editingType, reset]);

  const onSubmit = async (data: StudentTypeFormData) => {
    if (editingType && editingType.id) {
      const result = await handleUpdate(editingType.id, data);
      if (result.success) {
        toast.success('Student type updated successfully');
        resetForm();
        refetch();
      } else {
        toast.error(result.error || 'Failed to update student type');
      }
    } else {
      const result = await handleCreate(data);
      if (result.success) {
        toast.success('Student type created successfully');
        resetForm();
        refetch();
      } else {
        toast.error(result.error || 'Failed to create student type');
      }
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;

    const result = await handleDelete(deletingId);
    if (result.success) {
      toast.success('Student type deleted successfully');
      setDeletingId(null);
      refetch();
      // Close delete modal
      const deleteModalElement = document.getElementById('delete_student_type_modal');
      if (deleteModalElement) {
        const bootstrapModal = (
          window as unknown as {
            bootstrap?: {
              Modal: { getInstance: (element: HTMLElement) => { hide: () => void } | null };
            };
          }
        ).bootstrap?.Modal.getInstance(deleteModalElement);
        if (bootstrapModal) {
          bootstrapModal.hide();
        }
      }
    } else {
      toast.error(result.error || 'Failed to delete student type');
    }
  };

  const resetForm = () => {
    reset({
      name: '',
      description: '',
      status: 'active',
    });
    setEditingType(null);
    setShowForm(false);
  };

  const handleEdit = (type: StudentType) => {
    setEditingType(type);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  return (
    <>
      {/* Student Type Modal */}
      <div className="modal fade" id="student_type_modal">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Manage Student Types</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={resetForm}
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              {/* Add/Edit Form */}
              {showForm ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">
                          {editingType ? 'Edit Student Type' : 'Add New Student Type'}
                        </h5>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={resetForm}
                          disabled={isMutating}
                        >
                          <i className="ti ti-x me-1" />
                          Cancel
                        </button>
                      </div>

                      <div className="row">
                        <div className="col-md-8">
                          <div className="mb-3">
                            <label className="form-label">
                              Name <span className="text-danger">*</span>
                            </label>
                            <Controller
                              name="name"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="text"
                                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                  placeholder="Enter student type name"
                                  disabled={isMutating}
                                />
                              )}
                            />
                            {errors.name && (
                              <div className="invalid-feedback d-block">{errors.name.message}</div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label className="form-label">Status</label>
                            <Controller
                              name="status"
                              control={control}
                              render={({ field }) => (
                                <select
                                  {...field}
                                  className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                                  disabled={isMutating}
                                >
                                  <option value="active">Active</option>
                                  <option value="inactive">Inactive</option>
                                </select>
                              )}
                            />
                            {errors.status && (
                              <div className="invalid-feedback d-block">
                                {errors.status.message}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="form-label">Description</label>
                            <Controller
                              name="description"
                              control={control}
                              render={({ field }) => (
                                <textarea
                                  {...field}
                                  className={`form-control ${
                                    errors.description ? 'is-invalid' : ''
                                  }`}
                                  rows={3}
                                  placeholder="Enter description (optional)"
                                  disabled={isMutating}
                                />
                              )}
                            />
                            {errors.description && (
                              <div className="invalid-feedback d-block">
                                {errors.description.message}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-end gap-2">
                        <button type="submit" className="btn btn-primary" disabled={isMutating}>
                          {isMutating ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              {editingType ? 'Updating...' : 'Creating...'}
                            </>
                          ) : (
                            <>
                              <i className={`ti ${editingType ? 'ti-check' : 'ti-plus'} me-1`} />
                              {editingType ? 'Update' : 'Create'}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="mb-3">
                  <button type="button" className="btn btn-primary" onClick={handleAddNew}>
                    <i className="ti ti-plus me-1" />
                    Add New Student Type
                  </button>
                </div>
              )}

              {/* List of Student Types */}
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-3">Student Types</h5>
                  {isLoading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : studentTypes.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      <i className="ti ti-inbox fs-1 d-block mb-2" />
                      <p>No student types found</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentTypes.map((type) => (
                            <tr key={type.id}>
                              <td>
                                <strong>{type.name}</strong>
                              </td>
                              <td>
                                <span className="text-muted">{type.description || '-'}</span>
                              </td>
                              <td>
                                <span
                                  className={`badge ${
                                    type.status === 'active'
                                      ? 'badge-soft-success'
                                      : 'badge-soft-danger'
                                  }`}
                                >
                                  <i className="ti ti-circle-filled me-1" />
                                  {type.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td>
                                <div className="d-flex justify-content-end gap-2">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-icon btn-light"
                                    onClick={() => handleEdit(type)}
                                    title="Edit"
                                  >
                                    <i className="ti ti-edit" />
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-icon btn-light"
                                    onClick={() => type.id && handleDeleteClick(type.id)}
                                    data-bs-toggle="modal"
                                    data-bs-target="#delete_student_type_modal"
                                    title="Delete"
                                    disabled={!type.id}
                                  >
                                    <i className="ti ti-trash" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="delete_student_type_modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <div className="avatar avatar-xl bg-danger-transparent rounded-circle mb-3 mx-auto">
                <i className="ti ti-trash-x fs-2" />
              </div>
              <h4 className="mb-2">Delete Student Type?</h4>
              <p className="mb-0 text-muted">
                Are you sure you want to delete this student type? This action cannot be undone.
              </p>
              <div className="d-flex justify-content-center gap-3 mt-4">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                  disabled={isMutating}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                  disabled={isMutating}
                >
                  {isMutating ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Deleting...
                    </>
                  ) : (
                    'Yes, Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentTypeModal;
