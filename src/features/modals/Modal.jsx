import React from 'react';
import ReactDOM from 'react-dom';

let modalRoot = document.getElementById('modal-root');

if (!modalRoot) {
  modalRoot = document.createElement('div');
  modalRoot.setAttribute('id', 'modal-root');
  document.body.appendChild(modalRoot);
}

class Modal extends React.Component {
  el = document.createElement('div');
  componentDidMount() {
    modalRoot.appendChild(this.el);
  }
  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }
  render() {
    return ReactDOM.createPortal(
      <div
        // onClick={this.props.onClose}
        className="vh-100 vw-100 absolute--fill fixed bg-black-60 overflow-container
        "
      >
        <div
          className="center mw9 ma3 ma5-ns br2 pa3 shadow-1"
          style={{
            background: '#f6f2ef'
          }}
        >
          <div className="w-100 tr">
            <button className="pointer" onClick={this.props.onClose}>
              Close
            </button>
          </div>
          {this.props.children}
        </div>
      </div>,
      modalRoot
    );
  }
}

export default Modal;
