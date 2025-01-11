import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile } from '../../util/APIUtils';
import { Tabs, notification } from 'antd';
import LoadingIndicator from '../../common/LoadingIndicator';
import NotFound from '../../common/NotFound';
import PollList from '../../poll/PollList';
import { API_ERROR_MESSAGES } from '../../constants';

const { TabPane } = Tabs;

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const { username } = useParams();

    const loadUserProfile = useCallback(() => {
        setLoading(true);

        getUserProfile(username)
            .then(response => {
                setUser(response);
                setLoading(false);
            })
            .catch(error => {
                if (error.status === 404) {
                    setNotFound(true);
                } else {
                    notification.error({
                        message: 'Profil Yüklenemedi',
                        description: error.message || API_ERROR_MESSAGES.SERVER_ERROR
                    });
                }
                setLoading(false);
            });
    }, [username]);

    useEffect(() => {
        loadUserProfile();
    }, [loadUserProfile]);

    if (notFound) {
        return <NotFound />;
    }

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <div className="profile">
            {user && (
                <div className="user-profile">
                    <div className="user-avatar-circle">
                        <span className="avatar-text">{user.name[0].toUpperCase()}</span>
                    </div>
                    <div className="user-summary">
                        <div className="full-name">{user.name}</div>
                        <div className="username">@{user.username}</div>
                        <div className="user-joined">
                            Joined {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                    <div className="user-poll-stats">
                        <Tabs defaultActiveKey="1">
                            <TabPane 
                                tab={<span>{user.pollCount} Polls</span>}
                                key="1"
                            >
                                <PollList username={username} type="USER_CREATED_POLLS" />
                            </TabPane>
                            <TabPane 
                                tab={<span>{user.voteCount} Votes</span>}
                                key="2"
                            >
                                <PollList username={username} type="USER_VOTED_POLLS" />
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            )}
        </div>
    );
} 