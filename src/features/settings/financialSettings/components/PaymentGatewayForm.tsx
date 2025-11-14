import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { PaymentGatewayModel } from '../models/paymentGateway.model';
import { CURRENCY_CHOICES, GATEWAY_CHOICES } from '../models/paymentGateway.model';
import { paymentGatewaySchema } from '../models/paymentGateway.schema';

interface PaymentGatewayFormProps {
  defaultValues?: PaymentGatewayModel;
  mode?: 'add' | 'edit';
  onSubmit: (data: Omit<PaymentGatewayModel, 'id'>) => Promise<void> | void;
  onActiveModal?: (modalType: null) => void;
}

export default function PaymentGatewayForm({
  mode = 'add',
  defaultValues,
  onSubmit,
}: PaymentGatewayFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Omit<PaymentGatewayModel, 'id'>>({
    resolver: yupResolver(paymentGatewaySchema),
    defaultValues: {
      gateway_name: defaultValues?.gateway_name ?? 'sslcommerz',
      store_id: defaultValues?.store_id ?? '',
      store_password: defaultValues?.store_password ?? '',
      sandbox_mode: defaultValues?.sandbox_mode ?? true,
      currency: defaultValues?.currency ?? 'BDT',
      callback_url: defaultValues?.callback_url ?? '',
      cancel_url: defaultValues?.cancel_url ?? '',
      is_active: defaultValues?.is_active ?? true,
    },
  });

  return (
    <form id="payment-gateway-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row g-3">
        {/* Basic Information */}
        <div className="col-md-12">
          <div className="border rounded p-3 mb-3">
            <h6 className="mb-3">Basic Information</h6>
            <div className="row">
              {/* Gateway Name */}
              <div className="col-md-6">
                <label className="form-label">
                  Gateway Name <span className="text-danger">*</span>
                </label>
                <Controller
                  name="gateway_name"
                  control={control}
                  render={({ field }) => (
                    <select
                      className={`form-select ${errors.gateway_name ? 'is-invalid' : ''}`}
                      {...field}
                    >
                      <option value="">Select Gateway</option>
                      {GATEWAY_CHOICES.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.gateway_name && (
                  <div className="invalid-feedback">{errors.gateway_name.message}</div>
                )}
              </div>

              {/* Currency */}
              <div className="col-md-6">
                <label className="form-label">
                  Currency <span className="text-danger">*</span>
                </label>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <select
                      className={`form-select ${errors.currency ? 'is-invalid' : ''}`}
                      {...field}
                    >
                      <option value="">Select Currency</option>
                      {CURRENCY_CHOICES.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label} ({option.value})
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.currency && (
                  <div className="invalid-feedback">{errors.currency.message}</div>
                )}
              </div>

              {/* Store ID */}
              <div className="col-md-6">
                <label className="form-label">
                  Store ID <span className="text-danger">*</span>
                </label>
                <Controller
                  name="store_id"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      className={`form-control ${errors.store_id ? 'is-invalid' : ''}`}
                      {...field}
                      placeholder="Enter store ID"
                    />
                  )}
                />
                {errors.store_id && (
                  <div className="invalid-feedback">{errors.store_id.message}</div>
                )}
              </div>

              {/* Store Password */}
              <div className="col-md-6">
                <label className="form-label">
                  Store Password <span className="text-danger">*</span>
                </label>
                <Controller
                  name="store_password"
                  control={control}
                  render={({ field }) => (
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control ${errors.store_password ? 'is-invalid' : ''}`}
                        {...field}
                        placeholder="Enter store password"
                      />
                      <button
                        type="button"
                        className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-decoration-none pe-3"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ zIndex: 10 }}
                      >
                        <i className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'}`} />
                      </button>
                      {errors.store_password && (
                        <div className="invalid-feedback">{errors.store_password.message}</div>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Configuration */}
        <div className="col-md-12">
          <div className="border rounded p-3 mb-3">
            <h6 className="mb-3">Configuration</h6>
            <div className="row">
              {/* Sandbox Mode */}
              <div className="col-md-6">
                <label className="form-label">
                  Mode <span className="text-danger">*</span>
                </label>
                <Controller
                  name="sandbox_mode"
                  control={control}
                  render={({ field }) => (
                    <select
                      className={`form-select ${errors.sandbox_mode ? 'is-invalid' : ''}`}
                      {...field}
                      value={field.value ? 'true' : 'false'}
                      onChange={(e) => field.onChange(e.target.value === 'true')}
                    >
                      <option value="true">Sandbox (Test Mode)</option>
                      <option value="false">Live (Production)</option>
                    </select>
                  )}
                />
                {errors.sandbox_mode && (
                  <div className="invalid-feedback">{errors.sandbox_mode.message}</div>
                )}
              </div>

              {/* Is Active */}
              <div className="col-md-6">
                <label className="form-label">Status</label>
                <Controller
                  name="is_active"
                  control={control}
                  render={({ field }) => (
                    <select
                      className="form-select"
                      {...field}
                      value={field.value ? 'true' : 'false'}
                      onChange={(e) => field.onChange(e.target.value === 'true')}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  )}
                />
              </div>

              {/* Callback URL */}
              <div className="col-md-12">
                <label className="form-label">
                  Callback URL <span className="text-danger">*</span>
                </label>
                <Controller
                  name="callback_url"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="url"
                      className={`form-control ${errors.callback_url ? 'is-invalid' : ''}`}
                      {...field}
                      placeholder="https://school.com/payment/success/"
                    />
                  )}
                />
                {errors.callback_url && (
                  <div className="invalid-feedback">{errors.callback_url.message}</div>
                )}
                <small className="text-muted">URL where successful payments will redirect</small>
              </div>

              {/* Cancel URL */}
              <div className="col-md-12">
                <label className="form-label">
                  Cancel URL <span className="text-danger">*</span>
                </label>
                <Controller
                  name="cancel_url"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="url"
                      className={`form-control ${errors.cancel_url ? 'is-invalid' : ''}`}
                      {...field}
                      placeholder="https://school.com/payment/cancel/"
                    />
                  )}
                />
                {errors.cancel_url && (
                  <div className="invalid-feedback">{errors.cancel_url.message}</div>
                )}
                <small className="text-muted">URL where cancelled payments will redirect</small>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-md-12">
          <div className="mt-3">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting
                ? 'Saving...'
                : mode === 'edit'
                ? 'Update Payment Gateway'
                : 'Create Payment Gateway'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
