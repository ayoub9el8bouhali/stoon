export function BootstrapModal({ id, title, children, footer }) {
  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-labelledby={`${id}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content stoon-modal">
          <div className="modal-header">
            <h2 className="modal-title fs-5" id={`${id}Label`}>
              {title}
            </h2>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fermer" />
          </div>
          <div className="modal-body">{children}</div>
          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
