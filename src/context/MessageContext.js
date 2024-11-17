import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { Button } from "../components/ui/button";

const MessageContext = createContext({});

export const MessageProvider = ({ children }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [action, setAction] = useState(null);
    
    const showMessage = (messageText, severityType = 'success', actionButton = null) => {
        // First close any existing message
        setSnackbarOpen(false);
        
        // Use setTimeout to ensure state updates don't clash
        setTimeout(() => {
            setMessage(messageText);
            setSeverity(severityType);
            setAction(actionButton);
            setSnackbarOpen(true);
        }, 100);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
        
        // Clear states after animation completes
        setTimeout(() => {
            setMessage('');
            setAction(null);
            setSeverity('success');
        }, 300);
    };

    const value = {
        showMessage,
        // Helper functions for common message types
        showSuccess: (msg) => showMessage(msg, 'success'),
        showError: (msg) => showMessage(msg, 'error'),
        showWarning: (msg) => showMessage(msg, 'warning'),
        showInfo: (msg) => showMessage(msg, 'info'),
        // Helper for messages with actions
        showActionMessage: (msg, severity, actionText, actionHandler) => {
            showMessage(msg, severity, {
                text: actionText,
                handler: actionHandler
            });
        }
    };

    return (
        <MessageContext.Provider value={value}>
            {children}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                TransitionProps={{ onExited: () => setMessage('') }}
            >
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        backgroundColor: severity === 'success' ? '#F0FDF4' :
                                         severity === 'error' ? '#FEF2F2' :
                                         severity === 'warning' ? '#FFFBEB' :
                                         '#F8F9FC', // Info background
                        color: severity === 'success' ? '#166534' :
                               severity === 'error' ? '#991B1B' :
                               severity === 'warning' ? '#92400E' :
                               '#1B365D', // Info text color
                        border: `1px solid ${severity === 'success' ? '#BBF7D0' :
                                                severity === 'error' ? '#FECACA' :
                                                severity === 'warning' ? '#FEF3C7' :
                                                '#E5E7EB'}`, // Info border
                        '& .MuiAlert-icon': {
                            color: severity === 'success' ? '#16A34A' :
                                   severity === 'error' ? '#DC2626' :
                                   severity === 'warning' ? '#D97706' :
                                   '#FF8C69', // Info icon color
                        },
                        '& .MuiAlert-action': {
                            alignItems: 'center',
                            padding: '0 8px',
                        },
                    }}
                    action={
                        action && (
                            <Button
                                variant="text"
                                size="sm"
                                onClick={action.handler}
                                className="text-white hover:text-gray-200"
                            >
                                {action.text}
                            </Button>
                        )
                    }
                >
                    {message}
                </Alert>
            </Snackbar>
        </MessageContext.Provider>
    );
};

export const useMessage = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessage must be used within a MessageProvider');
    }
    return context;
};