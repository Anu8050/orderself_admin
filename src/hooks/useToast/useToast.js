import { Alert, Portal, Snackbar } from "@mui/material";

import React from "react";

const Ctx = React.createContext();

// Styled Components
// ==============================

const ToastContainer = (props) => (
  <div style={{ position: "fixed", right: 0, top: 0 }} {...props} />
);

const Toast = ({ toast, onDismiss }) => (
  // <div
  //   style={{
  //     background: "LemonChiffon",
  //     cursor: "pointer",
  //     fontSize: 14,
  //     margin: 10,
  //     padding: 10,
  //   }}
  //   onClick={onDismiss}
  // >
  //   {children}
  // </div>

  <>
    <Portal>
      <Snackbar open={toast.show} autoHideDuration={2000} onClose={onDismiss}>
        <Alert
          onClose={onDismiss}
          severity={toast.severity}
          sx={{
            width: "max-content",
            zIndex: "99999",
            position: "fixed",
            right: "50px",
            top: "60px",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Portal>
  </>
);

// Provider
// ==============================

let toastCount = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const add = (content) => {
    const id = toastCount++;
    const toast = { content, id };
    setToasts([...toasts, toast]);
  };

  const remove = (id) => {
    const newToasts = toasts.filter((t) => t.id !== id);
    setToasts(newToasts);
  };
  // avoid creating a new fn on every render
  const onDismiss = (id) => () => remove(id);

  return (
    <Ctx.Provider value={{ add, remove }}>
      {children}
      <ToastContainer>
        {toasts.map(({ content, id, ...rest }) => (
          <Toast
            key={id}
            Toast={Toast}
            onDismiss={onDismiss(id)}
            toast={content}
            {...rest}
          />
        ))}
      </ToastContainer>
    </Ctx.Provider>
  );
}

// Consumer
// ==============================

export const useToast = () => React.useContext(Ctx);

export default useToast;
