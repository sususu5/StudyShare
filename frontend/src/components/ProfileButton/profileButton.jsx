// frontend/src/components/ProfileButton/profileButton.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfileButton() {
    const [avatarUrl, setAvatarUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAvatarUrl = async () => {
            try {
                const token = localStorage.getItem('authToken');// TODO: This should work after login
                const dataResponse = await fetch('http://localhost:5000/api/data');
                if (!dataResponse.ok) {
                  console.error('Failed to fetch data');
                  return;
                }
                const contentType = dataResponse.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                  console.error('Response is not JSON');
                  return;
                }
                const data1 = await dataResponse.json();
                console.log("result ", data1);
                const user = data1.users.find(u => u.token.includes(token));
                const userId = user.userId;
                const response = await fetch(`http://localhost:5000/api/user/avatar/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch avatar URL');
                }
                const data = await response.json();
                console.log("data: ", data);
                setAvatarUrl(data.avatar);
            } catch (error) {
                console.log("error: ", error);
                console.error('Error fetching avatar URL:', error);
            }
        };

        fetchAvatarUrl();
    }, [avatarUrl]);

    const handleProfileClick = () => {
        navigate('/profilePage');
    };

    return (
        <div onClick={handleProfileClick} style={styles.container}>
            {avatarUrl ? (
                <img src={avatarUrl} alt="User Avatar" style={styles.avatar} />
            ) : (
                <div style={styles.placeholder}></div>
            )}
        </div>
    );
}

const styles = {
    container: {
        cursor: 'pointer',
        display: 'inline-block',
        marginRight: '10px',
        marginTop: '10px',
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
    },
    placeholder: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

export default ProfileButton;
