import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
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
              const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
              });
              const userData = await response.json();
              console.log("userData ", userData);
              setUser(userData);
            } catch (err) {
                console.log("error ", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleChangePassword = async () => {
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
            const response = await fetch(`http://localhost:5000/api/user/password/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            if (!response.ok) {
                throw new Error('Failed to change password');
            }

            const result = await response.json();
            console.log('Password changed successfully:', result);
            setOldPassword(''); // Clear old password input
            setNewPassword(''); // Clear new password input
            setIsModalOpen(false); // Close the modal on success
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Error changing password: ' + error.message); // Show error message
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1 style={{ fontSize: '2rem', marginLeft: '50px', fontFamily: 'Roboto, sans-serif' }}>Profile</h1>
            <div>
                <img src={user.avatar} alt="Avatar" style={{ width: '100px', height: '100px', borderRadius: '20%', marginLeft: '50px' }} />
            </div>
            <p style={{ fontSize: '1.5rem', fontFamily: 'Roboto mono', marginLeft: '50px' }}>userId: {user.userId}</p>
            <p style={{ fontSize: '1.5rem', fontFamily: 'Roboto mono', marginLeft: '50px' }}>username: {user.username}</p>
            <button onClick={openModal} style={{ marginLeft: '50px' }}>
                Change Password
            </button>

            <ReactModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Change Password"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#646cff',
                        borderRadius: '10px',
                        padding: '20px',
                    },
                }}
            >
                <span className="close" onClick={closeModal}>&times;</span>
                <h2>Change Password</h2>
                <input
                    type="password"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    style={{ height: '20px', borderRadius: '5px', border: '1px solid #ccc', padding: '10px' }}
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ height: '20px', borderRadius: '5px', border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}
                />
                <button onClick={handleChangePassword} style={{ marginLeft: '20px' }}>
                    Submit
                </button>
            </ReactModal>
        </div>
    );
}

export default ProfilePage;
