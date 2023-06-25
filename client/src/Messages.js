import { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import styles from './Messages.module.css';

const WS_URL = 'ws://192.168.1.132:8000';

const typesDef = {
    USER_EVENT: 'userevent',
    MESSAGE_EVENT: 'messageevent'
};

function isMessageEvent(message) {
    let evt = JSON.parse(message.data);
    return evt.type === typesDef.MESSAGE_EVENT;
}

function Messages({ username, onUsernameSet }) {
    const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
        onOpen: () => console.log('WebSocket connection established.'),
        share: true,
        filter: () => false,
        retryOnError: true,
        shouldReconnect: () => true
    });

    useEffect(() => {
        if (username && readyState === ReadyState.OPEN) {
            sendJsonMessage({
                username,
                type: typesDef.USER_EVENT
            });
        }
    }, [username, readyState, sendJsonMessage]);

    return (
        <div className={styles.container}>
            {username ? (
                <div className={styles.messageBoard}>
                    <MessageBoard sendJsonMessage={sendJsonMessage} />
                </div>
            ) : (
                <div className={styles.loginSection}>
                    <LoginSection onLogin={onUsernameSet} />
                </div>
            )}
        </div>
    );
}

function MessageBoard({ sendJsonMessage }) {
    const [message, setMessage] = useState('');
    const { lastJsonMessage } = useWebSocket(WS_URL, {
        share: true,
        filter: isMessageEvent
    });

    function sendMessage() {
        sendJsonMessage({
            type: typesDef.MESSAGE_EVENT,
            message: message
        });
        setMessage('');
    }

    return (
        <div>
            <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                className={styles.messageInput}
            />
            <button onClick={sendMessage} className={styles.messageButton}>
                Send
            </button>
            <div className={styles.messageBoard}>
                <div>
                    {(lastJsonMessage?.data.userActivity || []).map((msg, idx) =>
                        <div key={`msg-${idx}`} className={styles.messageItem}>
                            {msg}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function LoginSection({ onLogin }) {
    const [inputUsername, setInputUsername] = useState('');

    function handleLogin() {
        onLogin(inputUsername);
    }

    return (
        <div className={styles.loginSection}>
            <h3 className={styles.loginText}>Enter username:</h3>
            <input
                type="text"
                value={inputUsername}
                onChange={e => setInputUsername(e.target.value)}
                className={styles.loginInput}
            />
            <button onClick={handleLogin} className={styles.loginButton}>
                Login
            </button>
        </div>
    );
}
export default Messages;
