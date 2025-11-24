export interface ComplaintModel {
  id: string;
  complaint_type: string;
  subject: string;
  description: string;
  attachment?: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  complainant: string;
  complainant_name?: string;
  complainant_email?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  resolved_by?: string;
  resolved_by_name?: string;
  resolved_at?: string;
  response_message?: string;
  organization?: string;
  organization_name?: string;
  created_at: string;
  updated_at: string;
}
