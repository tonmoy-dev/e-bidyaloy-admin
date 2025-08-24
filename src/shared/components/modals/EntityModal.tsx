// components/modals/EntityModal.tsx
type Field = {
  label: string;
  name: string;
  type: 'text' | 'select';
  options?: { label: string; value: string }[];
};
type EntityModalProps = {
  id: string;
  title: string;
  fields: Field[];
  onSubmit: (data: any) => void;
};

const EntityModal: React.FC<EntityModalProps> = ({ id, title, fields, onSubmit }) => (
  <div className="modal fade" id={id}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">{title}</h4>
          <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()));
          }}
        >
          <div className="modal-body">
            {fields.map((f, i) => (
              <div key={i} className="mb-3">
                <label className="form-label">{f.label}</label>
                {f.type === 'text' ? (
                  <input name={f.name} className="form-control" />
                ) : (
                  <select name={f.name} className="form-select">
                    {f.options?.map((opt, idx) => (
                      <option key={idx} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-light" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

export default EntityModal;
